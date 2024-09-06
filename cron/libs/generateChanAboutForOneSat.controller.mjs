import { executePoolQuery } from './mysqldb.mjs';
import { EDBTableTitles, DB_ARRAY_SEPARATOR, sleep } from './commons.mjs';
import {
  generateChannelAbout,
  updateGeneratedDataDB,
} from './flyChannelAbout.controller.mjs';
import { audioLanguages, wrongAudio } from './languages.mjs';

const { FLY_CHANNELS } = EDBTableTitles;

const SIMULTANEOUS_GENERATE_LIMIT = 70;

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

const getSatChannelsFromDB = async (currentSatSlug) => {
  const sql = `
    SELECT title, GROUP_CONCAT(a_pid SEPARATOR '${DB_ARRAY_SEPARATOR}') as a_pid, MAX(is_radio) as is_radio
    FROM ${FLY_CHANNELS} 
    WHERE sat_slug = ? 
    AND (theme_id != 0 OR theme_id IS NULL)
    AND (description_en IS NULL OR description_en = '') 
    GROUP BY title
    LIMIT ${SIMULTANEOUS_GENERATE_LIMIT}
  `;
  const res = await executePoolQuery(sql, [currentSatSlug]);

  return res instanceof Error
    ? `ERROR: SELECT channel titles from satellite: "${currentSatSlug}"`
    : res;
};

export const findInDbChannelAbout = async (title) => {
  const sql = `
    SELECT 
      text_ua,
      text_en,
      description_en,
      description_ua,
      keywords_ua,
      keywords_en,
      languages,
      official_site_url,
      theme_id
    FROM ${FLY_CHANNELS}
    WHERE title = ? 
    AND description_en IS NOT NULL 
    AND description_en != ''
    LIMIT 1
  `;
  const res = await executePoolQuery(sql, [title]);

  return res;
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

const getShouldUpdateData = async (title, a_pid, is_radio) => {
  const findDbRes = await findInDbChannelAbout(title);

  if (findDbRes instanceof Error) {
    return {
      shouldUpdateData: emptyChannelDescription,
      shouldUpdateMessage: `ERROR: SELECT data when searching channel About in DB for channel "${title}". Message: ${findDbRes.message}`,
    };
  }

  if (findDbRes.length === 0) {
    const langString = getLanguageString(a_pid);

    const generatedDataRes = await generateChannelAbout({
      channelTitle: title,
      language: langString,
      ifRadio: is_radio,
    });

    return typeof generatedDataRes === 'string'
      ? {
          shouldUpdateData: emptyChannelDescription,
          shouldUpdateMessage: generatedDataRes,
        }
      : {
          shouldUpdateData: generatedDataRes,
          shouldUpdateMessage: `SUCCESS: Generated channel descriptions for "${title}" channel`,
        };
  }

  return {
    shouldUpdateData: {
      uaText: findDbRes[0].text_ua,
      enText: findDbRes[0].text_en,
      enDescription: findDbRes[0].description_en,
      uaDescription: findDbRes[0].description_ua,
      uaKeywords: findDbRes[0].keywords_ua,
      enKeywords: findDbRes[0].keywords_en,
      languages: findDbRes[0].languages,
      siteUrl: findDbRes[0].official_site_url,
      genreId: findDbRes[0].theme_id,
    },
    shouldUpdateMessage: null,
  };
};

export const extractAndUpdateData = async ({ title, a_pid, is_radio }) => {
  const messages = [];

  const { shouldUpdateData, shouldUpdateMessage } = await getShouldUpdateData(
    title,
    a_pid,
    is_radio
  );

  if (shouldUpdateMessage) messages.push(shouldUpdateMessage);

  const updateAllChanWithSameTitleRes = await updateGeneratedDataDB(
    shouldUpdateData,
    title
  );
  messages.push(
    updateAllChanWithSameTitleRes instanceof Error
      ? `ERROR: DB UPDATE data for channels with title "${title}". Error message: ${updateAllChanWithSameTitleRes.message}`
      : shouldUpdateData.genreId === 0
        ? `- Add EMPTY descriptions for ${updateAllChanWithSameTitleRes} channel(s) with name "${title}"`
        : `SUCCESS: Add ${updateAllChanWithSameTitleRes} channel descriptions for "${title}" channel(s)`
  );

  return { extractAndUpdateMessages: messages, shouldUpdateData };
};

export const addDescriptionForChannels = async (currentSatSlug) => {
  const messages = [];

  const dbChannelsRes = await getSatChannelsFromDB(currentSatSlug);
  if (typeof dbChannelsRes === 'string') return [dbChannelsRes];

  for (const channel of dbChannelsRes) {
    messages.push(`┌──────────────── "${channel.title}" ────────────────┐`);
    const { extractAndUpdateMessages } = await extractAndUpdateData({
      title: channel.title,
      a_pid: channel.a_pid,
      is_radio: channel.is_radio,
    });
    messages.push(...extractAndUpdateMessages);
    messages.push(`└─────────────────────────────────┘`);

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
//       WHERE title IN ('title1', 'title2', 'title3)
