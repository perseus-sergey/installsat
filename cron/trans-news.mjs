import puppeteer from 'puppeteer';
import * as cheerio from 'cheerio';
import { DateTime } from 'luxon';
import { sendMail } from './libs/sendMail.mjs';
import {
  deleteDBOldTransNews,
  getDBSatID,
  insertDBTransNews,
  getDbIdAmount,
} from './libs/parseTransNews.controller.mjs';

const BASE_URL = process.env.BASE_URL;
const PARSE_URL = 'https://www.flysat.com/en/news';
const PARSED_UPDATES = 4;

const parseChannelPage = async (browser, url) => {
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'domcontentloaded' });

  return await page.content();
};

const actionTextHandler = (text, chanTitle, frequency) => {
  const channelTitle = chanTitle.replace('/package/ui', 'Пакет');

  const replacements = [
    { regex: /package/iu, replacement: 'Пакет' },
    {
      regex: /FTA(?: *\w*){0,2}/,
      replacement: "<span class='free_chan'>транслюється відкрито</span>",
    },
    {
      regex: /\bnew SR\b/gi,
      replacement: "<span class='add_chan'>нова SR(символьна швидкість)</span>",
    },
    {
      regex: /(?:\b\w*\b\s)*encrypted(?:\b\w*\b\s)*/iu,
      replacement: "<span class='left_chan'>закодовано на </span>",
    },
    {
      regex: /^ *(st\w+ed ag\w+n(?: *on)*) *$/iu,
      replacement: "<span class='add_chan'>відновив мовлення</span>",
    },
    {
      regex: /^ *(in the pa\w+ge ag\w*n(?: *on)*) *$/iu,
      replacement: "<span class='add_chan'>Знову в пакеті</span>",
    },
    {
      regex: /^ *(st\w+ed te\w+ng(?: *on)*) *$/iu,
      replacement: "<span class='add_chan'>розпочав тестове мовлення</span>",
    },
    {
      regex: /^ *(st\w+ed r\w+r p\w+m(?: *on)*) *$/iu,
      replacement: "<span class='add_chan'>розпочав регулярне мовлення</span>",
    },
    {
      regex: /^ *(st\w+ed p\w+m(?: *on)*) *$/iu,
      replacement: "<span class='add_chan'>розпочав транслювати</span>",
    },
    {
      regex: /^ *(st\w+ed(?: *on)*) *$/iu,
      replacement: "<span class='add_chan'>розпочав мовлення</span>",
    },
    {
      regex: /b\w+[kc] (?:on)* *\w* *new/iu,
      replacement:
        "<span class='add_chan'>повернувся з новими параметрами</span>",
    },
    {
      regex: /a\w+r a* *br\w*k/iu,
      replacement: "<span class='add_chan'>після зникнення</span>",
    },
    {
      regex: /^(ag\w*n)* *(on *(?:ag\w*n)*)/i,
      replacement: "<span class='add_chan'>з'явився на супутнику</span> ",
    },
    {
      regex: /^(ag\w*n)* *(left *(?:ag\w*n)*)/i,
      replacement: "<span class='left_chan'>припинив трансляції</span> на ",
    },
    { regex: / package /i, replacement: ' пакет ' },
    { regex: /^ *(new) /iu, replacement: 'змінилися параметри ' },
    {
      regex: /back on/iu,
      replacement: "<span class='add_chan'>повернувся</span> на ",
    },
    { regex: /old/iu, replacement: 'старий' },
    { regex: /satellites/iu, replacement: 'супутники' },
    { regex: /satellite/iu, replacement: 'супутник' },
    { regex: /now/iu, replacement: 'зараз' },
    { regex: /again/iu, replacement: 'знову' },
    { regex: /on/iu, replacement: '' },
  ];

  const changed = replacements.reduce(
    (acc, { regex, replacement }) => acc.replace(regex, replacement),
    text
  );

  return `<li><p><span class='grey_text'>${channelTitle}</span> ${changed} ${frequency}`;
};

const extractParsedData = ($, updateAmount) => {
  const parsedData = [];
  const extractErrors = [];

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
            extractErrors.push(
              `Error extracting CHANNEL NAME from: «${$(updateEl).html()}»`
            );

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
          if (!frequency_text) {
            extractErrors.push(
              `Error extracting FREQUENCY TEXT from: «${$(updateEl).html()}»`
            );
          }

          const action = $(updateEl).find('font[color]').last().text().trim(); // Дія (left/on), другий <font>
          if (!action) {
            extractErrors.push(
              `Error extracting ACTION from: «${$(updateEl).html()}»`
            );

            return;
          }

          const fullSatName = $(updateEl).find('a').text().trim().split('@'); // Назва супутника
          const satName = fullSatName[0].trim();
          const satPosition = fullSatName[1].trim();
          if (!satPosition || !satName) {
            extractErrors.push(
              `Error extracting SATELLITE NAME or POSITION from: «${$(updateEl).html()}»`
            );

            return;
          }

          // Encode the replaced text to handle HTML entities
          parsedData.push({
            date: dt.toISODate(),
            update,
            channel_title: channel_title,
            action: action,
            text: actionTextHandler(action, channel_title, frequency_text),
            frequency_text: frequency_text,
            sat_name: satName,
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
    const satResult = await getDBSatID(item.sat_name);
    if (typeof satResult === 'string') {
      addSatIdErrors.push(satResult);
      dataWithSatId.push({
        ...item,
        sat: '0',
      });
    } else {
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
    ? `<p style="color: blue; font-size: 20px; padding: 10px 0">Messages:</p><ul style="padding-bottom: 10px">${errorMessages.map((msg) => `<li>${msg}</li>`)}</ul>`
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
      <a style="color: blue; font-size: 20px; padding: 10px 0" target="_blank" href="${BASE_URL}/guru/parse" >
      Parse Transponder news again
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

    resDbTableLength = await getDbIdAmount('tbl_digest');
  } catch (error) {
    errorMessages.push(
      error instanceof Error
        ? `ERROR: ${error.message}`
        : 'Unknown error occurred'
    );
  } finally {
    if (browser) await browser.close();
  }

  await sendReportMail(
    errorMessages,
    typeof resDbTableLength === 'string'
      ? 'Not Defined'
      : resDbTableLength[0].count.toLocaleString('en-US')
  );
};

R_U_N();
