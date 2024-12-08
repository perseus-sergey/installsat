import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import * as cheerio from 'cheerio';
import { sendMail } from './sendMail.mjs';
import { promises as fs } from 'fs';
import path from 'path';

import { EDBTableTitles, killChromeProcesses, sleep } from './commons.mjs';
import { poolExecuteRemote } from './remoteMysqldb.mjs';

// =================================================================
// Використовую віддалену бд на сервері з Локального!!! скрипту.
// з моєі бд дістаю канал у якого поле logo is null
// скрипт шукає логотип цього каналу на сайті lyngsat.com. На lyngsat.com існує тільки система пошуку від google search
// логотип завантажується в папку на моєму сайті Images
// в мою бд для каналів з такою ж назвою як і поточний записується назва цього логотипу наприклад ('channel1-logo.png')
// =================================================================

const isProductionMode = process.env.NODE_ENV === 'production';

const { FLY_CHANNELS } = EDBTableTitles;

const NO_LOGO_TITLE = 'no-logo.png';

puppeteer.use(StealthPlugin());

const getChannelsWithoutLogo = async (limit) => {
  const sql = `
      SELECT title, MAX(sat_slug) as sat_slug, MAX(is_radio) as is_radio
      FROM ${FLY_CHANNELS} 
      WHERE logo IS NULL AND LENGTH(title) > 1
      GROUP BY title
      LIMIT ?
    `;
  const res = await poolExecuteRemote(sql, [`${limit}`]);

  return res instanceof Error
    ? new Error(`REMOTE DB ERROR: ${res.message}`)
    : res.length === 0
      ? new Error(`ERROR: Request returned empty response. sql: ${sql}`)
      : res;
};

const getDbExistingLogo = async (normalizedChannelName) => {
  const sql = `
      SELECT logo 
      FROM ${FLY_CHANNELS} 
      WHERE normalized_name = ?
      AND logo IS NOT NULL
      LIMIT 1
    `;
  const res = await poolExecuteRemote(sql, [normalizedChannelName]);

  if (res instanceof Error)
    throw new Error(
      `Checking DB for existing logo. Error message: ${res.message}`
    );

  return res.length > 0 ? res[0].logo : null;
};

const updateLogoInDB = async (channelName, logo, isExistLogo = true) => {
  const sql = `
      UPDATE ${FLY_CHANNELS}
      SET logo = ?
      WHERE ${isExistLogo ? 'title' : 'normalized_name'} = ? 
    `;
  const res = await poolExecuteRemote(sql, [logo, channelName]);

  if (res instanceof Error) throw res;
  if (res.affectedRows === 0)
    throw new Error(
      `ERROR DB UPDATE: Affected rows = ${res.affectedRows}. For SQL: "${sql}". ${isExistLogo ? 'Channel' : 'Normalized'} name: "${channelName}"`
    );

  return `SUCCESS DB UPDATE: ${res.affectedRows} rows affected for channels with ${isExistLogo ? 'original' : 'normalized'} name: "${channelName}"`;
};

async function saveLogoToFile(logoFileName, buffer, isCron) {
  const imageDir = isCron
    ? path.join(
        process.cwd(),
        'Documents',
        'sait',
        'NextJs',
        'installsat',
        'public',
        'Images',
        'channel_logo'
      )
    : path.join(process.cwd(), 'public', 'Images', 'channel_logo');

  try {
    const filePath = path.join(imageDir, logoFileName);
    await fs.writeFile(filePath, buffer);

    return `SUCCESS SAVE TO FILE: ${logoFileName}`;
  } catch (error) {
    throw error;
  }
}

// ------------ Take a screenshot
// const takeScreenshot = async (title, page) => {
//   await page.screenshot({
//     path: `search-results-${title.replace(/[^a-zA-Z0-9]/g, '-')}-${Date.now()}.png`,
//     fullPage: true,
//   });
// };

const removeTimeFromChannelName = (channelName) =>
  channelName.replace(/\s*\(\+\d+h\)/gi, '');

const normalizeChannelName = (channelName) =>
  removeTimeFromChannelName(channelName)
    .replace(/[<>:"/\\|?*]+/g, '_') // Заміна заборонених символів на "_"
    .replace(/\s/g, '') // Видалення пробілів
    .toLowerCase();

const removeParenthesesContent = (str) =>
  str.replace(/\s*\([^)]*\)\s*$/, '').trim();

const getLinkToPageWithLogo = async ({
  satName,
  channelName,
  isRadio,
  shouldBracketsRemoved,
  page,
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
    throw new Error(`Error during logo search: ${error.message}`);
  }
};
// ========================= PROCESS ===================================

async function processChannelLogo(
  channelName,
  satName,
  isRadio,
  browser,
  isCron
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

    // await page.setUserAgent(
    //   'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36'
    // );

    await page.setUserAgent(
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'
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

      const saveToFileMessage = await saveLogoToFile(fileName, buffer, isCron);
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
    messages.push(`ERROR: ${error.message}`);

    return messages;
  } finally {
    if (page) await page.close();
  }

  return messages;
}

const getChannelsLogo = async (quantity, isCron) => {
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

    const channels = await getChannelsWithoutLogo(quantity);
    // if (channels instanceof Error)
    //   return [`REMOTE DB ERROR: ${channels.message}`];

    for (const channel of channels) {
      messages.push(`┌──────────────── "${channel.title}" ────────────────┐`);
      const res = await processChannelLogo(
        channel.title,
        channel.sat_slug,
        channel.is_radio === 0 ? false : true,
        browser,
        isCron
      ); // Pass browser instance
      messages.push(...res);
      messages.push(`└──────────── "${channel.sat_slug}" ──────────────┘`);

      await sleep(2000);
    }
  } catch (error) {
    messages.push(`PROCESS ERROR: ${error.message}`);
  } finally {
    if (browser) {
      try {
        await browser.close();
      } catch (closeError) {
        messages.push(`ERROR: closing browser. Message: ${closeError.message}`);
      }
    }
    if (isProductionMode) {
      const killRes = killChromeProcesses();
      messages.push(...killRes);
    }
  }

  return messages;
};

const sendReportMail = async (messages, quantity) => {
  const printMessages = messages.length
    ? `<p style="color: blue; font-size: 20px; padding: 10px 0">Messages:</p><ul style="padding-bottom: 10px">${messages.map((msg) => `<li>${msg}</li>`).join('')}</ul>`
    : '';

  await sendMail({
    title: 'Parse Logo from Lyngsat',
    subject: `Parse Logo from Lyngsat`,
    body: `
    <p style="font-size: 20px;">Load and save
      <span style="color: green;"> ${quantity}</span>
      Logos from Lyngsat
    </p>
    <hr />
    
      ${printMessages}
    `,
  });
};

export const getLyngsatLogos = async (quantity, isCron = false) => {
  const messages = await getChannelsLogo(quantity, isCron);

  // await sendReportMail(messages, quantity);

  return messages;
};
