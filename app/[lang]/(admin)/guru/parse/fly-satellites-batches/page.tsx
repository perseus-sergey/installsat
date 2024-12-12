import { Title } from '@/components/ui/Titles/Title';
import puppeteer from 'puppeteer';
import * as cheerio from 'cheerio';
import { getContentFromPuppeteerBrowser } from '@/controllers/parse.controller';
import Link from 'next/link';
import { poolExecute } from '@/libs/db/mysqldb';
import { DateTime } from 'luxon';
import { validSearchParam } from '@/libs/utils/validSearchParam';
import { ResultSetHeader } from 'mysql2';
import { EUrlAdminParam, killChromeProcesses } from '@/cron/libs/commons.mjs';
import { sendMail } from '@/libs/mail/sendMail';
import { renderAsync } from '@react-email/render';
import { ParseTransNews } from '@/components/EmailTemplates/parseTransNews.template';
import { parseFlyChannels } from '@/cron/libs/parseFlySat.controller.mjs';
import { ELanguage } from '@/models/language.model';
import { EDBTableTitles, getDbTableLink } from '@/models/dbTblNames.model';
import { EUrlSearchParam, TSearchParams } from '@/models/url/urlSearch.model';

export const dynamic = 'force-dynamic';

export interface ITblFlySats {
  cluster: string;
  title: string;
  url_link: string;
  slug: string;
  position: string;
  grade: string;
  date_upd: Date;
}

// =================================================================
// Parse List of Satellites from FlySat with date_upd parameter
// Parse All Satellite wich satellite date_upd from my DB is different with parsed date_upd
// ... OR parsed date_upd < then {INTERVAL_FROM_LAST_UPDATE} days ago
// =================================================================

const INTERVAL_FROM_LAST_UPDATE = 2;

const PARALLEL_LIMIT = 2;
const PARSE_BATCH_SIZE = 5;

const BASE_URL = process.env.BASE_URL;
const isProductionMode = process.env.NODE_ENV === 'production';

const IS_LOGGED = !isProductionMode;
const PARSE_URL = 'https://flysat.com/en/satellitelist';
const { FLY_SATELLITES } = EDBTableTitles;

let messages: string[] = [];

const addMessage = (message: string, error?: Error) => {
  messages.push(`${message}${error ? `: ${error.message}` : ''}`);
  if (IS_LOGGED)
    console.log(`🚀 ~ ${message}${error ? ` ERROR: ${error}` : ''}`);
};

const getDataFromDB = async () => {
  const sql = `
    SELECT cluster, title, url_link, slug, position, grade, date_upd FROM ${FLY_SATELLITES}
  `;
  const res = await poolExecute<ITblFlySats[]>(sql);
  if (res instanceof Error) {
    console.log('ERROR during SELECT data:', res.message);
    throw res;
  }

  return res;
};

const setSatDateUpd = async (currentSatSlug: string, dateUpd: Date) => {
  const dateUpdStr = dateUpd.toISOString().split('T')[0];
  const res = await poolExecute<ResultSetHeader>(
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

const insertNewSatsToDB = async (newSatellites: ITblFlySats[]) => {
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

  const res = await poolExecute<ResultSetHeader>(sql, values);

  if (res instanceof Error) {
    addMessage(
      `ERROR: during INSERT ${newSatellites.length} new satellites to DB`,
      res
    );
  } else {
    addMessage(`SUCCESS: "SET INSERT ${res.affectedRows} new satellites to DB`);
  }
};

const findDbOverSats = (dbSats: ITblFlySats[], parsedSats: ITblFlySats[]) =>
  dbSats.filter(
    (dbSat) =>
      !parsedSats.some(
        (parsedSat) =>
          parsedSat.title === dbSat.title &&
          parsedSat.url_link.split('flysat.com')[1] ===
            dbSat.url_link.split('flysat.com')[1] &&
          parsedSat.slug === dbSat.slug &&
          parsedSat.position === dbSat.position &&
          parsedSat.cluster === dbSat.cluster
      )
  );

const sendReportMail = async (errorMessages: string[]) => {
  await sendMail({
    subject: `Parse Fly Satellites`,
    body: await renderAsync(
      <ParseTransNews
        title="Parse Fly Satellites"
        pathToMainParsePage={`${BASE_URL}/${ELanguage.EN}/${EUrlAdminParam.BASE_PATH}/${EUrlAdminParam.PARSE}`}
        errorMessages={errorMessages}
        dbTableHref={getDbTableLink(FLY_SATELLITES)}
        hrefSources={PARSE_URL}
      />
    ),
  });
};

const getDayDifference = (startDate: Date) => {
  const currentDate = DateTime.now().startOf('day');
  const targetDate = DateTime.fromJSDate(startDate).startOf('day');

  return currentDate.diff(targetDate, 'days').days;
};

const isSameDate = (parseDate: DateTime, dbDate: DateTime) =>
  parseDate.startOf('day').toISODate() === dbDate.startOf('day').toISODate();

const processSatellitesInBatches = async (allParsedSats: ITblFlySats[]) => {
  let batchPromises = [];

  for (let i = 0; i < allParsedSats.length; i += PARSE_BATCH_SIZE) {
    const batch = allParsedSats.slice(i, i + PARSE_BATCH_SIZE);

    batchPromises.push(
      (async () => {
        let browser;
        let batchMessages = [];

        try {
          browser = await puppeteer.launch({
            args: [
              '--no-sandbox',
              '--disable-setuid-sandbox',
              '--disable-dev-shm-usage',
              '--disable-gpu',
            ],
            headless: true,
          });

          for (const sat of batch) {
            try {
              const parseFlyChannelsMessages = await parseFlyChannels({
                currentSatSlug: sat.slug,
                // incomingBrowser: browser,
              });
              if (Array.isArray(parseFlyChannelsMessages)) {
                batchMessages.push(...parseFlyChannelsMessages);
              }
              await setSatDateUpd(sat.slug, sat.date_upd);
            } catch (error) {
              batchMessages.push(
                `ERROR: failed during channels parsing for satellite "${sat.slug}" ${error}`
              );
            }
          }
        } catch (error) {
          batchMessages.push(
            `ERROR: failed to launch browser: ${error instanceof Error ? error.message : 'Unknown error'}`
          );
        } finally {
          if (browser) {
            try {
              await browser.close();
            } catch (closeError) {
              batchMessages.push(
                `ERROR: closing browser: ${closeError instanceof Error ? closeError.message : 'Unknown error'}`
              );
            }
          }
        }

        return batchMessages;
      })()
    );

    if (batchPromises.length >= PARALLEL_LIMIT) {
      const results = await Promise.all(batchPromises);
      messages.push(...results.flat());
      batchPromises = [];
    }
  }

  if (batchPromises.length > 0) {
    const results = await Promise.all(batchPromises);
    messages.push(...results.flat());
  }
};

// ----------------------------------------------------------------

const extractParsedData = (
  $: cheerio.CheerioAPI,
  dbSatellites: ITblFlySats[],
  intervalFromLastUpd: number
) => {
  const allParsedSats: ITblFlySats[] = [];
  const updatedSats: ITblFlySats[] = [];
  const newSats: ITblFlySats[] = [];
  const errors: string[] = [];
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

    const satInDb = dbSatellites.find(
      (dbSat) =>
        dbSat.title === parsedSat.title &&
        dbSat.url_link.split('flysat.com')[1] ===
          parsedSat.url_link.split('flysat.com')[1] &&
        dbSat.position === parsedSat.position
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

export default async function Page({
  searchParams,
}: {
  searchParams?: TSearchParams;
}) {
  const intervalFromLastUpd =
    parseInt(validSearchParam(EUrlSearchParam.INTERVAL, searchParams), 10) ||
    INTERVAL_FROM_LAST_UPDATE;

  let browser;
  // let finalData: ITblFlySats[] = [];
  let overSats: ITblFlySats[] = [];
  let newSatList: ITblFlySats[] = [];
  let updatedSatList: ITblFlySats[] = [];

  try {
    const dbSatellites = await getDataFromDB();

    browser = await puppeteer.launch({
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
      ],
      headless: true, // Запуск без графічного інтерфейсу
    });

    const html = await getContentFromPuppeteerBrowser(browser, PARSE_URL);
    const $ = cheerio.load(html);

    const { allParsedSats, newSats, updatedSats, extractErrors } =
      extractParsedData($, dbSatellites, intervalFromLastUpd);
    extractErrors.forEach((er) => addMessage(er));

    updatedSatList = updatedSats;
    newSatList = newSats;
    overSats = findDbOverSats(dbSatellites, allParsedSats);

    if (newSats.length) await insertNewSatsToDB(newSats);

    await processSatellitesInBatches(updatedSats);
    // =================================================================
    // For All Satellites
    // =================================================================
    // await processSatellitesInBatches(allParsedSats);

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
        await browser.close();
      } catch (closeError) {
        addMessage(
          'ERROR: closing browser',
          closeError instanceof Error
            ? closeError
            : new Error('Error closing browser')
        );
      }
    }
    if (isProductionMode) {
      const killRes = killChromeProcesses(isProductionMode);
      messages.push(...killRes);
    }
  }

  await sendReportMail(messages);

  return (
    <>
      <Title>
        <Link href={PARSE_URL}>Parse FlySat Satellites Table</Link>
      </Title>
      {messages.length > 0 && (
        <>
          <h2 className="font-bold text-blue-700 text-xl">Messages:</h2>
          <ul>
            {messages.map((message, i) => (
              <li key={i + message}>{message}</li>
            ))}
          </ul>
        </>
      )}
      <SatList title="New Satellites Found:" satList={newSatList} />
      <SatList
        title="Satellites From My DB NOT Found in FlySat:"
        satList={overSats}
      />
      <SatList title="Should Update Satellites" satList={updatedSatList} />
      {/* <SatList title="All Parsed Satellites" satList={finalData} /> */}
    </>
  );
}

const SatList = ({
  satList,
  title,
}: {
  satList: ITblFlySats[];
  title: string;
}) => (
  <>
    <h2 className="font-bold text-blue-700 text-xl">{title}</h2>
    <pre>{JSON.stringify(satList, null, 2)}</pre>
  </>
);

// =================================================================

// <tr bgcolor="#b9dcff">
// <td align="center"><font color="#000099" size="1"></font></font></td>
// <td align="left"><font color="#000099">&nbsp;<a href="https://flysat.com/en/satellite/nss-9">NSS-9</a></font></td>
// <td align="center"><font color="#000099" size="1"><a href="https://flysat.com/en/satellite/nss-9">183.1° E</a></font></font></td>
// <td align="center"><font color="#000099"></font></font></td>
// <td align="center" bgcolor="#ffcccc" size="1">
// <font color="#000099">
// C
// </font>
// </td>
// <td align="center" bgcolor><font color="#000099">23.09.2022</font></td>
// </tr>
// <tr bgcolor="#b9dcff">
// <td align="center"><font color="#000099" size="1"></font></font></td>
// <td align="left"><font color="#000099">&nbsp;<a href="https://flysat.com/en/satellite/abs-6">ABS-6</a></font></td>
// <td align="center"><font color="#000099" size="1"><a href="https://flysat.com/en/satellite/abs-6">159.0° E</a></font></font></td>
// <td align="center"><font color="#000099"></font></font></td>
// <td align="center" bgcolor="#ffcccc" size="1">
// <font color="#000099">
// C/Ku
// </font>
// </td>
// <td align="center" bgcolor><font color="#000099">25.02.2022</font></td>
// </tr>
// <tr bgcolor="#b9dcff">
// <td align="center"><font color="#000099" size="1"></font></font></td>
// <td align="left"><font color="#000099">&nbsp;<a href="https://flysat.com/en/satellite/express-amu7">Express-AMU7</a></font></td>
// <td align="center"><font color="#000099" size="1"><a href="https://flysat.com/en/satellite/express-amu7">145.0° E</a></font></font></td>
// <td align="center"><font color="#000099"></font></font></td>
// <td align="center" bgcolor="#ffcccc" size="1">
// <font color="#000099">
// C
// </font>
// </td>
// <td align="center" bgcolor><font color="#000099">31.10.2022</font></td>
// </tr>
// <tr bgcolor="#b9dcff">
// <td rowspan="2" align="center" style="vertical-align: center!important"><font color="#000099" size="1"><a href="https://flysat.com/en/satellite/position/140-e">140.0°E</a></font></font></td>
// <td align="left"><font color="#000099">&nbsp;<a href="https://flysat.com/en/satellite/express-am5">Express-AM5</a></font></td>
// <td align="center"><font color="#000099" size="1"><a href="https://flysat.com/en/satellite/express-am5">140.0° E</a></font></font></td>
// <td align="center"><font color="#000099"></font></font></td>
// <td align="center" bgcolor="#ffcccc" size="1">
// <font color="#000099">
// C/Ku
// </font>
// </td>
// <td align="center" bgcolor><font color="#000099">02.03.2023</font></td>
// </tr>
// <tr bgcolor="#b9dcff">
// <td align="left"><font color="#000099">&nbsp;<a href="https://flysat.com/en/satellite/express-at2">Express-AT2</a></font></td>
// <td align="center"><font color="#000099" size="1"><a href="https://flysat.com/en/satellite/express-at2">139.8° E</a></font></font></td>
// <td align="center"><font color="#000099"></font></font></td>
// <td align="center" bgcolor="#ffcccc" size="1">
// <font color="#000099">
// Ku
// </font>
// </td>
// <td align="center" bgcolor><font color="#000099">02.03.2023</font></td>
// </tr>
// <tr bgcolor="#b9dcff">
// <td align="center"><font color="#000099" size="1"></font></font></td>
// <td align="left"><font color="#000099">&nbsp;<a href="https://flysat.com/en/satellite/laosat-1">LaoSat-1</a></font></td>
// <td align="center"><font color="#000099" size="1"><a href="https://flysat.com/en/satellite/laosat-1">128.5° E</a></font></font></td>
// <td align="center"><font color="#000099"></font></font></td>
// <td align="center" bgcolor="#ffcccc" size="1">
// <font color="#000099">
// C
// </font>
// </td>
// <td align="center" bgcolor><font color="#000099">13.02.2023</font></td>
// </tr>

// Треба зібрати з нього такі дані:

// const data = [
//   {
//     cluster: '',
//     title: 'NSS-9',
//     url_link: 'https://flysat.com/en/satellite/nss-9',
//     slug: 'nss-9',
//     position: '183.1° E',
//   },
//   {
//     cluster: '',
//     title: 'ABS-6',
//     url_link: 'https://flysat.com/en/satellite/abs-6',
//     slug: 'abs-6',
//     position: '159.0° E',
//   },
//   {
//     cluster: '',
//     title: 'Express-AMU7',
//     url_link: 'https://flysat.com/en/satellite/express-amu7',
//     slug: 'express-amu7',
//     position: '145.0° E',
//   },
//   {
//     cluster: '140.0°E',
//     title: 'Express-AM5',
//     url_link: 'https://flysat.com/en/satellite/express-am5',
//     slug: 'express-am5',
//     position: '140.0° E',
//   },
//   {
//     cluster: '140.0°E',
//     title: 'Express-AT2',
//     url_link: 'https://flysat.com/en/satellite/express-at2',
//     slug: 'express-at2',
//     position: '139.8° E',
//   },
//   {
//     cluster: '',
//     title: 'LaoSat-1',
//     url_link: 'https://flysat.com/en/satellite/laosat-1',
//     slug: 'laosat-1',
//     position: '128.5° E',
//   },
// ];
