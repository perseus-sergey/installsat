import { executePoolQuery } from './mysqldb.mjs';
import {
  EDBTableTitles,
  DB_ARRAY_SEPARATOR,
  getContentFromPuppeteerBrowser,
  killChromeProcesses,
} from './commons.mjs';
import { extractAndUpdateData } from './generateChanAboutForOneSat.controller.mjs';
import puppeteer from 'puppeteer';
import * as cheerio from 'cheerio';

// import { TDbBoolean } from '@/models/channel.model';

// interface IFlyChannel {
//   id?;
//   frequency: number;
//   polarization;
//   mode;
//   sr: number;
//   fec;
//   title;
//   is_radio: TDbBoolean;
//   compress;
//   sid: number | null;
//   v_pid: number | null;
//   a_pid;
//   encryption | null;
//   is_biss: TDbBoolean;
//   beam;
//   t2_stream | null;
// }

// const BASE_URL = process.env.BASE_URL;
export const PARSE_URL_BASE = 'https://www.flysat.com/en/satellite/';

const isProductionMode = process.env.PRODUCTION_MODE === 'true';

const IS_LOGGED = !isProductionMode;
const { FLY_CHANNELS, FLY_SATELLITES } = EDBTableTitles;
const dateNow = new Date().toLocaleDateString('en-CA');

const getSatChannelsFromDB = async (currentSatSlug, title = undefined) => {
  const where = title
    ? ` WHERE title = "${title}" AND is_removed = 1 LIMIT 1`
    : ` WHERE sat_slug = "${currentSatSlug}" AND is_removed != 1`;

  // must be with the same sequence as parsed Channels without id
  const sql = `
    SELECT 
      \`id\`,
      \`frequency\`,
      \`polarization\`,
      \`mode\`,
      \`beam\`,
      \`sr\`,
      \`fec\`,
      \`title\`,
      \`is_radio\`,
      \`compress\`,
      \`sid\`,
      \`v_pid\`,
      \`a_pid\`,
      \`t2_stream\`,
      \`is_biss\`,
      \`encryption\`
    FROM ${FLY_CHANNELS}
    ${where}
  `;
  // const res = await executePoolQuery<IFlyChannel[]>(sql);
  const res = await executePoolQuery(sql);
  if (res instanceof Error) {
    // console.log('ERROR during SELECT data:', res.message);
    throw res;
  }

  return res;
};

const updateTblChannels = async (currentSatSlug, shouldUpdChannels) => {
  const updateTblChannelsMessages = [];
  let updatedChannelsCount = 0;

  for (const channel of shouldUpdChannels) {
    if (!channel.id) {
      updateTblChannelsMessages.push(
        `ERROR: Cannot update channel ${channel.title}! channel.id = "${channel.id}"`
      );
      continue;
    }

    const res = await executePoolQuery(
      `
      UPDATE ${FLY_CHANNELS} 
      SET 
        \`sat_slug\` = ?,
        \`package_id\` = ?,
        \`is_removed\` = ?,
        \`frequency\` = ?,
        \`polarization\` = ?,
        \`mode\` = ?,
        \`beam\` = ?,
        \`sr\` = ?,
        \`fec\` = ?,
        \`title\` = ?,
        \`is_radio\` = ?,
        \`compress\` = ?,
        \`sid\` = ?,
        \`v_pid\` = ?,
        \`a_pid\` = ?,
        \`t2_stream\` = ?,
        \`is_biss\` = ?,
        \`biss\` = ?,
        \`date_updated\` = ?,
        \`encryption\` = ?
      WHERE id = ?
      LIMIT 1
      `,
      [
        currentSatSlug,
        2,
        0,
        channel.frequency,
        channel.polarization,
        channel.mode,
        channel.beam,
        channel.sr,
        channel.fec,
        channel.title,
        channel.is_radio,
        channel.compress,
        channel.sid || null,
        channel.v_pid || null,
        channel.a_pid,
        channel.t2_stream || null,
        channel.is_biss,
        null,
        dateNow,
        channel.encryption || null,
        channel.id,
      ]
    );
    if (res instanceof Error) {
      updateTblChannelsMessages.push(
        `ERROR: during UPDATE channel ${channel.title}! channel.id = "${channel.id}" for Sat_SLUG: "${currentSatSlug}". Error message: ${res.message}`
      );
    } else {
      updatedChannelsCount += 1;
    }
  }

  return { updatedChannelsCount, updateTblChannelsMessages };
};

const setDisableChannels = async (currentSatSlug, shouldDeleteChannels) => {
  let disabledChannelsCount = 0;
  const disableChannelsMessages = [];

  for (const channel of shouldDeleteChannels) {
    if (!channel.id) {
      disableChannelsMessages.push(
        `ERROR: Cannot DISABLE channel ${channel.title}! channel.id = "${channel.id}"`
      );
      continue;
    }

    const res = await executePoolQuery(
      `
      UPDATE ${FLY_CHANNELS} 
      SET \`is_removed\` = ?, \`date_updated\` = ?
      WHERE id = ?
      LIMIT 1
      `,
      [1, dateNow, channel.id]
    );
    if (res instanceof Error) {
      disableChannelsMessages.push(
        `ERROR: during "SET is_removed = 1" for channel "${channel.title} ${channel.frequency} ${channel.polarization}"! channel.id = "${channel.id}" for Sat_SLUG: "${currentSatSlug}". Error message: ${res.message}`
      );
    } else {
      disabledChannelsCount += 1;
    }
  }

  return { disabledChannelsCount, disableChannelsMessages };
};

const setFreeChannelCount = async (currentSatSlug) => {
  // const resCounts = await executePoolQuery<{ freeCount: number; allCount: number }[]>(
  const resCounts = await executePoolQuery(
    `
      SELECT 
        COUNT(CASE WHEN is_biss = 1 OR encryption IS NULL OR encryption = '' THEN 1 END) AS freeCount,
        COUNT(id) AS allCount
      FROM ${FLY_CHANNELS} 
      WHERE is_removed = 0
      AND sat_slug = ?
    `,
    [currentSatSlug]
  );

  if (resCounts instanceof Error)
    return `ERROR: during "SELECT COUNT(id)" for sat "${currentSatSlug}". Error message: ${resCounts.message}`;

  const resUpdate = await executePoolQuery(
    `
      UPDATE ${FLY_SATELLITES} 
      SET free_count = ?, all_count = ?
      WHERE slug = ?
      LIMIT 1
    `,
    [resCounts[0].freeCount, resCounts[0].allCount, currentSatSlug]
  );

  return resUpdate instanceof Error
    ? `ERROR: during "SET free_count & all_count" for sat "${currentSatSlug}". Error message: ${resUpdate.message}`
    : `SUCCESS: "SET free_count(${resCounts[0].freeCount}) & all_count(${resCounts[0].allCount})" for sat "${currentSatSlug}"`;
};

const insertTblChannels = async (currentSatSlug, parsedNewChannels) => {
  if (!parsedNewChannels.length) {
    return {
      insertCount: 0,
      insertTblChannelsMessages: [
        `DB INSERT: NO new channels to insert for sat_slug: ${currentSatSlug}`,
      ],
    };
  }

  const insertTblChannelsMessages = [];
  let insertCount = 0;
  const validValues = [];
  const placeholders = [];

  for (const channel of parsedNewChannels) {
    const { slug, message } = createSlug(channel.title);

    if (!slug) {
      return {
        insertCount: 0,
        insertTblChannelsMessages: [
          message || `Cannot create slug for channel: "${channel.title}"`,
        ],
      };
    }

    const { extractAndUpdateMessages, shouldUpdateData } =
      await extractAndUpdateData({
        title: channel.title,
        a_pid: channel.a_pid,
        is_radio: channel.is_radio,
      });
    insertTblChannelsMessages.push(...extractAndUpdateMessages);

    const values = [
      slug,
      currentSatSlug,
      channel.frequency,
      channel.polarization,
      channel.mode,
      channel.beam,
      channel.sr,
      channel.fec,
      channel.title,
      channel.is_radio,
      channel.compress,
      channel.sid || null,
      channel.v_pid || null,
      channel.a_pid,
      channel.t2_stream || null,
      channel.is_biss,
      channel.encryption || null,
      dateNow,
      2,
      0,
      shouldUpdateData.uaText,
      shouldUpdateData.enText,
      shouldUpdateData.enDescription,
      shouldUpdateData.uaDescription,
      shouldUpdateData.uaKeywords,
      shouldUpdateData.enKeywords,
      shouldUpdateData.languages,
      shouldUpdateData.siteUrl,
      shouldUpdateData.genreId,
    ];

    validValues.push(...values);
    placeholders.push(`(${new Array(values.length).fill('?').join(', ')})`);
  }

  if (!validValues.length) {
    return {
      insertCount: 0,
      insertTblChannelsMessages: [
        ...insertTblChannelsMessages,
        `DB INSERT: NO valid channels to insert for sat_slug: ${currentSatSlug}`,
      ],
    };
  }

  const sql = `
    INSERT INTO ${FLY_CHANNELS} 
    (
      \`slug\`,
      \`sat_slug\`,
      \`frequency\`,
      \`polarization\`,
      \`mode\`,
      \`beam\`,
      \`sr\`,
      \`fec\`,
      \`title\`,
      \`is_radio\`,
      \`compress\`,
      \`sid\`,
      \`v_pid\`,
      \`a_pid\`,
      \`t2_stream\`,
      \`is_biss\`,
      \`encryption\`,
      \`date_updated\`,
      \`package_id\`,
      \`is_removed\`,
      \`text_ua\`,
      \`text_en\`,
      \`description_en\`,
      \`description_ua\`,
      \`keywords_ua\`,
      \`keywords_en\`,
      \`languages\`,
      \`official_site_url\`,
      \`theme_id\`
    )
    VALUES ${placeholders.join(', ')};
  `;
  const res = await executePoolQuery(sql, validValues);

  res instanceof Error
    ? insertTblChannelsMessages.push(
        `ERROR: DB INSERT channels failed for Sat_SLUG: "${currentSatSlug}". Error message: ${res.message}`
      )
    : insertTblChannelsMessages.push(
        `--== SUCCESS: DB INSERT ${res.affectedRows} channels for Sat_SLUG: "${currentSatSlug}" ==--`
      );

  insertCount = res instanceof Error ? 0 : res.affectedRows;

  return { insertCount, insertTblChannelsMessages };
};

const createSlug = (title) => {
  if (!title) {
    return {
      slug: null,
      message: 'ERROR: Cannot create SLUG. No title provided.',
    };
  }
  const handledTitle = title
    .toLowerCase()
    .trim()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

  if (!title) {
    return {
      slug: null,
      message: `ERROR: Cannot create SLUG from title: "${title}"`,
    };
  }

  const randomString = Math.random().toString(36).slice(2, 6);

  return {
    slug: `${randomString}-${handledTitle}`,
    message: null,
  };
};

// interface TitleResult {
//   is_radio: TDbBoolean;
//   title;
// }

const extractTextFromElement = (element, $) => {
  const texts = [];
  element.contents().each((_i, el) => {
    if (el.type === 'text') {
      const text = $(el).text().trim();
      if (text) {
        texts.push(text);
      }
    }
  });

  return texts;
};

const titleHandler = (titleCell) => {
  if (titleCell.attr('align') === 'center') return null;

  const title = titleCell.text().trim();
  if (!title) return null;

  const is_radio = title.startsWith('-R-') ? 1 : 0;
  const cleanTitle = is_radio ? title.slice(3).trim() : title.trim();

  const isFeed = /^data$/i.test(cleanTitle) || /^feed$/i.test(cleanTitle);
  if (isFeed) return null;

  return { is_radio, title: cleanTitle };
};

const aPidHandler = (aPidCell, $) =>
  extractTextFromElement(aPidCell.find('font'), $).join(DB_ARRAY_SEPARATOR);

const encryptionHandler = (encryptionCell, $) => {
  const encryptions = extractTextFromElement(
    encryptionCell.find('font'),
    $
  ).map((text) => text.toLowerCase());

  const encryption =
    encryptions.length > 1
      ? encryptions.join(DB_ARRAY_SEPARATOR)
      : encryptions[0] || null;

  const isBiss = encryptions.includes('biss');

  return { encryption, isBiss };
};

const extractParsedData = ($) => {
  let currentFreq = 0;
  let currentPolar = '';
  let currentMode = '';
  let currentSr = 0;
  let currentFec = '';
  let currentBeam = '';
  let t2_stream = null;

  const channels = [];
  let capture = false;

  $('table[bordercolor="#3366cc"] > tbody > tr').each((_, element) => {
    const $element = $(element);

    // Start row
    if ($element.attr('bgcolor') === '#cee7ff') {
      capture = true;

      return;
    }

    if (capture && $element.find('table').length === 0) {
      const tds = $element.find('td');

      if (tds.length === 12) {
        t2_stream = null;

        const freqPolar = tds.eq(2).find('b').text().trim();
        const [freq, polar] = freqPolar.split(' ');
        if (!freq || !polar) return;
        currentFreq = Number(freq.trim());
        currentPolar = polar.trim().toUpperCase();
        if (!currentFreq || !currentPolar || currentPolar.length > 1) return;

        currentMode = extractTextFromElement(tds.eq(2).find('font'), $).join(
          DB_ARRAY_SEPARATOR
        );
        currentBeam = tds.eq(11).text().trim();
        if (!currentBeam) return;

        const srFec = tds.eq(3).text().trim();
        const [sr, fec] = srFec.split(' ');
        if (!sr || !fec) return;
        currentSr = Number(sr.trim());
        currentFec = fec.trim();
        if (!currentSr || !currentFec) return;

        const titleData = titleHandler(tds.eq(4));
        if (!titleData) return;
        const { title, is_radio } = titleData;

        const compress = tds.eq(5).text().trim();
        if (!compress && !is_radio) return;

        const sid = Number(tds.eq(6).text().trim()) || null;
        const v_pid = Number(tds.eq(7).text().trim()) || null;
        const a_pid = aPidHandler(tds.eq(8), $);
        const { encryption, isBiss } = encryptionHandler(tds.eq(9), $);

        // must be with the same sequence as db SELECT without id
        channels.push({
          frequency: currentFreq,
          polarization: currentPolar,
          mode: currentMode,
          beam: currentBeam,
          sr: currentSr,
          fec: currentFec,
          title,
          is_radio,
          compress,
          sid,
          v_pid,
          a_pid,
          t2_stream,
          is_biss: isBiss ? 1 : 0,
          encryption,
        });
      } else if (tds.length === 7) {
        const titleData = titleHandler(tds.eq(0));
        if (!titleData) return;
        const { title, is_radio } = titleData;

        const compress = tds.eq(1).text().trim();
        if (!compress && !is_radio) return;

        const sid = Number(tds.eq(2).text().trim()) || null;
        const v_pid = Number(tds.eq(3).text().trim()) || null;
        const a_pid = aPidHandler(tds.eq(4), $);
        const { encryption, isBiss } = encryptionHandler(tds.eq(5), $);

        // must be with the same sequence as db SELECT without id
        channels.push({
          frequency: currentFreq,
          polarization: currentPolar,
          mode: currentMode,
          beam: currentBeam,
          sr: currentSr,
          fec: currentFec,
          title,
          is_radio,
          compress,
          sid,
          v_pid,
          a_pid,
          t2_stream,
          is_biss: isBiss ? 1 : 0,
          encryption,
        });
      } else if (tds.length === 1) {
        const t2Stream = tds.find('b').text().trim();
        if (!t2Stream.startsWith('Stream')) return;

        t2_stream = t2Stream;
      }
    }
  });

  return channels;
};

const serializeChannelWithoutId = (channel) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id, ...rest } = channel;

  return JSON.stringify(rest);
};

const getFilteredChannelArrays = (parsedChannels, dbChannels) => {
  const serializedParsedChannels = new Set(
    parsedChannels.map(serializeChannelWithoutId)
  );

  const filteredDbChannels = dbChannels.filter(
    (dbChannel) =>
      !serializedParsedChannels.has(serializeChannelWithoutId(dbChannel))
  );

  const serializedDbChannels = new Set(
    dbChannels.map(serializeChannelWithoutId)
  );

  const filteredParsedChannels = parsedChannels.filter(
    (parsedChannel) =>
      !serializedDbChannels.has(serializeChannelWithoutId(parsedChannel))
  );

  return { filteredDbChannels, filteredParsedChannels };
};

const makeShouldUpdateFromCurrentTbl = (dbChannels, parsedChannels) => {
  let parsedNewChannels = parsedChannels.slice();
  let shouldDeleteChannels = dbChannels.slice();

  const currTblShouldUpdChannels = shouldDeleteChannels.reduce(
    (acc, dbChannel) => {
      const matchIndex = parsedNewChannels.findIndex(
        (parsedChannel) => parsedChannel.title === dbChannel.title
      );

      if (matchIndex !== -1) {
        const matchedParsedChannel = {
          ...parsedNewChannels[matchIndex],
          id: dbChannel.id,
        };

        acc.push(matchedParsedChannel);

        parsedNewChannels = parsedNewChannels.filter(
          (_, idx) => idx !== matchIndex
        );

        shouldDeleteChannels = shouldDeleteChannels.filter(
          (channel) => channel !== dbChannel
        );
      }

      return acc;
    },
    []
  );

  return { currTblShouldUpdChannels, parsedNewChannels, shouldDeleteChannels };
};

const findSimilarChannelFromAllSats = async (
  parsedNewChannels,
  currTblShouldUpdChannels,
  currentSatSlug
) => {
  const similarChannelMessages = [];
  const shouldUpdChannels = currTblShouldUpdChannels.slice();
  let parsedNewChannelsFiltered = parsedNewChannels.slice();

  for (const parsedNewChannel of parsedNewChannelsFiltered) {
    try {
      const dbRes = await getSatChannelsFromDB(
        currentSatSlug,
        parsedNewChannel.title
      );

      if (dbRes.length) {
        shouldUpdChannels.push({
          ...parsedNewChannel,
          id: dbRes[0].id,
        });

        parsedNewChannelsFiltered = parsedNewChannelsFiltered.filter(
          (channel) => channel !== parsedNewChannel
        );
      }
    } catch (error) {
      similarChannelMessages.push(
        `ERROR: Could not get channel by title: "${parsedNewChannel.title}" from table: "${FLY_CHANNELS}". Error message: ${error instanceof Error ? error.message : 'Unknown error!'}`
      );
    }
  }

  return {
    shouldUpdChannels,
    parsedNewChannelsFiltered,
    similarChannelMessages,
  };
};

export const parseFlyChannels = async ({
  currentSatSlug,
  incomingBrowser = undefined,
}) => {
  const sourceUrl = `${PARSE_URL_BASE}${currentSatSlug}`;

  let browser = incomingBrowser;
  let parsedChannels = [];
  let filteredDbChannels = [];
  let filteredParsedChannels = [];
  let currTblShouldUpdChannels = [];
  let parsedNewChannels = [];
  let shouldDeleteChannels = [];
  let shouldUpdChannels = [];
  let parsedNewChannelsFiltered = [];
  let updateResCount = 0;
  let insertCount = 0;
  let removeResCount = 0;
  let parseChannelMessages = [];
  let similarChannelMessages = [];

  const addParseChannelMessage = (message, error = undefined) => {
    parseChannelMessages.push(`${message}${error ? `: ${error.message}` : ''}`);
    if (IS_LOGGED)
      console.log(`🚀 ~ ${message}${error ? ` ERROR: ${error}` : ''}`);
  };

  try {
    const dbChannels = await getSatChannelsFromDB(currentSatSlug);

    if (!browser) {
      browser = await puppeteer.launch({
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-gpu',
          // '--single-process', // Optional: uncomment for single-process mode if necessary
        ],
        headless: true, // Run in headless mode (no UI)
      });
    }

    const html = await getContentFromPuppeteerBrowser(browser, sourceUrl);
    const $ = cheerio.load(html);

    parsedChannels = extractParsedData($);

    ({ filteredDbChannels, filteredParsedChannels } = getFilteredChannelArrays(
      parsedChannels,
      dbChannels
    ));

    ({ currTblShouldUpdChannels, parsedNewChannels, shouldDeleteChannels } =
      makeShouldUpdateFromCurrentTbl(
        filteredDbChannels,
        filteredParsedChannels
      ));

    ({ shouldUpdChannels, parsedNewChannelsFiltered, similarChannelMessages } =
      await findSimilarChannelFromAllSats(
        parsedNewChannels,
        currTblShouldUpdChannels,
        currentSatSlug
      ));

    parseChannelMessages.push(...similarChannelMessages);

    const updateRes = await updateTblChannels(
      currentSatSlug,
      shouldUpdChannels
    );
    updateResCount = updateRes.updatedChannelsCount;
    parseChannelMessages.push(...updateRes.updateTblChannelsMessages);
    if (updateResCount > 0)
      parseChannelMessages.push(
        `--== Updated ${updateResCount} channels for satellite "${currentSatSlug}" ==--`
      );

    const insertRes = await insertTblChannels(
      currentSatSlug,
      parsedNewChannelsFiltered
    );
    ({ insertCount } = insertRes);
    parseChannelMessages.push(...insertRes.insertTblChannelsMessages);

    const removeRes = await setDisableChannels(
      currentSatSlug,
      shouldDeleteChannels
    );
    removeResCount = removeRes.disabledChannelsCount;
    parseChannelMessages.push(...removeRes.disableChannelsMessages);
    if (removeResCount > 0)
      parseChannelMessages.push(
        `--== Disabled ${removeResCount} channels for satellite "${currentSatSlug}" ==--`
      );

    const setFreeChannelCountMessages =
      await setFreeChannelCount(currentSatSlug);
    parseChannelMessages.push(setFreeChannelCountMessages);
  } catch (error) {
    addParseChannelMessage(
      `ERROR: failed during channels parsing for satellite "${currentSatSlug}"`,
      error instanceof Error ? error : new Error(`Unknown error!`)
    );
  } finally {
    if (browser && !incomingBrowser) {
      try {
        await browser.close();
      } catch (closeError) {
        addParseChannelMessage(
          'ERROR: closing browser',
          closeError instanceof Error ? closeError : new Error('Unknown error!')
        );
      }
    }
    if (isProductionMode) {
      killChromeProcesses();
      // messages = [...messages, ...killRes];
    }
  }

  return {
    parseChannelMessages,
    updateResCount,
    currTblShouldUpdChannels,
    shouldUpdChannels,
    removeResCount,
    shouldDeleteChannels,
    parsedNewChannels,
    insertCount,
  };
};
