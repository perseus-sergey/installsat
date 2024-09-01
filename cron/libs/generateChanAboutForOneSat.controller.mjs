import { executePoolQuery } from './mysqldb.mjs';
import { EDBTableTitles } from './commons.mjs';
import { generateChannelAbout } from './flyChannelAbout.controller.mjs';

const { FLY_CHANNELS } = EDBTableTitles;

const getSatChannelsFromDB = async (currentSatSlug) => {
  const sql = `
    SELECT title FROM ${FLY_CHANNELS} WHERE sat_slug = ? AND (description_en IS NULL OR description_en = '') GROUP BY title
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
    WHERE title = ? AND description_en IS NOT NULL AND description_en != ''
    LIMIT 1
  `;
  const res = await executePoolQuery(sql, [title]);

  return res instanceof Error
    ? `ERROR: SELECT data when searching channel About for channel "${title}". Message: ${res.message}`
    : res;
};

export const addDescriptionForChannels = async (currentSatSlug) => {
  const messages = [];

  const chanTitlesRes = await getSatChannelsFromDB(currentSatSlug);
  if (typeof chanTitlesRes === 'string') return [chanTitlesRes];

  for (const chanTitle of chanTitlesRes) {
    let shouldUpdateData;

    const findDbRes = await findChannelAbout(chanTitle.title);
    if (typeof findDbRes === 'string') {
      messages.push(findDbRes);
      continue;
    }

    if (findDbRes.length === 0) {
      const generatedDataRes = await generateChannelAbout(chanTitle.title);
      if (typeof generatedDataRes === 'string') {
        messages.push(generatedDataRes);
        continue;
      }

      messages.push(
        `SUCCESS: Generated channel descriptions for "${chanTitle.title}" channel`
      );

      shouldUpdateData = generatedDataRes;
    } else {
      shouldUpdateData = findDbRes[0];
    }

    const updateAllChanWithSameTitleRes = await updateChannelsWithGeneratedData(
      shouldUpdateData,
      chanTitle.title
    );
    messages.push(
      typeof updateAllChanWithSameTitleRes === 'string'
        ? updateAllChanWithSameTitleRes
        : `SUCCESS: Add ${updateAllChanWithSameTitleRes} channel descriptions for "${chanTitle.title}" channel(s)`
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
