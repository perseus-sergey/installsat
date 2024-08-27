import puppeteer from 'puppeteer';
import * as cheerio from 'cheerio';
import { DateTime } from 'luxon';
import { sendMail } from './libs/sendMail.mjs';
import {
  EDBTableTitles,
  getDbTableLink,
  EUrlAdminParam,
  killChromeProcesses,
} from './libs/commons.mjs';
import {
  deleteDBOldTransNews,
  getDBSatID,
  insertDBTransNews,
  getDbIdAmount,
  actionTextHandler,
} from './libs/parseTransNews.controller.mjs';

const BASE_URL = process.env.BASE_URL;
const BASE_GURU_PATH = `${BASE_URL}/en/${EUrlAdminParam.BASE_PATH}`;
const isProductionMode = process.env.PRODUCTION_MODE === 'true';
const { TRANS_NEWS } = EDBTableTitles;

const PARSE_URL = 'https://www.flysat.com/en/news';
const PARSED_UPDATES = 4;

const parseChannelPage = async (browser, url) => {
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'domcontentloaded' });

  const content = await page.content();
  await page.close();

  return content;
};

const extractParsedData = ($, updateAmount) => {
  const parsedData = [];
  const extractErrors = [];

  const addMessage = (itemTitle, from, type) =>
    extractErrors.push(
      `${type}: Cannot extract ${itemTitle} from: «${from || 'CHEERIO HTML'}»`
    );

  const baslikElements = $('p.baslik');
  const firstThreeBaslikElements = baslikElements.slice(0, updateAmount);

  firstThreeBaslikElements.each((_i, el) => {
    const dateText = $(el).text(); // Отримуємо текст з елемента <p class="baslik">>
    const [date, updateText] = dateText.split('/'); // Розділяємо текст на дату і номер оновлення
    const dt = DateTime.fromFormat(date, 'dd.MM.yyyy', { zone: 'utc' });
    if (!dt.isValid) {
      extractErrors.push(`Error extracting DATE from: «${dateText}»`);

      return;
    }

    const update = parseInt(updateText, 10) || null; // Конвертуємо номер оновлення в число

    // Збираємо всі наступні елементи <p> до наступного <p class="baslik">

    $(el)
      .nextUntil('p.baslik')
      .each((_j, updateEl) => {
        if ($(updateEl).hasClass('guncellemenormal')) {
          const channel_title = $(updateEl).find('b').eq(1).text().trim(); // Назва каналу
          if (!channel_title) {
            addMessage('CHANNEL NAME', $(updateEl).html(), 'ERROR');

            return;
          }

          // Збираємо частоту між дужками, або використовуємо текст після назви каналу
          let frequency_text = '';
          const textAfterChanTitle = $(updateEl).text().split(channel_title)[1];
          const frequencyMatch = textAfterChanTitle.match(/\(([^)]+)\)/);
          if (frequencyMatch) {
            frequency_text = `(${frequencyMatch[1].trim()})`;
          } else {
            const fallbackMatch = textAfterChanTitle.match(/\(.*\)/);
            if (fallbackMatch) {
              frequency_text = fallbackMatch[0];
            }
          }
          if (!frequency_text)
            addMessage('FREQUENCY TEXT', $(updateEl).html(), 'WARNING');

          const action = $(updateEl).find('font[color]').last().text().trim(); // Дія (left/on), другий <font>
          if (!action) {
            addMessage('ACTION', $(updateEl).html(), 'ERROR');

            return;
          }

          const satNameLink = $(updateEl).find('a');
          const satHref = satNameLink.attr('href');
          if (!satHref) addMessage('URL_LINK', $(updateEl).html(), 'WARNING');

          const slug = satHref ? satHref.split('/').pop() : '';
          if (!slug) addMessage('SLUG', satHref || '', 'WARNING');

          const fullSatName = satNameLink.text().trim().split('@'); // Назва супутника
          const satName = fullSatName[0].trim();
          if (!satName) {
            addMessage('SATELLITE NAME', $(updateEl).html(), 'ERROR');

            return;
          }
          const satPosition = fullSatName[1].trim();
          if (!satPosition)
            addMessage('SATELLITE POSITION', $(updateEl).html(), 'WARNING');

          const [grade, ew] = satPosition.split('° ');
          if (!grade || !ew) addMessage('GRADE', $(updateEl).html(), 'WARNING');

          const { ua, en } = actionTextHandler(
            action,
            channel_title,
            frequency_text
          );

          // Encode the replaced text to handle HTML entities
          parsedData.push({
            date: dt.toISODate(),
            update,
            channel_title: channel_title,
            action: action,
            text: ua,
            text_en: en,
            frequency_text: frequency_text,
            sat_name: satName,
            sat_slug: slug || null,
            sat_grade: ew === 'E' ? grade : `-${grade}`,
            sat_position: satPosition,
            sat: '',
            country: '',
          });
        }
      });
  });

  return { parsedData, extractErrors };
};

const addSatId = async (parsedData) => {
  const addSatIdErrors = [];
  const dataWithSatId = [];

  for (const item of parsedData) {
    const satResult = await getDBSatID(item.sat_slug, item.sat_name);
    if (typeof satResult === 'string') {
      addSatIdErrors.push(satResult);
      dataWithSatId.push({
        ...item,
        sat: '0',
      });
    } else {
      if (parseFloat(satResult.grade) !== parseFloat(item.sat_grade || '')) {
        addSatIdErrors.push(
          `WARNING: SATELLITE GRADE from DB: «${satResult.grade}» is DIFFERENT from parsed GRADE: «${item.sat_grade}» for satellite slug «${item.sat_slug}» sat. name «${item.sat_name}»`
        );
      }
      dataWithSatId.push({
        ...item,
        sat: satResult.id,
      });
    }
  }

  return { dataWithSatId, addSatIdErrors };
};

const sendReportMail = async (errorMessages, tblItemLength) => {
  const messages = errorMessages.length
    ? `<p style="color: blue; font-size: 20px; padding: 10px 0">Messages:</p><ul style="padding-bottom: 10px">${errorMessages.map((msg) => `<li>${msg}</li>`).join('')}</ul>`
    : '';

  await sendMail({
    title: 'Parse Trans News',
    subject: `Parse transponder news`,
    body: `
    <p style="font-size: 20px;">The number of records in the database table:
      <span style="color: green;"> ${tblItemLength}</span>
    </p>
      ${messages}
    <hr />
    <p>
      <a style="color: blue; font-size: 20px; padding: 10px 0" target="_blank" href="${BASE_GURU_PATH}/${EUrlAdminParam.PARSE}" >
      Parse Transponder news again
      </a>
    </p>
    <p>
      <a style="color: #267f00; font-size: 20px; padding: 10px 0" target="_blank" href="${getDbTableLink(TRANS_NEWS)}" >
      DB Table
      </a>
    </p>
    <p>
      <a style="color: #267f00; font-size: 20px; padding: 10px 0" target="_blank" href="${PARSE_URL}" >
      Source page
      </a>
    </p>
    `,
  });
};

const R_U_N = async () => {
  let browser;
  const errorMessages = [];
  let resDbTableLength = '';
  let finalData = [];

  try {
    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const html = await parseChannelPage(browser, PARSE_URL);
    const $ = cheerio.load(html);

    const { parsedData, extractErrors } = extractParsedData($, PARSED_UPDATES);
    errorMessages.push(...extractErrors);
    const dataWithSatIdRes = await addSatId(parsedData);
    finalData = dataWithSatIdRes.dataWithSatId;
    errorMessages.push(...dataWithSatIdRes.addSatIdErrors);

    const deleteRes = await deleteDBOldTransNews(finalData);
    errorMessages.push(deleteRes);

    const insertRes = await insertDBTransNews(finalData);
    errorMessages.push(insertRes);

    resDbTableLength = await getDbIdAmount(TRANS_NEWS);
  } catch (error) {
    errorMessages.push(
      error instanceof Error
        ? `ERROR: ${error.message}`
        : 'Unknown error occurred'
    );
  } finally {
    if (browser) {
      try {
        await browser.close();
      } catch (closeError) {
        errorMessages.push(
          closeError instanceof Error
            ? `ERROR closing browser: ${closeError.message}`
            : 'Error closing browser'
        );
      }
    }
    // Закрити всі запущені процеси Chrome після завершення роботи функції
    if (isProductionMode) {
      const killRes = killChromeProcesses();
      errorMessages.push(...killRes);
    }
  }

  await sendReportMail(
    errorMessages,
    typeof resDbTableLength === 'string'
      ? 'Not Defined'
      : resDbTableLength[0].count.toLocaleString('en-US')
  );
};

R_U_N();
