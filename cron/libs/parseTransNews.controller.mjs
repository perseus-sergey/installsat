import memoize from 'lodash.memoize';
import { DateTime } from 'luxon';
import * as cheerio from 'cheerio';
import { sendMail } from './sendMail.mjs';

import { executePoolQuery, getPool } from './mysqldb.mjs';
import {
  EDBTableTitles,
  getDbTableLink,
  EUrlAdminParam,
  killChromeProcesses,
} from './commons.mjs';
import { getDbIdAmount } from './utils.mjs';

import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

puppeteer.use(StealthPlugin());

const pool = getPool();

const BASE_URL = process.env.BASE_URL;
const BASE_GURU_PATH = `${BASE_URL}/en/${EUrlAdminParam.BASE_PATH}`;
const isProductionMode = process.env.NODE_ENV === 'production';
const { TRANS_NEWS } = EDBTableTitles;

const PARSE_URL = 'https://www.flysat.com/en/news';
// const PARSED_UPDATES = 4;

const getDBSatID = memoize(async (satSlug, satName) => {
  if (!satSlug)
    return `ERROR extracting SATELLITE ID from DB. Parsed satellite SLUG not defined for sat. name «${satName}»`;

  const sql = `
  SELECT id, grade
  FROM ${EDBTableTitles.FLY_SATELLITES}
  WHERE slug = ?
  LIMIT 1
`;
  const res = await executePoolQuery(sql, [satSlug]);

  if (res instanceof Error) return `DB Error: ${res.message}`;
  if (res.length === 0)
    return `ERROR extracting SATELLITE ID from DB. Can't find satellite slug «${satSlug}» for sat. name «${satName}»`;

  return res[0];
});

const insertDBTransNews = async (data) => {
  const numFields = Object.keys(data[0]).length; // Кількість полів в об'єкті
  const placeholderTemplate = `(${Array(numFields).fill('?').join(', ')})`;
  const placeholders = data.map(() => placeholderTemplate).join(', ');

  const values = data.flatMap((item) => [
    item.date,
    item.update,
    item.channel_title,
    item.action,
    item.text,
    item.text_en,
    item.text_ru,
    item.text_es,
    item.text_ar,
    item.text_de,
    item.text_fr,
    item.text_it,
    item.sat,
    item.sat_name,
    item.sat_slug,
    item.sat_grade,
    item.sat_position,
    item.frequency_text,
    item.country,
  ]);

  const sql = `
    INSERT INTO ${EDBTableTitles.TRANS_NEWS}
    (
      \`date\`,
      \`update\`,
      \`channel_title\`,
      \`action\`,
      \`text\`,
      \`text_en\`,
      \`text_ru\`,
      \`text_es\`,
      \`text_ar\`,
      \`text_de\`,
      \`text_fr\`,
      \`text_it\`,
      \`sat\`,
      \`sat_name\`,
      \`sat_slug\`,
      \`sat_grade\`,
      \`sat_position\`,
      \`frequency_text\`,
      \`country\`
    )
    VALUES ${placeholders};
  `;

  const res = await executePoolQuery(sql, values);

  if (res instanceof Error) {
    throw new Error(`DB INSERT data: ${res.message}`);
  }

  return `DB SUCCESS! inserted rows: ${res.affectedRows}`;
};

const deleteDBOldTransNews = async (data) => {
  const uniqueDateUpdatePairs = [
    ...new Set(
      data.map(
        (item) => `(${pool.escape(item.date)}, ${pool.escape(item.update)})`
      )
    ),
  ];

  const sql = `
    DELETE FROM ${EDBTableTitles.TRANS_NEWS}
    WHERE (\`date\`, \`update\`) IN (${uniqueDateUpdatePairs.join(', ')});
  `;
  const res = await executePoolQuery(sql);

  if (res instanceof Error)
    throw new Error(`DB DELETE data: ${res.message}!!! sql: ${sql}`);

  return `DB SUCCESS! deleted rows: ${res.affectedRows}`;
};

const actionTextHandler = (text, chanTitle, frequency) => {
  const replacements = [
    {
      regex: /package/giu,
      ua: 'Пакет',
      en: 'Package',
      ru: 'пакет',
      es: 'paquete',
      ar: 'حزمة',
      de: 'Paket',
      fr: 'paquet',
      it: 'pacchetto',
    },
    {
      regex: /FTA(?: *\w*){0,2}/giu,
      ua: "<span class='free_chan'>транслюється відкрито</span>",
      en: "<span class='free_chan'>free broadcasting</span>",
      ru: "<span class='free_chan'>идет открыто</span>",
      es: "<span class='free_chan'>transmisión libre</span>",
      ar: "<span class='free_chan'>بث مجاني</span>",
      de: "<span class='free_chan'>frei empfangbar</span>",
      fr: "<span class='free_chan'>diffusion libre</span>",
      it: "<span class='free_chan'>trasmissione gratuita</span>",
    },
    {
      regex: /\bnew SR\b/giu,
      ua: "<span class='add_chan'>нова SR(символьна швидкість)</span>",
      en: "<span class='add_chan'>new SR (symbol rate)</span>",
      ru: "<span class='add_chan'>новая SR (символьная скорость)</span>",
      es: "<span class='add_chan'>nueva SR (tasa de símbolos)</span>",
      ar: "<span class='add_chan'>SR جديدة (معدل الرموز)</span>",
      de: "<span class='add_chan'>neue SR (Symbolrate)</span>",
      fr: "<span class='add_chan'>nouveau SR (taux de symboles)</span>",
      it: "<span class='add_chan'>nuovo SR (velocità di simbolo)</span>",
    },
    {
      regex: /(?:\b\w*\b\s)*encrypted(?:\b\w*\b\s)*/giu,
      ua: "<span class='left_chan'>закодовано на </span>",
      en: "<span class='left_chan'>encrypted on </span>",
      ru: "<span class='left_chan'>закодировано на </span>",
      es: "<span class='left_chan'>codificado en </span>",
      ar: "<span class='left_chan'>مشفرة على </span>",
      de: "<span class='left_chan'>verschlüsselt auf </span>",
      fr: "<span class='left_chan'>crypté sur </span>",
      it: "<span class='left_chan'>crittografato su </span>",
    },
    {
      regex: /^ *(st\w+ed ag\w+n(?: *on)*) *$/giu,
      ua: "<span class='add_chan'>відновив мовлення</span>",
      en: "<span class='add_chan'>restored broadcasting</span>",
      ru: "<span class='add_chan'>возобновил вещание</span>",
      es: "<span class='add_chan'>transmisión restaurada</span>",
      ar: "<span class='add_chan'>استأنف البث</span>",
      de: "<span class='add_chan'>Sendung wiederhergestellt</span>",
      fr: "<span class='add_chan'>émission rétablie</span>",
      it: "<span class='add_chan'>trasmissione ripristinata</span>",
    },
    {
      regex: /^ *(in the pa\w+ge ag\w*n(?: *on)*) *$/giu,
      ua: "<span class='add_chan'>Знову в пакеті</span>",
      en: "<span class='add_chan'>restored in the package</span>",
      ru: "<span class='add_chan'>снова в пакете</span>",
      es: "<span class='add_chan'>restaurado en el paquete</span>",
      ar: "<span class='add_chan'>عاد في الحزمة</span>",
      de: "<span class='add_chan'>wieder im Paket</span>",
      fr: "<span class='add_chan'>restauré dans le package</span>",
      it: "<span class='add_chan'>di nuovo nel pacchetto</span>",
    },

    {
      regex: /^ *(st\w+ed te\w+ng(?: *on)*) *$/giu,
      ua: "<span class='add_chan'>розпочав тестове мовлення</span>",
      en: "<span class='add_chan'>started test broadcasting</span>",
      ru: "<span class='add_chan'>начал тестовое вещание</span>",
      es: "<span class='add_chan'>empezó la emisión de prueba</span>",
      ar: "<span class='add_chan'>بدأ البث التجريبي</span>",
      de: "<span class='add_chan'>hat Testsendung gestartet</span>",
      fr: "<span class='add_chan'>a commencé la diffusion de test</span>",
      it: "<span class='add_chan'>ha iniziato la trasmissione di prova</span>",
    },
    {
      regex: /^ *(st\w+ed r\w+r p\w+m(?: *on)*) *$/giu,
      ua: "<span class='add_chan'>розпочав регулярне мовлення</span>",
      en: "<span class='add_chan'>started regular broadcasting</span>",
      ru: "<span class='add_chan'>начал регулярное вещание</span>",
      es: "<span class='add_chan'>empezó la emisión regular</span>",
      ar: "<span class='add_chan'>بدأ البث المنتظم</span>",
      de: "<span class='add_chan'>hat reguläres Senden gestartet</span>",
      fr: "<span class='add_chan'>a commencé la diffusion régulière</span>",
      it: "<span class='add_chan'>ha iniziato la trasmissione regolare</span>",
    },
    {
      regex: /^ *(st\w+ed p\w+ms?(?: *on)*) *$/giu,
      ua: "<span class='add_chan'>розпочав транслювати</span>",
      en: "<span class='add_chan'>started translating</span>",
      ru: "<span class='add_chan'>начал трансляцию</span>",
      es: "<span class='add_chan'>empezó a transmitir</span>",
      ar: "<span class='add_chan'>بدأ البث</span>",
      de: "<span class='add_chan'>hat zu senden begonnen</span>",
      fr: "<span class='add_chan'>a commencé à transmettre</span>",
      it: "<span class='add_chan'>ha iniziato a trasmettere</span>",
    },

    {
      regex: /^ *(st\w+ed(?: *on)*) *$/giu,
      ua: "<span class='add_chan'>розпочав мовлення</span>",
      en: "<span class='add_chan'>started broadcasting</span>",
      ru: "<span class='add_chan'>начал вещание</span>",
      es: "<span class='add_chan'>comenzó a transmitir</span>",
      ar: "<span class='add_chan'>بدأ البث</span>",
      de: "<span class='add_chan'>begann zu senden</span>",
      fr: "<span class='add_chan'>a commencé à diffuser</span>",
      it: "<span class='add_chan'>ha iniziato a trasmettere</span>",
    },
    {
      regex: /b\w+[kc] (?:on)* *\w* *new/giu,
      ua: "<span class='add_chan'>повернувся з новими параметрами</span>",
      en: "<span class='add_chan'>returned with new parameters</span>",
      ru: "<span class='add_chan'>вернулся с новыми параметрами</span>",
      es: "<span class='add_chan'>regresó con nuevos parámetros</span>",
      ar: "<span class='add_chan'>عاد بمعايير جديدة</span>",
      de: "<span class='add_chan'>zurück mit neuen Parametern</span>",
      fr: "<span class='add_chan'>revenu avec de nouveaux paramètres</span>",
      it: "<span class='add_chan'>ritornato con nuovi parametri</span>",
    },
    {
      regex: /a\w+r a* *br\w*k/giu,
      ua: "<span class='add_chan'>після зникнення</span>",
      en: "<span class='add_chan'>after disappearance</span>",
      ru: "<span class='add_chan'>после исчезновения</span>",
      es: "<span class='add_chan'>después de la desaparición</span>",
      ar: "<span class='add_chan'>بعد الاختفاء</span>",
      de: "<span class='add_chan'>nach dem Verschwinden</span>",
      fr: "<span class='add_chan'>après disparition</span>",
      it: "<span class='add_chan'>dopo la scomparsa</span>",
    },
    {
      regex: /^(ag\w*n)* *(on *(?:ag\w*n)*)/giu,
      ua: "<span class='add_chan'>з'явився на супутнику</span> ",
      en: "<span class='add_chan'>appeared on the satellite </span>",
      ru: "<span class='add_chan'>появился на спутнике</span> ",
      es: "<span class='add_chan'>apareció en el satélite</span> ",
      ar: "<span class='add_chan'>ظهر على القمر الصناعي</span> ",
      de: "<span class='add_chan'>erschien auf dem Satelliten</span> ",
      fr: "<span class='add_chan'>apparu sur le satellite</span> ",
      it: "<span class='add_chan'>apparso sul satellite</span> ",
    },
    {
      regex: /^(ag\w*n)* *(left *(?:ag\w*n)*)/giu,
      ua: "<span class='left_chan'>припинив трансляції</span> на ",
      en: "<span class='left_chan'>stopped broadcasting</span> on ",
      ru: "<span class='left_chan'>прекратил вещание</span> на ",
      es: "<span class='left_chan'>dejó de transmitir</span> en ",
      ar: "<span class='left_chan'>توقف عن البث</span> على ",
      de: "<span class='left_chan'>hat die Übertragung gestoppt</span> auf ",
      fr: "<span class='left_chan'>a cessé de diffuser</span> sur ",
      it: "<span class='left_chan'>ha smesso di trasmettere</span> su ",
    },
    {
      regex: / package /giu,
      ua: ' пакет ',
      en: ' package ',
      ru: ' пакет ',
      es: ' paquete ',
      ar: ' حزمة ',
      de: ' Paket ',
      fr: ' paquet ',
      it: ' pacchetto ',
    },
    {
      regex: /^ *(new) /giu,
      ua: 'змінилися параметри ',
      en: 'parameters have changed ',
      ru: 'изменились параметры ',
      es: 'cambiaron los parámetros ',
      ar: 'تغيرت المعلمات ',
      de: 'Parameter haben sich geändert ',
      fr: 'les paramètres ont changé ',
      it: 'i parametri sono cambiati ',
    },
    {
      regex: /back on/giu,
      ua: "<span class='add_chan'>повернувся</span> на ",
      en: "<span class='add_chan'>returned</span> on ",
      ru: "<span class='add_chan'>вернулся</span> на ",
      es: "<span class='add_chan'>regresó</span> en ",
      ar: "<span class='add_chan'>عاد</span> على ",
      de: "<span class='add_chan'>zurückgekehrt</span> auf ",
      fr: "<span class='add_chan'>revenu</span> sur ",
      it: "<span class='add_chan'>tornato</span> su ",
    },
    {
      regex: /old/giu,
      ua: 'старий',
      en: 'old',
      ru: 'старый',
      es: 'antiguo',
      ar: 'قديم',
      de: 'alt',
      fr: 'ancien',
      it: 'vecchio',
    },
    {
      regex: /satellites/giu,
      ua: 'супутники',
      en: 'satellites',
      ru: 'спутники',
      es: 'satélites',
      ar: 'الأقمار الصناعية',
      de: 'Satelliten',
      fr: 'satellites',
      it: 'satelliti',
    },
    {
      regex: /satellite/giu,
      ua: 'супутник',
      en: 'satellite',
      ru: 'спутник',
      es: 'satélite',
      ar: 'قمر صناعي',
      de: 'Satellit',
      fr: 'satellite',
      it: 'satellite',
    },
    {
      regex: /now/giu,
      ua: 'зараз',
      en: 'now',
      ru: 'сейчас',
      es: 'ahora',
      ar: 'الآن',
      de: 'jetzt',
      fr: 'maintenant',
      it: 'adesso',
    },
    {
      regex: /again/giu,
      ua: 'знову',
      en: 'again',
      ru: 'снова',
      es: 'de nuevo',
      ar: 'مرة أخرى',
      de: 'wieder',
      fr: 'encore',
      it: 'di nuovo',
    },
    {
      regex: /on/giu,
      ua: '',
      en: 'on',
      ru: 'на',
      es: 'en',
      ar: 'على',
      de: 'auf',
      fr: 'sur',
      it: 'su',
    },
  ];
  const changed = replacements.reduce(
    (acc, { regex, ua, en, ru, es, ar, de, fr, it }) => {
      return {
        ua: acc.ua.replaceAll(regex, ua),
        en: acc.en.replaceAll(regex, en),
        ru: acc.ru.replaceAll(regex, ru),
        es: acc.es.replaceAll(regex, es),
        ar: acc.ar.replaceAll(regex, ar),
        de: acc.de.replaceAll(regex, de),
        fr: acc.fr.replaceAll(regex, fr),
        it: acc.it.replaceAll(regex, it),
      };
    },
    {
      ua: text,
      en: text,
      ru: text,
      es: text,
      ar: text,
      de: text,
      fr: text,
      it: text,
    }
  );

  return {
    ua: `<li><p><span class='grey_text'>${chanTitle.replaceAll(/package/giu, 'Пакет')}</span> ${changed.ua} ${frequency}</p></li>`,
    en: `<li><p><span class='grey_text'>${chanTitle.replaceAll(/package/giu, 'Package')}</span> ${changed.en} ${frequency}</p></li>`,
    ru: `<li><p><span class='grey_text'>${chanTitle.replaceAll(/package/giu, 'Пакет')}</span> ${changed.ru} ${frequency}</p></li>`,
    es: `<li><p><span class='grey_text'>${chanTitle.replaceAll(/package/giu, 'Paquete')}</span> ${changed.es} ${frequency}</p></li>`,
    ar: `<li><p><span class='grey_text'>${chanTitle.replaceAll(/package/giu, 'الحزمة')}</span> ${changed.ar} ${frequency}</p></li>`,
    de: `<li><p><span class='grey_text'>${chanTitle.replaceAll(/package/giu, 'Paket')}</span> ${changed.de} ${frequency}</p></li>`,
    fr: `<li><p><span class='grey_text'>${chanTitle.replaceAll(/package/giu, 'Paquet')}</span> ${changed.fr} ${frequency}</p></li>`,
    it: `<li><p><span class='grey_text'>${chanTitle.replaceAll(/package/giu, 'Pacchetto')}</span> ${changed.it} ${frequency}</p></li>`,
  };
};

const parseChannelPage = async (browser, url) => {
  const page = await browser.newPage();
  await page.setUserAgent(
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'
  );

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

          const { ua, en, ru, es, ar, de, fr, it } = actionTextHandler(
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
            text_ru: ru,
            text_es: es,
            text_ar: ar,
            text_de: de,
            text_fr: fr,
            text_it: it,
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

export const parseTransNews = async (parsedUpdates) => {
  let browser;
  const errorMessages = [];
  let resDbTableLength = '';
  let finalData = [];

  try {
    const browser = await puppeteer.launch({
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
      ],
    });

    const html = await parseChannelPage(browser, PARSE_URL);
    const $ = cheerio.load(html);

    const { parsedData, extractErrors } = extractParsedData($, parsedUpdates);
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
        const pages = await browser.pages();
        await Promise.all(pages.map((page) => page.close())); // Закрити всі відкриті сторінки
        await browser.close();
      } catch (closeError) {
        errorMessages.push(
          closeError instanceof Error
            ? `ERROR closing browser: ${closeError.message}`
            : 'Error closing browser'
        );
      } finally {
        if (isProductionMode) {
          const killRes = killChromeProcesses(isProductionMode);
          errorMessages.push(...killRes);
        }
      }
    }
  }

  await sendReportMail(
    errorMessages,
    typeof resDbTableLength === 'string'
      ? 'Not Defined'
      : resDbTableLength[0].count.toLocaleString('en-US')
  );

  return errorMessages;
};
