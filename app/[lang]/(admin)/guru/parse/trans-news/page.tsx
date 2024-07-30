// import { Title } from '@/components/ui/Titles/Title';
import puppeteer, { Browser } from 'puppeteer';
import * as cheerio from 'cheerio';
import { DateTime } from 'luxon';
import {
  EDBTableTitles,
  ELanguage,
  TSearchParams,
  getDbTableLink,
} from '@/models/ui.model';
import { validSearchParam } from '@/libs/utils/validSearchParam';
import { EUrlAdminParam, EUrlSearchParam } from '@/models/url.model';
import { IDbIdAmountModel } from '@/models/admin.model';
import { sendMail } from '@/libs/mail/sendMail';
import { renderAsync } from '@react-email/render';
import {
  deleteDBOldTransNews,
  getDBSatID,
  insertDBTransNews,
} from '@/controllers/parseTransNews.controller';
import { getDbIdAmount } from '@/controllers/schedule.controller';
import { ParseTransNews } from '@/components/EmailTemplates/parseTransNews.template';
import { execSync } from 'child_process';

export interface ITblDigestParse {
  date: string;
  update: number | null;
  channel_title: string;
  action: string;
  text: string;
  text_en: string;
  sat: string;
  sat_name: string;
  sat_position: string;
  frequency_text: string;
  country: string;
}

const BASE_URL = process.env.BASE_URL;
const isProductionMode = process.env.PRODUCTION_MODE === 'true';

const SHOW_ONLY = false;
const PARSE_URL = 'https://www.flysat.com/en/news';
const PARSED_UPDATES = 4;

const parseChannelPage = async (browser: Browser, url: string) => {
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'domcontentloaded' });

  const content = await page.content();
  await page.close();

  return content;
};

const actionTextHandler = (
  text: string,
  chanTitle: string,
  frequency: string
) => {
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

const extractParsedData = ($: cheerio.CheerioAPI, updateAmount: number) => {
  const parsedData: ITblDigestParse[] = [];
  const extractErrors: string[] = [];

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

const addSatId = async (parsedData: ITblDigestParse[]) => {
  const addSatIdErrors: string[] = [];
  const dataWithSatId: ITblDigestParse[] = [];

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

const sendReportMail = async (
  errorMessages: string[],
  tblItemLength: string
) => {
  await sendMail({
    subject: `Parse transponder news`,
    body: await renderAsync(
      <ParseTransNews
        title="Parse Trans News"
        pathToMainParsePage={`${BASE_URL}/${ELanguage.EN}/${EUrlAdminParam.BASE_PATH}/${EUrlAdminParam.PARSE}`}
        dbTableLength={tblItemLength}
        errorMessages={errorMessages}
        linkToDbTable={getDbTableLink(EDBTableTitles.TRANS_NEWS)}
        linkToSourcePage={PARSE_URL}
      />
    ),
  });
};

const killChromeProcesses = () => {
  try {
    execSync('pkill -f chrome');
  } catch (error) {
    console.error('Error killing chrome processes:', error);
  }
};

export default async function Page({
  searchParams,
}: {
  searchParams?: TSearchParams;
}) {
  const searchQuery = validSearchParam(EUrlSearchParam.INTERVAL, searchParams);

  let browser;
  const errorMessages: string[] = [];
  let resDbTableLength: IDbIdAmountModel[] | string = '';
  let finalData: ITblDigestParse[] = [];

  try {
    browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const html = await parseChannelPage(browser, PARSE_URL);
    const $ = cheerio.load(html);

    const { parsedData, extractErrors } = extractParsedData(
      $,
      parseInt(searchQuery, 10) || PARSED_UPDATES
    );
    errorMessages.push(...extractErrors);
    const dataWithSatIdRes = await addSatId(parsedData);
    finalData = dataWithSatIdRes.dataWithSatId;
    errorMessages.push(...dataWithSatIdRes.addSatIdErrors);

    if (!SHOW_ONLY) {
      const deleteRes = await deleteDBOldTransNews(finalData);
      errorMessages.push(deleteRes);
    }

    if (!SHOW_ONLY) {
      const insertRes = await insertDBTransNews(finalData);
      errorMessages.push(insertRes);
    }

    resDbTableLength = await getDbIdAmount(EDBTableTitles.TRANS_NEWS);
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

  if (!SHOW_ONLY)
    await sendReportMail(
      errorMessages,
      typeof resDbTableLength === 'string'
        ? resDbTableLength
        : resDbTableLength[0].count.toLocaleString('en-US')
    );

  // return (
  //   <>
  //     <Title>Parse FlySat</Title>
  //     {errorMessages.length > 0 && (
  //       <>
  //         <h2 className="font-bold text-blue-700 text-xl">Messages:</h2>
  //         <ul>
  //           {errorMessages.map((message, i) => (
  //             <li key={i}>{message}</li>
  //           ))}
  //         </ul>
  //       </>
  //     )}
  //     <pre>{JSON.stringify(finalData, null, 2)}</pre>
  //   </>
  // );

  return null;
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
