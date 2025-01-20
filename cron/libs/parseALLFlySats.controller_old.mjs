import { executePoolQuery } from './mysqldb.mjs';
import {
  EDBTableTitles,
  getContentFromPuppeteerBrowser,
  killChromeProcesses,
  sleep,
  takeScreenshot,
} from './commons.mjs';
import { parseFlyChannels } from './parseFlySat.controller.mjs';
import { DateTime } from 'luxon';
// import puppeteer from 'puppeteer';
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

import * as cheerio from 'cheerio';
import { translateChannels } from './channelTranslate.controller.mjs';
import axios from 'axios';

const isProductionMode = process.env.NODE_ENV === 'production';
const clientKey = process.env.CAPSOLVER === 'production';

const IS_LOGGED = !isProductionMode;
const PARSE_LIST_OF_SATELLITES_URL = 'https://flysat.com/en/satellitelist';
const { FLY_SATELLITES } = EDBTableTitles;

let messages = [];

const addMessage = (message, error = undefined) => {
  messages.push(`${message}${error ? `: ${error.message}` : ''}`);
  if (IS_LOGGED)
    console.log(`🚀 ~ ${message}${error ? ` ERROR: ${error}` : ''}`);
};

const getDataFromDB = async () => {
  const sql = `
    SELECT cluster, title, url_link, slug, position, grade, date_upd FROM ${FLY_SATELLITES}
  `;
  const res = await executePoolQuery(sql);
  if (res instanceof Error) {
    addMessage('ERROR during SELECT data:', res);
    throw res;
  }

  return res;
};

const setSatDateUpd = async (currentSatSlug, dateUpd) => {
  const dateUpdStr = dateUpd.toISOString().split('T')[0];
  const res = await executePoolQuery(
    `
      UPDATE ${FLY_SATELLITES} 
      SET date_upd = ?
      WHERE slug = ?
      LIMIT 1
    `,
    [dateUpdStr, currentSatSlug]
  );

  if (res instanceof Error) {
    addMessage(`ERROR: during "SET date_upd" for sat "${currentSatSlug}"`, res);
  } else {
    addMessage(
      `SUCCESS: "SET ${res.affectedRows} date_upd(${dateUpdStr})" for sat "${currentSatSlug}"`
    );
  }
};

const insertNewSatsToDB = async (newSatellites) => {
  const dataLength = newSatellites.length;
  if (dataLength === 0)
    throw new Error(`ERROR: DB insert empty NEW SATELLITE LIST`);

  const placeholders = newSatellites
    .map(() => '(?, ?, ?, ?, ?, ?, ?)')
    .join(', ');

  const sql = `
    INSERT INTO ${FLY_SATELLITES} (cluster, title, url_link, slug, position, grade, date_upd)
    VALUES ${placeholders}
  `;

  // Flatten the array of values
  const values = newSatellites.flatMap((item) => [
    item.cluster,
    item.title,
    item.url_link,
    item.slug,
    item.position,
    item.grade,
    item.date_upd.toISOString().split('T')[0],
  ]);

  const res = await executePoolQuery(sql, values);

  if (res instanceof Error) {
    addMessage(
      `ERROR: during INSERT ${newSatellites.length} new satellites to DB`,
      res
    );
  } else {
    addMessage(`SUCCESS: "SET INSERT ${res.affectedRows} new satellites to DB`);
  }
};

const getPathToSat = (url) => url.split('/').slice(-3).join('/');

const isEqualSatParams = (dbSat, parsedSat) =>
  parsedSat.title === dbSat.title &&
  getPathToSat(parsedSat.url_link) === getPathToSat(dbSat.url_link) &&
  parsedSat.slug === dbSat.slug &&
  parsedSat.position === dbSat.position;

const findDbOverSats = (dbSats, parsedSats) =>
  dbSats.filter(
    (dbSat) =>
      !parsedSats.some((parsedSat) => isEqualSatParams(dbSat, parsedSat))
  );

const getDayDifference = (startDate) => {
  const currentDate = DateTime.now().startOf('day');
  const targetDate = DateTime.fromJSDate(startDate).startOf('day');

  return currentDate.diff(targetDate, 'days').days;
};

const isSameDate = (parseDate, dbDate) =>
  parseDate.startOf('day').toISODate() === dbDate.startOf('day').toISODate();

const parseSatellitesChannels = async (allParsedSats) => {
  for (const sat of allParsedSats) {
    addMessage(`┌──────────────── "${sat.slug}" ────────────────┐`);

    const { parseChannelMessages } = await parseFlyChannels({
      currentSatSlug: sat.slug,
    });
    messages.push(...parseChannelMessages);

    await setSatDateUpd(sat.slug, sat.date_upd);
    addMessage(`└───────────────────────────────────────┘`);
  }
};
// ----------------------------------------------------------------

const extractParsedData = ($, dbSatellites, intervalFromLastUpd) => {
  const allParsedSats = [];
  const updatedSats = [];
  const newSats = [];
  const errors = [];
  let currentCluster = '';

  const satRows = $('tr[bgcolor="#b9dcff"]');

  satRows.each((_, element) => {
    const $element = $(element);
    const tds = $element.find('td');

    let title = '';
    let position = '';
    let band = '';
    let parsedDate = '';

    if (tds.length === 6) {
      currentCluster = tds.eq(0).find('a').text().trim();
      title = tds.eq(1).text().trim();
      position = tds.eq(2).text().trim();
      band = tds.eq(4).text().trim().toLowerCase();
      parsedDate = tds.eq(5).text().trim();
    } else if (tds.length === 5) {
      title = tds.eq(0).text().trim();
      position = tds.eq(1).text().trim();
      band = tds.eq(3).text().trim().toLowerCase();
      parsedDate = tds.eq(4).text().trim();
    } else {
      errors.push(`ERROR: unexpected row count: «${$element.html()}»`);

      return;
    }

    if (!band || band === 'ka') return;

    if (!title) {
      errors.push(`ERROR: extracting SAT NAME from: «${$element.html()}»`);

      return;
    }

    if (!position) {
      errors.push(`ERROR: extracting POSITION from: «${$element.html()}»`);

      return;
    }

    if (!parsedDate) {
      errors.push(`ERROR: extracting DATE from: «${$element.html()}»`);

      return;
    }

    const [grade, ew] = position.split('° ');
    if (!grade || !ew) {
      errors.push(`ERROR: extracting GRADE from: «${$element.html()}»`);

      return;
    }

    const url_link = tds.eq(1).find('a').attr('href');
    if (!url_link) {
      errors.push(`ERROR: extracting URL_LINK from: «${$element.html()}»`);

      return;
    }

    const slug = url_link.split('/').pop();
    if (!slug) {
      errors.push(`ERROR: extracting SLUG from: «${url_link}»`);

      return;
    }

    const [day, month, year] = parsedDate.split('.');
    const date_upd = new Date(`${year}-${month}-${day}`);

    const parsedSat = {
      cluster: currentCluster,
      title,
      url_link,
      slug,
      position,
      grade: ew === 'E' ? grade : `-${grade}`,
      date_upd,
    };

    const satInDb = dbSatellites.find((dbSat) =>
      isEqualSatParams(dbSat, parsedSat)
    );

    if (!satInDb) {
      newSats.push(parsedSat);
    } else if (
      !isSameDate(
        DateTime.fromJSDate(date_upd),
        DateTime.fromJSDate(satInDb.date_upd)
      ) ||
      getDayDifference(date_upd) < intervalFromLastUpd
    ) {
      updatedSats.push(parsedSat);
    }

    allParsedSats.push(parsedSat);
  });

  return { allParsedSats, newSats, updatedSats, extractErrors: errors };
};

// =========================================================================
// ============================   EXPORT   =================================
// =========================================================================

export const parseProcess = async (intervalFromLastUpd) => {
  let browser;
  // let finalData = [];
  let overSats = [];
  let dbSatList = [];
  let newSatList = [];
  let updatedSatList = [];

  try {
    dbSatList = await getDataFromDB();

    // browser = await puppeteer.use(StealthPlugin()).launch({
    //   args: [
    //     '--no-sandbox',
    //     '--disable-setuid-sandbox',
    //     '--disable-dev-shm-usage',
    //     '--disable-gpu',
    //   ],
    //   headless: true, // Запуск без графічного інтерфейсу
    // });

    // const page = await browser.newPage();
    // await page.goto(PARSE_LIST_OF_SATELLITES_URL, {
    //   waitUntil: 'domcontentloaded',
    // });

    // await sleep(15000);

    // await takeScreenshot('fly-main', page);

    // const html = await page.content();
    const html = await getPageContent();

    // await page.waitForSelector(
    //   'img[src="https://flysat.com/images/flysat.gif"]'
    // );

    // const html = await getContentFromPuppeteerBrowser(
    //   browser,
    //   PARSE_LIST_OF_SATELLITES_URL
    // );
    const $ = cheerio.load(html);

    const { allParsedSats, newSats, updatedSats, extractErrors } =
      extractParsedData($, dbSatList, intervalFromLastUpd);
    extractErrors.forEach((er) => addMessage(er));

    updatedSatList = updatedSats;
    newSatList = newSats;
    overSats = findDbOverSats(dbSatList, allParsedSats);

    if (newSats.length) await insertNewSatsToDB(newSats);

    await parseSatellitesChannels(updatedSats);
    // await parseSatellitesChannels(newSats);

    // =================================================================
    // For All Satellites
    // =================================================================
    // await parseSatellitesChannels(allParsedSats);

    // finalData = allParsedSats;
  } catch (error) {
    addMessage(
      'ERROR: failed during satellites page parsing',
      error instanceof Error
        ? error
        : new Error('Unknown error occurred during satellites page parsing')
    );
  } finally {
    if (browser) {
      try {
        const pages = await browser.pages();
        await Promise.all(pages.map((page) => page.close())); // Закрити всі відкриті сторінки
        await browser.close();
      } catch (closeError) {
        addMessage(
          'ERROR: closing browser',
          closeError instanceof Error
            ? closeError
            : new Error('Error closing browser')
        );
      } finally {
        if (isProductionMode) {
          const killRes = killChromeProcesses(isProductionMode);
          messages.push(...killRes);
        }
      }
    }
  }

  // const translateMessages = await translateChannels(20);

  return {
    dbSatList,
    newSatList,
    overSats,
    updatedSatList,
    messages,
    // messages: [...messages, ...translateMessages],
  };
};

// interface IParsedSat {
//   cluster: string,
//   title: string,
//   url_link: string,
//   slug: string,
//   position: string,
//   grade: string,
//   date_upd: string,
// }

const websiteKey = 'your-website-key-here'; // Replace with the website key provided by CapSolver

async function createTask() {
  console.log('🚀 ~ createTask ~ createTask');
  const response = await axios.post(
    // 'https://api.capsolver.com/createTask',
    'https://api-stable.capsolver.com/createTask',
    {
      clientKey,
      task: {
        type: 'AntiTurnstileTaskProxyLess',
        websiteURL: PARSE_LIST_OF_SATELLITES_URL,
        // websiteKey: websiteKey,
      },
    },
    {
      headers: {
        'Content-Type': 'application/json',
        Pragma: 'no-cache',
      },
    }
  );

  return response.data.taskId;
}

async function getTaskResult(taskId) {
  console.log('🚀 ~ getTaskResult ~ taskId:', taskId);
  let response;

  while (true) {
    console.log('🚀 ~ getTaskResult ~ while');
    response = await axios.post(
      'https://api.capsolver.com/getTaskResult',
      // 'https://api-stable.capsolver.com/getTaskResult',
      {
        clientKey: clientKey,
        taskId: taskId,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.data.status === 'ready') {
      return response.data.solution;
    }

    console.log('Status not ready, checking again in 5 seconds...');
    await new Promise((resolve) => setTimeout(resolve, 5000));
  }
}

async function getPageContent() {
  const taskId = await createTask();
  const result = await getTaskResult(taskId);
  console.log('🚀 ~ getPageContent ~ result:', result);
  let solution = result.token;

  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto(PARSE_LIST_OF_SATELLITES_URL);
  await page.waitForSelector('input[name="cf-turnstile-response"]');
  await page.evaluate((solution) => {
    document.querySelector('input[name="cf-turnstile-response"]').value =
      solution;
  }, solution);
  await takeScreenshot('fly-main', page);
  const content = await page.content();

  return content;
}

// Hello! I am trying to get the page content using the method provided in your article https://www.capsolver.com/blog/Cloudflare/solve-cloudflare-with-puppeteer. But when I run the createTask function, I get an error: xiosError: Request failed with status code 400.
// In addition, I can't find the site-key on the target site-key.
