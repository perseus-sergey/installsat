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
import { execSync } from 'child_process';

const BASE_URL = process.env.BASE_URL;
const isProductionMode = process.env.PRODUCTION_MODE === 'true';

const PARSE_URL = 'https://www.flysat.com/en/news';
const PARSED_UPDATES = 4;

const parseChannelPage = async (browser, url) => {
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'domcontentloaded' });

  const content = await page.content();
  await page.close();

  return content;
};

const actionTextHandler = (text, chanTitle, frequency) => {
  const replacements = [
    { regex: /package/giu, ua: 'Пакет', en: 'Package' },
    {
      regex: /FTA(?: *\w*){0,2}/giu,
      ua: "<span class='free_chan'>транслюється відкрито</span>",
      en: "<span class='free_chan'>free broadcasting</span>",
    },
    {
      regex: /\bnew SR\b/giu,
      ua: "<span class='add_chan'>нова SR(символьна швидкість)</span>",
      en: "<span class='add_chan'>new SR (symbol rate)</span>",
    },
    {
      regex: /(?:\b\w*\b\s)*encrypted(?:\b\w*\b\s)*/giu,
      ua: "<span class='left_chan'>закодовано на </span>",
      en: "<span class='left_chan'>encrypted on </span>",
    },
    {
      regex: /^ *(st\w+ed ag\w+n(?: *on)*) *$/giu,
      ua: "<span class='add_chan'>відновив мовлення</span>",
      en: "<span class='add_chan'>restored broadcasting</span>",
    },
    {
      regex: /^ *(in the pa\w+ge ag\w*n(?: *on)*) *$/giu,
      ua: "<span class='add_chan'>Знову в пакеті</span>",
      en: "<span class='add_chan'>restored in the package</span>",
    },
    {
      regex: /^ *(st\w+ed te\w+ng(?: *on)*) *$/giu,
      ua: "<span class='add_chan'>розпочав тестове мовлення</span>",
      en: "<span class='add_chan'>started test broadcasting</span>",
    },
    {
      regex: /^ *(st\w+ed r\w+r p\w+m(?: *on)*) *$/giu,
      ua: "<span class='add_chan'>розпочав регулярне мовлення</span>",
      en: "<span class='add_chan'>started regular broadcasting</span>",
    },
    {
      regex: /^ *(st\w+ed p\w+m(?: *on)*) *$/giu,
      ua: "<span class='add_chan'>розпочав транслювати</span>",
      en: "<span class='add_chan'>started translating</span>",
    },
    {
      regex: /^ *(st\w+ed(?: *on)*) *$/giu,
      ua: "<span class='add_chan'>розпочав мовлення</span>",
      en: "<span class='add_chan'>started broadcasting</span>",
    },
    {
      regex: /b\w+[kc] (?:on)* *\w* *new/giu,
      ua: "<span class='add_chan'>повернувся з новими параметрами</span>",
      en: "<span class='add_chan'>returned with new parameters</span>",
    },
    {
      regex: /a\w+r a* *br\w*k/giu,
      ua: "<span class='add_chan'>після зникнення</span>",
      en: "<span class='add_chan'>after disappearance</span>",
    },
    {
      regex: /^(ag\w*n)* *(on *(?:ag\w*n)*)/giu,
      ua: "<span class='add_chan'>з'явився на супутнику</span> ",
      en: "<span class='add_chan'>appeared on the satellite </span>",
    },
    {
      regex: /^(ag\w*n)* *(left *(?:ag\w*n)*)/giu,
      ua: "<span class='left_chan'>припинив трансляції</span> на ",
      en: "<span class='left_chan'>stopped broadcasting</span> on ",
    },
    { regex: / package /giu, ua: ' пакет ', en: ' package ' },
    {
      regex: /^ *(new) /giu,
      ua: 'змінилися параметри ',
      en: 'parameters have changed ',
    },
    {
      regex: /back on/giu,
      ua: "<span class='add_chan'>повернувся</span> на ",
      en: "<span class='add_chan'>returned</span> on ",
    },
    { regex: /old/giu, ua: 'старий', en: 'old' },
    { regex: /satellites/giu, ua: 'супутники', en: 'satellites' },
    { regex: /satellite/giu, ua: 'супутник', en: 'satellite' },
    { regex: /now/giu, ua: 'зараз', en: 'now' },
    { regex: /again/giu, ua: 'знову', en: 'again' },
    { regex: /on/giu, ua: '', en: 'on' },
  ];

  const changed = replacements.reduce(
    (acc, { regex, ua, en }) => {
      const uaRes = acc.ua.replaceAll(regex, ua);
      const enRes = acc.en.replaceAll(regex, en);

      return { ua: uaRes, en: enRes };
    },
    { ua: text, en: text }
  );

  return {
    ua: `<li><p><span class='grey_text'>${chanTitle.replaceAll('/package/ui', 'Пакет')}</span> ${changed.ua} ${frequency}`,
    en: `<li><p><span class='grey_text'>${chanTitle.replaceAll('/package/ui', 'Package')}</span> ${changed.en} ${frequency}`,
  };
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

const killChromeProcesses = () => {
  try {
    execSync('pkill -f chrome');
  } catch (error) {
    console.error('Error killing chrome processes:', error);
  }
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
    isProductionMode && killChromeProcesses();
  }

  await sendReportMail(
    errorMessages,
    typeof resDbTableLength === 'string'
      ? 'Not Defined'
      : resDbTableLength[0].count.toLocaleString('en-US')
  );
};

R_U_N();
