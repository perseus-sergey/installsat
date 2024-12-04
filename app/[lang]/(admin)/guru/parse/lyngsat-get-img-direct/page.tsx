import { ResultSetHeader } from 'mysql2';
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
import { sleep } from '@/libs/utils/sleep';
import { killChromeProcesses } from '@/cron/libs/commons.mjs';
import { Browser, Page } from 'puppeteer';
import { poolExecuteRemote } from '@/libs/db/mysqldbRemote';
// import { getContentFromPuppeteerBrowser } from '@/controllers/parse.controller';

export const dynamic = 'force-dynamic';

// =================================================================
// з моєі бд дістаю канал у якого поле logo is null
// скрипт шукає логотип цього каналу на сайті lyngsat.com. На lyngsat.com існує тільки система пошуку від google search
// логотип завантажується в папку на моєму сайті в папку Images
// в мою бд для каналів з такою ж назвою як і поточний записується назва цього логотипу наприклад ('channel1-logo.png')
// =================================================================

const { FLY_CHANNELS } = EDBTableTitles;

const BASE_URL = process.env.BASE_URL;

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

const consentBtnClick = async (page: Page) => {
  // Check for the consent button and click it if it exists
  const consentButton = await page.$('.fc-cta-consent'); // Select the consent button

  if (consentButton) {
    try {
      await consentButton.click();
      await page.waitForFunction(
        () => !document.querySelector('.fc-cta-consent'),
        { timeout: 5000 }
      ); // Wait for the consent button to disappear

      return true;
    } catch (error) {
      throw new Error(
        `Error during consent button clicked: ${(error as Error).message}`
      );
    }
  }

  return false;
};

const searchLogoLink = async (
  inputSelector: string,
  channelName: string,
  isRadio: boolean,
  page: Page
) => {
  try {
    await page.$eval(
      inputSelector,
      (el) => ((el as HTMLInputElement).value = '')
    );
    // Type the channel name into the search box
    await page.type(inputSelector, channelName);
    await page.keyboard.press('Enter');

    await sleep(2000); // Give Google search some time

    await page.waitForSelector('.gsc-resultsRoot', { timeout: 5000 });

    const content = await page.content();
    const $ = cheerio.load(content);
    const link = $(
      `.gsc-results a[href*="lyngsat.com/${isRadio ? 'radiochannels' : 'tvchannels'}/"]`
    )
      .first()
      .attr('href');

    return link;
  } catch (error) {
    throw new Error(`Error during logo search: ${(error as Error).message}`);
  }
};
// const searchLogoLink = async (
//   inputSelector: string,
//   channelName: string,
//   isRadio: boolean,
//   page: Page
// ) => {
//   try {
//     // Clear the search input before typing
//     await page.evaluate((inputSelector) => {
//       const inputElement = document.querySelector(inputSelector);
//       if (inputElement && inputElement instanceof HTMLInputElement) {
//         inputElement.value = '';
//       }
//     }, inputSelector); // Clear input

//     await page.focus(inputSelector);

//     // Type the channel name into the search box
//     await page.type(inputSelector, `${channelName}`, { delay: 100 }); // Add a small delay to simulate typing

//     await page.keyboard.press('Enter');

//     await sleep(2000); // Give Google search some time

//     // Wait for results using a more robust approach
//     await page.waitForSelector('.gsc-resultsRoot a[href*="lyngsat.com/"]', {
//       timeout: 10000,
//     });

//     // Extract the link - improved selector
//     const linkElement = await page.waitForSelector(
//       `.gsc-results a[href*="lyngsat.com/${isRadio ? 'radiochannels' : 'tvchannels'}/"]`
//     );
//     const link = await linkElement?.evaluate((el) => el.href);

//     return link;
//   } catch (error) {
//     throw new Error(`Error during logo search: ${(error as Error).message}`);
//   }
// };
// ========================= PROCESS ===================================

async function processChannelLogo(
  channelName: string,
  isRadio: boolean,
  browser: Browser
) {
  const messages = [];
  let page;
  const normalizedChannelName = normalizeChannelName(channelName);
  const searchUrl = 'https://www.lyngsat.com/search.html';
  let isConsentBtnClicked = false;

  try {
    const existingDbLogo = await getDbExistingLogo(normalizedChannelName);

    if (existingDbLogo) {
      await updateLogoInDB(channelName, existingDbLogo);

      return [
        `SUCCESS: Using existing logo for "${channelName}": ${existingDbLogo}`,
      ];
    }

    page = await browser.newPage(); // Create a new page for each channel

    // console.log(navigator.userAgent);
    await page.setUserAgent(
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'
    );
    // await page.setUserAgent(
    //   'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36'
    // );

    await page.goto(searchUrl, {
      waitUntil: 'domcontentloaded',
      timeout: 30000,
    });

    isConsentBtnClicked = await consentBtnClick(page);

    const searchInputSelector = '#gsc-i-id1';

    // await takeScreenshot(channelName, page);

    await page.waitForSelector(searchInputSelector, { timeout: 20000 });

    if (!isConsentBtnClicked) isConsentBtnClicked = await consentBtnClick(page);

    // // Type the channel name into the search box
    // await page.type('#gsc-i-id1', `channel ${channelName}`);
    // await page.keyboard.press('Enter');

    // await sleep(2000); // Give Google search some time

    // await page.waitForSelector('.gsc-resultsRoot', { timeout: 5000 });

    // const content = await page.content();
    // const $ = cheerio.load(content);
    // const lyngsatLink = $(
    //   `.gsc-results a[href*="lyngsat.com/${isRadio ? 'radiochannels' : 'tvchannels'}/"]`
    // )
    //   .first()
    //   .attr('href');

    let lyngsatLink = await searchLogoLink(
      searchInputSelector,
      channelName,
      isRadio,
      page
    );

    if (!lyngsatLink) {
      if (!isConsentBtnClicked)
        isConsentBtnClicked = await consentBtnClick(page);

      lyngsatLink = await searchLogoLink(
        searchInputSelector,
        removeParenthesesContent(channelName),
        isRadio,
        page
      );
    }

    if (!lyngsatLink) {
      // takeScreenshot(channelName, page);

      return [
        `LyngSat link not found for: "channel ${channelName}" AND "channel ${removeParenthesesContent(channelName)}"`,
      ];
    }

    messages.push(lyngsatLink);

    await page.goto(lyngsatLink);
    const channelPageContent = await page.content();
    const $channelPage = cheerio.load(channelPageContent);
    const logoImg = $channelPage(
      'table[width="700"] > tbody > tr > td:first-child img[src^="/logo/"]'
    ).first();

    if (!logoImg) return [`Logo not found on page: ${lyngsatLink}`];

    const logoUrl = logoImg.attr('src');

    if (!logoUrl)
      return [
        `Can not extract logo URL from: ${logoImg.html}. Page: ${lyngsatLink}`,
      ];

    const fullLogoUrl = `https://www.lyngsat.com${logoUrl}`;
    const response = await page.goto(fullLogoUrl);

    if (!response) return [`Bad response for image page: ${fullLogoUrl}`];

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
      return [`Error downloading logo from image page: ${fullLogoUrl}`];
    }
  } catch (error) {
    const err = error as Error;
    if (err.name === 'TimeoutError') {
      // await takeScreenshot(channelName, page);
    }
    messages.push(
      err.name === 'TimeoutError'
        ? `ERROR Puppeteer: Navigation timeout exceeded. ${err.message}`
        : `ERROR: ${err.message}`
    );

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
        channel.is_radio === 0 ? false : true,
        browser
      ); // Pass browser instance
      messages.push(...res);
      messages.push(`└──────────── "${channel.sat_slug}" ──────────────┘`);
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
  const quantity =
    validSearchParam(EUrlSearchParam.INTERVAL, searchParams) || `${10}`;

  const messages = await getChannelsLogo(quantity);

  await sendReportMail(messages, quantity);

  return (
    <>
      <Title>{`Load and save ${quantity} logos DIRECT from LyngSat`}</Title>

      <h2 className="font-bold text-blue-700 text-xl">Messages:</h2>
      <ul>
        {messages.map((message, i) => (
          <li key={i}>{message}</li>
        ))}
      </ul>
    </>
  );
};
