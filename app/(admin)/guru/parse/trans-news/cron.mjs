import { Title } from '@/components/ui/Titles/Title';
import puppeteer from 'puppeteer';
import * as cheerio from 'cheerio';
import { DateTime } from 'luxon';
import { EDBTableTitles } from '@/models/ui.model';
import { EUrlAdminParam } from '@/models/url.model';
import { sendMail } from '@/libs/mail/sendMail';
import { renderAsync } from '@react-email/render';
import {
  deleteDBOldTransNews,
  getDBSatID,
  insertDBTransNews,
} from '@/controllers/parseTransNews.controller';
import { getDbIdAmount } from '@/controllers/schedule.controller';
import { ParseTransNews } from '@/components/EmailTemplates/parseTransNews.template';

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
      regex: /FTA(?: *w*){0,2}/,
      replacement: "<span class='free_chan'>транслюється відкрито</span>",
    },
    {
      regex: /\bnew SR\b/gi,
      replacement: "<span class='add_chan'>нова SR(символьна швидкість)</span>",
    },
    {
      regex: /(?:\bw*\bs)*encrypted(?:\bw*\bs)*/iu,
      replacement: "<span class='left_chan'>закодовано на </span>",
    },
    {
      regex: /^ *(stw+ed agw+n(?: *on)*) *$/iu,
      replacement: "<span class='add_chan'>відновив мовлення</span>",
    },
    {
      regex: /^ *(in the paw+ge agw*n(?: *on)*) *$/iu,
      replacement: "<span class='add_chan'>Знову в пакеті</span>",
    },
    {
      regex: /^ *(stw+ed tew+ng(?: *on)*) *$/iu,
      replacement: "<span class='add_chan'>розпочав тестове мовлення</span>",
    },
    {
      regex: /^ *(stw+ed rw+r pw+m(?: *on)*) *$/iu,
      replacement: "<span class='add_chan'>розпочав регулярне мовлення</span>",
    },
    {
      regex: /^ *(stw+ed pw+m(?: *on)*) *$/iu,
      replacement: "<span class='add_chan'>розпочав транслювати</span>",
    },
    {
      regex: /^ *(stw+ed(?: *on)*) *$/iu,
      replacement: "<span class='add_chan'>розпочав мовлення</span>",
    },
    {
      regex: /bw+[kc] (?:on)* *w* *new/iu,
      replacement:
        "<span class='add_chan'>повернувся з новими параметрами</span>",
    },
    {
      regex: /aw+r a* *brw*k/iu,
      replacement: "<span class='add_chan'>після зникнення</span>",
    },
    {
      regex: /^(agw*n)* *(on *(?:agw*n)*)/i,
      replacement: "<span class='add_chan'>з'явився на супутнику</span> ",
    },
    {
      regex: /^(agw*n)* *(left *(?:agw*n)*)/i,
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
  await sendMail({
    subject: `Parse transponder news`,
    body: await renderAsync(
      <ParseTransNews
        pathToMainParsePage={`${BASE_URL}/${EUrlAdminParam.BASE_PATH}/${EUrlAdminParam.PARSE}`}
        dbTableLength={tblItemLength}
        errorMessages={errorMessages}
      />
    ),
  });
};

export default async function Page() {
  let browser;
  const errorMessages = [];
  let resDbTableLength = '';
  let finalData = [];

  try {
    browser = await puppeteer.launch({ headless: true });

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

    resDbTableLength = await getDbIdAmount(EDBTableTitles.TRANS_NEWS);
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

  return (
    <>
      <Title>Parse FlySat</Title>
      {errorMessages.length > 0 && (
        <>
          <h2 className="font-bold text-blue-700 text-xl">Messages:</h2>
          <ul>
            {errorMessages.map((message, i) => (
              <li key={i}>{message}</li>
            ))}
          </ul>
        </>
      )}
      <pre>{JSON.stringify(finalData, null, 2)}</pre>
    </>
  );
}

// =================================================================
// =================================================================

// <p class="baslik">02.06.2024/4th update</p>
// <p class="guncellemenormal"> <b><font color="##686868">19:50 CET</font></b> <b>Rai 3</b> ( Stream 1 - RAI 3 Nazionali,11637 V )
// <font color="#ff0000">
// <b>left</b>
// </font>
// <b><a href="https://flysat.com/en/satellite/eutelsat-5-west-b"> Eutelsat 5 West B @ 5° W </a></b> </p>
// <p style="height: 8px; font-size:1px;">&nbsp;</p>
// <p class="guncellemenormal"> <b><font color="##686868">19:50 CET</font></b> <b>Rai 1</b> ( Stream 7 - RAI Mux MR 3,11637 V )
// <font color="#ff0000">
// <b>on</b>
// </font>
// <b><a href="https://flysat.com/en/satellite/eutelsat-5-west-b"> Eutelsat 5 West B @ 5° W </a></b> </p>

// <p class="baslik">02.06.2024/3rd update</p>
// <p class="guncellemenormal"> <b><font color="##686868">16:32 CET</font></b> <b>MsMotorTV</b> ( 12577 H )
// <font color="#ff0000">
// <b>left</b>
// </font>
// <b><a href="https://flysat.com/en/satellite/hot-bird-13g"> Hot Bird 13G @ 13° E </a></b> </p>
// <p class="guncellemenormal"> <b><font color="##686868">16:32 CET</font></b> <b>MS Channel</b> ( 12577 H )
// <font color="#ff0000">
// <b>left</b>
// </font>
// <b><a href="https://flysat.com/en/satellite/hot-bird-13g"> Hot Bird 13G @ 13° E </a></b> </p>

// <p class="baslik">02.06.2024/2nd update</p>
// <p class="guncellemenormal"> <b><font color="##686868">13:13 CET</font></b> <b>beIN Sports AFC</b> ( beIN, 10810 V )
// <font color="#ff0000">
// <b>left</b>
// </font>
// <b><a href="https://flysat.com/en/satellite/es-hail-2"> Es&#039;hail-2 @ 25.8° E </a></b> </p>

// <p class="baslik">01.06.2024/1st update</p>
// <p class="guncellemenormal"> <b><font color="##686868">06:40 CET</font></b> <b>MTV India</b> ( 4160 V )
// <font color="#16ad16">
// <b>on</b>
// </font>
// <b><a href="https://flysat.com/en/satellite/measat-3d"> Measat 3d @ 91.5° E </a></b> </p>

// <p class="guncellemenormal"> <b><font color="##686868">17:45 CET</font></b> <b>Suspilne Kyiv (RZR)</b> ( Viasat Ukraine, 12207 V )
// <font color="#16ad16">
// <b>back on</b>
// </font>
// <b><a href="https://www.flysat.com/en/satellite/astra-4a"> Astra 4A @ 4.8° E </a></b> </p>

// const data: ITblDigestParse[] = [
// {
//   date: '02.06.2024',
//   update: 4,
//   channel_title: 'Rai 3',
//   action: 'left',
//   frequency_text: '( Stream 1 - RAI 3 Nazionali,11637 V )',
//   sat_name: 'Eutelsat 5 West B @ 5° W',
// },
// {
//   date: '02.06.2024',
//   update: 4,
//   channel_title: 'Rai 1',
//   action: 'on',
//   frequency_text: '( Stream 7 - RAI Mux MR 3,11637 V )',
//   sat_name: 'Eutelsat 5 West B @ 5° W',
// },

// {
//   date: '02.06.2024',
//   update: 3,
//   channel_title: 'MsMotorTV',
//   action: 'left',
//   frequency_text: '( 12577 H )',
//   sat_name: 'Hot Bird 13G @ 13° E',
// },
// {
//   date: '02.06.2024',
//   update: 3,
//   channel_title: 'MS Channel',
//   action: 'left',
//   frequency_text: '( 12577 H )',
//   sat_name: 'Hot Bird 13G @ 13° E',
// },

// {
//   date: '02.06.2024',
//   update: 2,
//   channel_title: 'beIN Sports AFC',
//   action: 'left',
//   frequency_text: '( beIN, 10810 V )',
//   sat_name: 'Es'hail-2 @ 25.8° E',
// },

// {
//   date: '01.06.2024',
//   update: 1,
//   channel_title: 'MTV India',
//   action: 'on',
//   frequency_text: '( 4160 V )',
//   sat_name: 'Measat 3d @ 91.5° E',
// },

// {
//   date: 04.06.2024',
//   update: 5,
//   channel_title: 'Suspilne Kyiv (RZR)',
//   action: 'back on',
//   frequency_text: '( Viasat Ukraine, 12207 V )',
//   sat_name: 'Astra 4A @ 4.8° E',
// },
// ]
