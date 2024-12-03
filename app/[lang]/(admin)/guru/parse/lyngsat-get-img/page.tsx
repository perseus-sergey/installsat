import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import * as cheerio from 'cheerio';
import { promises as fs } from 'fs';
import path from 'path';

import { Title } from '@/components/ui/Titles/Title';
import { EUrlSearchParam, TSearchParams } from '@/models/url/urlSearch.model';
import { validSearchParam } from '@/libs/utils/validSearchParam';
import { sendMail } from '@/libs/mail/sendMail';
import { ELanguage } from '@/models/language.model';
import { EUrlAdminParam } from '@/models/url/urlAdmin.model';
import { EDBTableTitles, getDbTableLink } from '@/models/dbTblNames.model';
import { ResultSetHeader } from 'mysql2';
import { sleep } from '@/libs/utils/sleep';
import { killChromeProcesses } from '@/cron/libs/commons.mjs';
import { Browser, Page } from 'puppeteer';
import { poolExecuteRemote } from '@/libs/db/mysqldbRemote';
// import { getContentFromPuppeteerBrowser } from '@/controllers/parse.controller';

export const dynamic = 'force-dynamic';

// =================================================================
// Використовую віддалену бд на сервері з Локального!!! скрипту.
// з моєі бд дістаю канал у якого поле logo is null
// скрипт шукає логотип цього каналу на сайті lyngsat.com. На lyngsat.com існує тільки система пошуку від google search
// логотип завантажується в папку на моєму сайті Images
// в мою бд для каналів з такою ж назвою як і поточний записується назва цього логотипу наприклад ('channel1-logo.png')
// =================================================================

const { FLY_CHANNELS } = EDBTableTitles;

const BASE_URL = process.env.BASE_URL;

const NO_LOGO_TITLE = 'no-logo.png';

const isProductionMode = process.env.NODE_ENV === 'production';

const imageDir = path.join(process.cwd(), 'public', 'Images', 'channel_logo');

puppeteer.use(StealthPlugin());

const getChannelsWithoutLogo = async (limit: string) => {
  const sql = `
      SELECT title, MAX(sat_slug) as sat_slug, MAX(is_radio) as is_radio
      FROM ${FLY_CHANNELS} 
      WHERE logo IS NULL AND LENGTH(title) > 1
      GROUP BY title
      LIMIT ?
    `;
  const res = await poolExecuteRemote<
    { title: string; sat_slug: string; is_radio: 0 | 1 }[]
  >(sql, [limit]);

  return res instanceof Error
    ? res
    : res.length === 0
      ? new Error(`ERROR: Request returned empty response. sql: ${sql}`)
      : res;
};

const getDbExistingLogo = async (normalizedChannelName: string) => {
  const sql = `
      SELECT logo 
      FROM ${FLY_CHANNELS} 
      WHERE normalized_name = ?
      AND logo IS NOT NULL
      LIMIT 1
    `;
  const res = await poolExecuteRemote<{ logo: string }[]>(sql, [
    normalizedChannelName,
  ]);

  if (res instanceof Error)
    throw new Error(
      `Checking DB for existing logo. Error message: ${res.message}`
    );

  return res.length > 0 ? res[0].logo : null;
};

const updateLogoInDB = async (
  channelName: string,
  logo: string,
  isExistLogo = true
) => {
  const sql = `
      UPDATE ${FLY_CHANNELS}
      SET logo = ?
      WHERE ${isExistLogo ? 'title' : 'normalized_name'} = ? 
    `;
  const res = await poolExecuteRemote<ResultSetHeader>(sql, [
    logo,
    channelName,
  ]);

  if (res instanceof Error) throw res;
  if (res.affectedRows === 0)
    throw new Error(
      `ERROR DB UPDATE: Affected rows = ${res.affectedRows}. For SQL: "${sql}". ${isExistLogo ? 'Channel' : 'Normalized'} name: "${channelName}"`
    );

  return `SUCCESS DB UPDATE: ${res.affectedRows} rows affected for channels with ${isExistLogo ? 'original' : 'normalized'} name: "${channelName}"`;
};

async function saveLogoToFile(logoFileName: string, buffer: Buffer) {
  try {
    const filePath = path.join(imageDir, logoFileName);
    await fs.writeFile(filePath, buffer);

    return `SUCCESS SAVE TO FILE: ${logoFileName}`;
  } catch (error) {
    throw error;
  }
}

// ------------ Take a screenshot
// const takeScreenshot = async (title: string, page: Page) => {
//   await page.screenshot({
//     path: `search-results-${title.replace(/[^a-zA-Z0-9]/g, '-')}-${Date.now()}.png`,
//     fullPage: true,
//   });
// };

const removeTimeFromChannelName = (channelName: string): string =>
  channelName.replace(/\s*\(\+\d+h\)/gi, '');

const normalizeChannelName = (channelName: string): string =>
  removeTimeFromChannelName(channelName)
    .replace(/[<>:"/\\|?*]+/g, '_') // Заміна заборонених символів на "_"
    .replace(/\s/g, '') // Видалення пробілів
    .toLowerCase();

const removeParenthesesContent = (str: string) =>
  str.replace(/\s*\([^)]*\)\s*$/, '').trim();

const getLinkToPageWithLogo = async ({
  satName,
  channelName,
  isRadio,
  shouldBracketsRemoved,
  page,
}: {
  satName?: string;
  channelName: string;
  isRadio: boolean;
  shouldBracketsRemoved: boolean;
  page: Page;
}) => {
  // `https://www.google.com/search?q=site:lyngsat.com/tvchannels+${encodeURIComponent(removeTimeFromChannelName(channelName))}+${satName}`;
  const googleUrl = `https://www.google.com/search?q=site:`;
  const lyngsatStartHref = `lyngsat.com/${isRadio ? 'radiochannels' : 'tvchannels'}`;
  const searchUrl = `https://www.google.com/search?q=site:lyngsat.com/tvchannels+${encodeURIComponent(removeTimeFromChannelName(channelName))}+${satName}`;
  const channelTitleWithoutTime = removeTimeFromChannelName(channelName);
  const channelTitle = shouldBracketsRemoved
    ? encodeURIComponent(removeParenthesesContent(channelTitleWithoutTime))
    : encodeURIComponent(channelTitleWithoutTime);
  const satelliteTitle = satName ? `+${satName}` : '';
  const fullSearchUrl = `${googleUrl}${lyngsatStartHref}+${channelTitle}${satelliteTitle}`;

  try {
    const googleResponse = await page.goto(fullSearchUrl, {
      waitUntil: 'domcontentloaded',
      timeout: 30000,
    });

    if (!googleResponse || !googleResponse.ok())
      throw new Error(
        `Error loading Google search page for: ${searchUrl}. Status: ${googleResponse?.status()} ${googleResponse?.statusText()}`
      );

    // await sleep();

    const content = await page.content();

    const $ = cheerio.load(content);
    const link = $('a[href^="https://www.lyngsat.com/"]').first().attr('href');

    return { link, message: fullSearchUrl };
  } catch (error) {
    throw new Error(`Error during logo search: ${(error as Error).message}`);
  }
};
// ========================= PROCESS ===================================

async function processChannelLogo(
  channelName: string,
  satName: string,
  isRadio: boolean,
  browser: Browser
) {
  const messages = [];
  let page;
  const normalizedChannelName = normalizeChannelName(channelName);

  try {
    const existingDbLogo = await getDbExistingLogo(normalizedChannelName);

    if (existingDbLogo) {
      await updateLogoInDB(channelName, existingDbLogo);

      return [
        `SUCCESS: Using existing logo for "${channelName}": ${existingDbLogo}`,
      ];
    }

    page = await browser.newPage(); // Create a new page for each channel

    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36'
    );

    const googleResponse = await getLinkToPageWithLogo({
      channelName,
      isRadio,
      shouldBracketsRemoved: true,
      page,
    });

    messages.push(googleResponse.message);

    let lyngsatLink = googleResponse.link;

    if (!lyngsatLink) {
      await sleep();

      const googleSecondResponse = await getLinkToPageWithLogo({
        satName,
        channelName,
        isRadio,
        shouldBracketsRemoved: false,
        page,
      });
      messages.push(googleSecondResponse.message);
      lyngsatLink = googleSecondResponse.link;
    }

    if (!lyngsatLink) {
      // await sleep(2000);

      const updateDbMessage = await updateLogoInDB(
        normalizedChannelName,
        NO_LOGO_TITLE,
        false
      );
      messages.push(updateDbMessage);
      messages.push('LyngSat link not found!');

      return messages;
    }

    messages.push(`Extracted link: ${lyngsatLink}`);

    await sleep();

    await page.goto(lyngsatLink);
    const channelPageContent = await page.content();
    const $channelPage = cheerio.load(channelPageContent);
    const logoImg = $channelPage(
      'table[width="700"] > tbody > tr > td:first-child img[src^="/logo/"]'
    ).first();

    if (!logoImg) {
      messages.push(`Logo not found on page: ${lyngsatLink}`);

      return messages;
    }

    const logoUrl = logoImg.attr('src');

    if (!logoUrl) {
      messages.push(
        `Can not extract logo URL from: ${logoImg.html()}. Page: ${lyngsatLink}`
      );

      const updateDbMessage = await updateLogoInDB(
        normalizedChannelName,
        NO_LOGO_TITLE,
        false
      );
      messages.push(updateDbMessage);

      return messages;
    }

    const fullLogoUrl = `https://www.lyngsat.com${logoUrl}`;
    // await sleep();
    const response = await page.goto(fullLogoUrl);

    if (!response) {
      messages.push(`Bad response for image page: ${fullLogoUrl}`);

      return messages;
    }

    const buffer = await response.buffer();

    if (buffer) {
      const fileExtension = path.extname(logoUrl).toLowerCase();
      const fileName = `${normalizedChannelName}-logo${fileExtension}`;

      const saveToFileMessage = await saveLogoToFile(fileName, buffer);
      messages.push(saveToFileMessage);

      const updateDbMessage = await updateLogoInDB(
        normalizedChannelName,
        fileName,
        false
      );
      messages.push(updateDbMessage);
    } else {
      messages.push(`Error downloading logo from image page: ${fullLogoUrl}`);

      return messages;
    }
  } catch (error) {
    messages.push(`ERROR: ${(error as Error).message}`);

    return messages;
  } finally {
    if (page) await page.close();
  }

  return messages;
}

const getChannelsLogo = async (batchSize: string) => {
  const messages = [];
  let browser;

  try {
    browser = await puppeteer.launch({
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
      ],
      headless: true, // Запуск без графічного інтерфейсу
    });

    const channels = await getChannelsWithoutLogo(batchSize);
    if (channels instanceof Error) return [`ERROR: ${channels.message}`];

    for (const channel of channels) {
      messages.push(`┌──────────────── "${channel.title}" ────────────────┐`);
      const res = await processChannelLogo(
        channel.title,
        channel.sat_slug,
        channel.is_radio === 0 ? false : true,
        browser
      ); // Pass browser instance
      messages.push(...res);
      messages.push(`└──────────── "${channel.sat_slug}" ──────────────┘`);

      await sleep(2000);
    }
  } catch (error) {
    messages.push(`ERROR: ${(error as Error).message}`);
  } finally {
    if (browser) {
      try {
        await browser.close();
      } catch (closeError) {
        messages.push(
          `ERROR: closing browser. Message: ${(closeError as Error).message}`
        );
      }
    }
    if (isProductionMode) {
      const killRes = killChromeProcesses();
      messages.push(...killRes);
    }
  }

  return messages;
};

const sendReportMail = async (errorMessages: string[], quantity: string) => {
  const { renderAsync } = await import('@react-email/render');
  const { ParseTransNews } = await import(
    '@/components/EmailTemplates/parseTransNews.template'
  );

  await sendMail({
    subject: `Load and save ${quantity} logos from LyngSat`,
    body: await renderAsync(
      <ParseTransNews
        title={`Load and save ${quantity} logos from LyngSat`}
        pathToMainParsePage={`${BASE_URL}/${ELanguage.EN}/${EUrlAdminParam.BASE_PATH}/${EUrlAdminParam.PARSE}`}
        errorMessages={errorMessages}
        dbTableHref={getDbTableLink(FLY_CHANNELS)}
        hrefSources=""
      />
    ),
  });
};

export default async ({ searchParams }: { searchParams?: TSearchParams }) => {
  const quantity = validSearchParam(EUrlSearchParam.INTERVAL, searchParams);

  const messages = await getChannelsLogo(quantity);

  await sendReportMail(messages, quantity);

  return (
    <>
      <Title>{`Load and save ${quantity} logos from LyngSat WITH GOOGLE SEARCH`}</Title>

      <h2 className="font-bold text-blue-700 text-xl">Messages:</h2>
      <ul>
        {messages.map((message, i) => (
          <li key={i}>{message}</li>
        ))}
      </ul>
    </>
  );
};

// async function syncLogos() {
//   const localConnection = await mysql2.createConnection(localDbConfig);
//   const remoteConnection = await mysql2.createConnection(remoteDbConfig);

//   try {
//     const [rows] = await localConnection.execute(
//       'SELECT normalized_name, logo FROM channels WHERE logo IS NOT NULL'
//     );

//     for (const row of rows) {
//       try {
//         await remoteConnection.execute(
//           'UPDATE channels SET logo = ? WHERE normalized_name = ?',
//           [row.logo, row.normalized_name]
//         );
//         console.log(`Updated logo for ${row.normalized_name} to ${row.logo}`);
//       } catch (error) {
//         console.error(
//           `Error updating remote database for ${row.normalized_name}:`,
//           error
//         );
//       }
//     }
//   } finally {
//     localConnection.end();
//     remoteConnection.end();
//   }
// }

// syncLogos();
