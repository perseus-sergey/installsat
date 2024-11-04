import { Title } from '@/components/ui/Titles/Title';
// import { DateTime } from 'luxon';
// import { revalidatePath } from 'next/cache';

// import puppeteer, { Browser } from 'puppeteer';
// import * as cheerio from 'cheerio';
// import { IDbIdAmountModel } from '@/models/admin.model';
// import { sendMail } from '@/libs/mail/sendMail';
// import { renderAsync } from '@react-email/render';
// import { getDbIdAmount } from '@/controllers/schedule.controller';
import {
  // EUrlAdminParam,
  EUrlSearchParam,
  // killChromeProcesses,
  validSearchParam,
} from '@cron/libs/commons.mjs';
// import {
//   getDBSatID,
//   deleteDBOldTransNews,
//   insertDBTransNews,
//   actionTextHandler,
// } from '@cron/libs/parseTransNews.controller.mjs';
// import { EDBTableTitles, getDbTableLink } from '@/models/dbTblNames.model';
// import { ELanguage } from '@/models/language.model';
import { parseTransNews } from '@cron/libs/parseTransNews.controller.mjs';
import { TSearchParams } from '@/models/url/urlSearch.model';

// export interface ITblDigestParse {
//   date: string;
//   update: number | null;
//   channel_title: string;
//   action: string;
//   text: string;
//   text_en: string;
//   sat: string;
//   sat_name: string;
//   sat_slug: string | null;
//   sat_grade: string | null;
//   sat_position: string;
//   frequency_text: string;
//   country: string;
// }

// const BASE_URL = process.env.BASE_URL;
// const isProductionMode = process.env.NODE_ENV === 'production';

// const SHOW_ONLY = false;
// const PARSE_URL = 'https://www.flysat.com/en/news';
// const PARSED_UPDATES = 4;

// const parseChannelPage = async (browser: Browser, url: string) => {
//   const page = await browser.newPage();
//   await page.goto(url, { waitUntil: 'domcontentloaded' });

//   const content = await page.content();
//   await page.close();

//   return content;
// };

// const extractParsedData = ($: cheerio.CheerioAPI, updateAmount: number) => {
//   const parsedData: ITblDigestParse[] = [];
//   const extractErrors: string[] = [];

//   const addMessage = (
//     itemTitle: string,
//     from: string | null,
//     type: 'WARNING' | 'ERROR'
//   ) =>
//     extractErrors.push(
//       `${type}: Cannot extract ${itemTitle} from: «${from || 'CHEERIO HTML'}»`
//     );

//   const baslikElements = $('p.baslik');
//   const firstThreeBaslikElements = baslikElements.slice(0, updateAmount);

//   firstThreeBaslikElements.each((_i, el) => {
//     const dateText = $(el).text(); // Отримуємо текст з елемента <p class="baslik">>
//     const [date, updateText] = dateText.split('/'); // Розділяємо текст на дату і номер оновлення
//     const dt = DateTime.fromFormat(date, 'dd.MM.yyyy', { zone: 'utc' });
//     if (!dt.isValid) {
//       extractErrors.push(`Error extracting DATE from: «${dateText}»`);

//       return;
//     }

//     const update = parseInt(updateText, 10) || null; // Конвертуємо номер оновлення в число

//     // Збираємо всі наступні елементи <p> до наступного <p class="baslik">

//     $(el)
//       .nextUntil('p.baslik')
//       .each((_j, updateEl) => {
//         if ($(updateEl).hasClass('guncellemenormal')) {
//           const channel_title = $(updateEl).find('b').eq(1).text().trim(); // Назва каналу
//           if (!channel_title) {
//             addMessage('CHANNEL NAME', $(updateEl).html(), 'ERROR');

//             return;
//           }

//           // Збираємо частоту між дужками, або використовуємо текст після назви каналу
//           let frequency_text = '';
//           const textAfterChanTitle = $(updateEl).text().split(channel_title)[1];
//           const frequencyMatch = textAfterChanTitle.match(/\(([^)]+)\)/);
//           if (frequencyMatch) {
//             frequency_text = `(${frequencyMatch[1].trim()})`;
//           } else {
//             const fallbackMatch = textAfterChanTitle.match(/\(.*\)/);
//             if (fallbackMatch) {
//               frequency_text = fallbackMatch[0];
//             }
//           }
//           if (!frequency_text)
//             addMessage('FREQUENCY TEXT', $(updateEl).html(), 'WARNING');

//           const action = $(updateEl).find('font[color]').last().text().trim(); // Дія (left/on), другий <font>
//           if (!action) {
//             addMessage('ACTION', $(updateEl).html(), 'ERROR');

//             return;
//           }

//           const satNameLink = $(updateEl).find('a');
//           const satHref = satNameLink.attr('href');
//           if (!satHref) addMessage('URL_LINK', $(updateEl).html(), 'WARNING');

//           const slug = satHref ? satHref.split('/').pop() : '';
//           if (!slug) addMessage('SLUG', satHref || '', 'WARNING');

//           const fullSatName = satNameLink.text().trim().split('@'); // Назва супутника
//           const satName = fullSatName[0].trim();
//           if (!satName) {
//             addMessage('SATELLITE NAME', $(updateEl).html(), 'ERROR');

//             return;
//           }
//           const satPosition = fullSatName[1].trim();
//           if (!satPosition)
//             addMessage('SATELLITE POSITION', $(updateEl).html(), 'WARNING');

//           const [grade, ew] = satPosition.split('° ');
//           if (!grade || !ew) addMessage('GRADE', $(updateEl).html(), 'WARNING');

//           const { ua, en } = actionTextHandler(
//             action,
//             channel_title,
//             frequency_text
//           );

//           // Encode the replaced text to handle HTML entities
//           parsedData.push({
//             date: dt.toISODate(),
//             update,
//             channel_title: channel_title,
//             action: action,
//             text: ua,
//             text_en: en,
//             frequency_text: frequency_text,
//             sat_name: satName,
//             sat_slug: slug || null,
//             sat_grade: ew === 'E' ? grade : `-${grade}`,
//             sat_position: satPosition,
//             sat: '',
//             country: '',
//           });
//         }
//       });
//   });

//   return { parsedData, extractErrors };
// };

// const addSatId = async (parsedData: ITblDigestParse[]) => {
//   const addSatIdErrors: string[] = [];
//   const dataWithSatId: ITblDigestParse[] = [];

//   for (const item of parsedData) {
//     const satResult = await getDBSatID(item.sat_slug, item.sat_name);
//     if (typeof satResult === 'string') {
//       addSatIdErrors.push(satResult);
//       dataWithSatId.push({
//         ...item,
//         sat: '0',
//       });
//     } else {
//       if (parseFloat(satResult.grade) !== parseFloat(item.sat_grade || '')) {
//         addSatIdErrors.push(
//           `WARNING: SATELLITE GRADE from DB: «${satResult.grade}» is DIFFERENT from parsed GRADE: «${item.sat_grade}» for satellite slug «${item.sat_slug}» sat. name «${item.sat_name}»`
//         );
//       }
//       dataWithSatId.push({
//         ...item,
//         sat: satResult.id,
//       });
//     }
//   }

//   return { dataWithSatId, addSatIdErrors };
// };

// const sendReportMail = async (
//   errorMessages: string[],
//   tblItemLength: string
// ) => {
//   await sendMail({
//     subject: `Parse transponder news`,
//     body: await renderAsync(
//       <ParseTransNews
//         title="Parse Trans News"
//         pathToMainParsePage={`${BASE_URL}/${ELanguage.EN}/${EUrlAdminParam.BASE_PATH}/${EUrlAdminParam.PARSE}`}
//         dbTableLength={tblItemLength}
//         errorMessages={errorMessages}
//         dbTableHref={getDbTableLink(EDBTableTitles.TRANS_NEWS)}
//         hrefSources={PARSE_URL}
//       />
//     ),
//   });
// };

export default async function Page({
  searchParams,
}: {
  searchParams?: TSearchParams;
}) {
  const searchQuery = validSearchParam(EUrlSearchParam.INTERVAL, searchParams);

  const PARSED_UPDATES = 4;

  const errorMessages = (await parseTransNews(
    parseInt(searchQuery, 10) || PARSED_UPDATES
  )) as string[];

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
