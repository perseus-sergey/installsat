import { executePoolQuery } from './mysqldb.mjs';
import { EDBTableTitles, DB_ARRAY_SEPARATOR, sleep } from './commons.mjs';
import {
  generateChannelAbout,
  updateGeneratedDataDB,
  RELIABLE_THRESHOLD,
} from './flyChannelAbout.controller.mjs';
import { audioLanguages, wrongAudio } from './languages.mjs';

const { FLY_CHANNELS } = EDBTableTitles;

const SIMULTANEOUS_GENERATE_LIMIT = 50;

export const emptyChannelDescription = {
  uaText: null,
  enText: null,
  enDescription: null,
  uaDescription: null,
  uaKeywords: null,
  enKeywords: null,
  languages: null,
  siteUrl: null,
  genreId: 0,
};

// interface IDbChannelDataAbout {
//   title: string | null;
//   text_ua: string | null;
//   text_en: string | null;
//   description_en: string | null;
//   description_ua: string | null;
//   keywords_ua: string | null;
//   keywords_en: string | null;
//   languages: string | null;
//   official_site_url: string | null;
//   theme_id: number | null;
//   a_pid: string | null;
//   is_radio: 0 | 1 | null;
// }

const getSatChannelsFromDB = async (currentSatSlug) => {
  const sql = `
    SELECT 
    F.title, 
    MAX(F.is_radio) as is_radio,
    (SELECT GROUP_CONCAT(a_pid SEPARATOR '${DB_ARRAY_SEPARATOR}')
     FROM ${FLY_CHANNELS} 
     WHERE title = F.title) as a_pid,
    (SELECT MAX(text_en) 
     FROM ${FLY_CHANNELS} 
     WHERE title = F.title) as text_en,
    (SELECT MAX(description_en) 
     FROM ${FLY_CHANNELS} 
     WHERE title = F.title) as description_en,
    (SELECT MAX(description_ua) 
     FROM ${FLY_CHANNELS} 
     WHERE title = F.title) as description_ua,
    (SELECT MAX(keywords_ua) 
     FROM ${FLY_CHANNELS} 
     WHERE title = F.title) as keywords_ua,
    (SELECT MAX(keywords_en) 
     FROM ${FLY_CHANNELS} 
     WHERE title = F.title) as keywords_en,
    (SELECT MAX(languages) 
     FROM ${FLY_CHANNELS} 
     WHERE title = F.title) as languages,
    (SELECT MAX(official_site_url) 
     FROM ${FLY_CHANNELS} 
     WHERE title = F.title) as official_site_url,
    (SELECT MAX(theme_id) 
     FROM ${FLY_CHANNELS} 
     WHERE title = F.title) as theme_id
FROM 
    ${FLY_CHANNELS} F
WHERE 
    F.sat_slug = ?
    AND (F.theme_id != 0 OR F.theme_id IS NULL)
    AND (F.description_en IS NULL OR F.description_en = '')
GROUP BY 
    F.title
LIMIT 
    ${SIMULTANEOUS_GENERATE_LIMIT};

  `;
  const res = await executePoolQuery(sql, [currentSatSlug]);
  // const res = (await executePoolQuery(sql, [currentSatSlug])) as
  //   | IDbChannelDataAbout[]
  //   | Error;

  return res instanceof Error
    ? `ERROR: SELECT channel titles from satellite: "${currentSatSlug}". Error message: ${res.message}`
    : res;
};

const getLanguageString = (aPids) => {
  if (!aPids) return '';

  const langsSet = new Set();

  aPids.split(DB_ARRAY_SEPARATOR).forEach((part) => {
    const parts = part.trim().split(' ');

    if (parts[1]) {
      const langPart = parts[1].trim().toLowerCase();

      if (!wrongAudio.includes(langPart)) {
        langsSet.add(langPart);
      }
    }
  });

  return Array.from(langsSet)
    .map((lang) => audioLanguages[lang] || lang)
    .join(', ');
};

const getAiChannelAbout = async (dbChannelData) => {
  const langString = getLanguageString(dbChannelData.a_pid);

  const generatedDataRes = await generateChannelAbout({
    channelTitle: dbChannelData.title,
    language: langString,
    ifRadio: dbChannelData.is_radio,
  });

  return typeof generatedDataRes === 'string'
    ? {
        shouldUpdateData: { ...emptyChannelDescription, genreId: null },
        shouldUpdateMessage: generatedDataRes,
        langString,
      }
    : generatedDataRes.reliableRate < RELIABLE_THRESHOLD
      ? {
          shouldUpdateData: emptyChannelDescription,
          shouldUpdateMessage: `ERROR: Reliable AI Rate ${generatedDataRes.reliableRate} < allowed threshold (${RELIABLE_THRESHOLD})`,
          langString,
        }
      : {
          shouldUpdateData: generatedDataRes,
          shouldUpdateMessage: `SUCCESS: Generated channel descriptions for "${dbChannelData.title}" channel`,
          langString,
        };
};

const getShouldUpdateData = async (dbChannelData) => {
  return dbChannelData.text_ua &&
    dbChannelData.text_en &&
    dbChannelData.description_en &&
    dbChannelData.description_ua &&
    dbChannelData.theme_id
    ? {
        shouldUpdateData: {
          uaText: dbChannelData.text_ua,
          enText: dbChannelData.text_en,
          enDescription: dbChannelData.description_en,
          uaDescription: dbChannelData.description_ua,
          uaKeywords: dbChannelData.keywords_ua,
          enKeywords: dbChannelData.keywords_en,
          languages: dbChannelData.languages,
          siteUrl: dbChannelData.official_site_url,
          genreId: dbChannelData.theme_id,
        },
        shouldUpdateMessage: null,
        langString: '',
      }
    : getAiChannelAbout(dbChannelData);
};

export const extractAndUpdateData = async (dbChannelData) => {
  const messages = [];

  const { shouldUpdateData, shouldUpdateMessage, langString } =
    await getShouldUpdateData(dbChannelData);

  if (shouldUpdateMessage) messages.push(shouldUpdateMessage);

  const updateAllChanWithSameTitleRes = await updateGeneratedDataDB(
    shouldUpdateData,
    dbChannelData.title
  );
  messages.push(
    updateAllChanWithSameTitleRes instanceof Error
      ? `ERROR: DB UPDATE data for channels with title "${title}". Error message: ${updateAllChanWithSameTitleRes.message}`
      : shouldUpdateData.genreId === 0
        ? `- Add EMPTY descriptions for ${updateAllChanWithSameTitleRes} channel(s) with name "${title}"`
        : `SUCCESS: Add ${updateAllChanWithSameTitleRes} channel descriptions for "${title}" channel(s)`
  );

  return { extractAndUpdateMessages: messages, langString };
};

export const addDescriptionForChannels = async (currentSatSlug) => {
  const messages = [];

  const dbChannelsRes = await getSatChannelsFromDB(currentSatSlug);
  if (typeof dbChannelsRes === 'string') return [dbChannelsRes];

  for (const channel of dbChannelsRes) {
    messages.push(`┌──────────────── "${channel.title}" ────────────────┐`);
    const { extractAndUpdateMessages, langString } =
      await extractAndUpdateData(channel);
    messages.push(...extractAndUpdateMessages);
    messages.push(`└──────── "${langString}" ───────────┘`);

    await sleep(500);
  }

  return messages;
};

// UPDATE fly_channels
//       SET
//         text_ua = null,
//         text_en = null,
//         description_en = null,
//         description_ua = null,
//         keywords_ua = null,
//         keywords_en = null,
//         languages = null,
//         official_site_url = null,
//         theme_id = null
//       WHERE title = 'Prime One'
//       WHERE title IN ('title1', 'title2', 'title3')
