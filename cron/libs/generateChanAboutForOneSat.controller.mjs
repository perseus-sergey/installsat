import { executePoolQuery } from './mysqldb.mjs';
import { EDBTableTitles, DB_ARRAY_SEPARATOR } from './commons.mjs';
import { generateChannelAbout } from './flyChannelAbout.controller.mjs';
import { audioLanguages, wrongAudio } from './languages.mjs';

const { FLY_CHANNELS } = EDBTableTitles;

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
    SELECT title, MAX(a_pid)
    FROM ${FLY_CHANNELS} 
    WHERE sat_slug = ? 
    AND (theme_id != 0 OR theme_id IS NULL)
    AND (description_en IS NULL OR description_en = '') 
    GROUP BY title
    LIMIT 30
  `;
  const res = await executePoolQuery(sql, [currentSatSlug]);

  return res instanceof Error
    ? `ERROR: SELECT channel titles from satellite: "${currentSatSlug}"`
    : res;
};

const updateChannelsWithGeneratedData = async (
  {
    uaText,
    enText,
    enDescription,
    uaDescription,
    uaKeywords,
    enKeywords,
    languages,
    siteUrl,
    genreId,
  },
  channelName
) => {
  const sql = `
      UPDATE ${FLY_CHANNELS}
      SET 
        text_ua = ?, 
        text_en = ?, 
        description_en = ?, 
        description_ua = ?, 
        keywords_ua = ?, 
        keywords_en = ?, 
        languages = ?, 
        official_site_url = ?, 
        theme_id = ?
      WHERE title = ? AND (description_en IS NULL OR description_en = '')
    `;
  const res = await executePoolQuery(sql, [
    uaText,
    enText,
    enDescription,
    uaDescription,
    uaKeywords,
    enKeywords,
    languages,
    siteUrl,
    genreId,
    channelName,
  ]);

  return res instanceof Error
    ? `ERROR: DB UPDATE data for channels with title "${channelName}". Error message: ${res.message}`
    : res.affectedRows;
};

const findChannelAbout = async (title) => {
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

  return res instanceof Error
    ? `ERROR: SELECT data when searching channel About for channel "${title}". Message: ${res.message}`
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

export const addDescriptionForChannels = async (currentSatSlug) => {
  const messages = [];

  const dbChannelsRes = await getSatChannelsFromDB(currentSatSlug);
  if (typeof dbChannelsRes === 'string') return [dbChannelsRes];

  for (const channel of dbChannelsRes) {
    let shouldUpdateData;

    const findDbRes = await findChannelAbout(channel.title);
    if (typeof findDbRes === 'string') {
      messages.push(findDbRes);
      continue;
    }

    if (findDbRes.length === 0) {
      const langString = getLanguageString(channel.a_pid);

      const generatedDataRes = await generateChannelAbout(
        channel.title,
        langString
      );

      if (typeof generatedDataRes === 'string') {
        messages.push(generatedDataRes);
        shouldUpdateData = emptyChannelDescription;
      } else {
        messages.push(
          `SUCCESS: Generated channel descriptions for "${channel.title}" channel`
        );
        shouldUpdateData = generatedDataRes;
      }
    } else {
      shouldUpdateData = findDbRes[0];
    }

    const updateAllChanWithSameTitleRes = await updateChannelsWithGeneratedData(
      shouldUpdateData,
      channel.title
    );
    messages.push(
      typeof updateAllChanWithSameTitleRes === 'string'
        ? updateAllChanWithSameTitleRes
        : `SUCCESS: Add ${updateAllChanWithSameTitleRes} channel descriptions for "${channel.title}" channel(s)`
    );
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
