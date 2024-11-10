import puppeteer from 'puppeteer';
import * as cheerio from 'cheerio';
import { promises as fs } from 'fs';
import path from 'path';

import { Title } from '@/components/ui/Titles/Title';
import { EUrlSearchParam, TSearchParams } from '@/models/url/urlSearch.model';
import { validSearchParam } from '@/libs/utils/validSearchParam';
import { poolExecute } from '@/libs/db/mysqldb';
import { sendMail } from '@/libs/mail/sendMail';
import { ELanguage } from '@/models/language.model';
import { EUrlAdminParam } from '@/models/url/urlAdmin.model';
import { EDBTableTitles, getDbTableLink } from '@/models/dbTblNames.model';
import { ResultSetHeader } from 'mysql2';
import { sleep } from '@/libs/utils/sleep';

export const dynamic = 'force-dynamic';

// =================================================================
// з моєі бд дістаю канал у якого поле logo is null
// скрипт шукає логотип цього каналу на сайті lyngsat.com. На lyngsat.com існує тільки система пошуку від google search
// логотип завантажується в папку на моєму сайті в папку Images
// в мою бд для каналів з такою ж назвою як і поточний записується назва цього логотипу наприклад ('channel1-logo.png')
// =================================================================

const { FLY_CHANNELS } = EDBTableTitles;

const BASE_URL = process.env.BASE_URL;

const imageDir = path.join(process.cwd(), 'public', 'Images', 'channel_logo');

const getChannelsWithoutLogo = async (limit: string) => {
  const sql = `
      SELECT title, MAX(sat_slug) as sat_slug
      FROM ${FLY_CHANNELS} 
      WHERE logo IS NULL AND LENGTH(title) > 1
      GROUP BY title
      LIMIT ?
    `;
  const res = await poolExecute<{ title: string; sat_slug: string }[]>(sql, [
    limit,
  ]);

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
  const res = await poolExecute<{ logo: string }[]>(sql, [
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
  const res = await poolExecute<ResultSetHeader>(sql, [logo, channelName]);

  if (res instanceof Error) throw res;
  if (res.affectedRows === 0)
    throw new Error(
      `ERROR DB UPDATE: Affected rows = ${res.affectedRows}. For SQL: "${sql}"`
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

const removeTimeFromChannelName = (channelName: string): string =>
  channelName.replace(/\s*\(\+\d+h\)/gi, '');

const normalizeChannelName = (channelName: string): string =>
  removeTimeFromChannelName(channelName).replace(/\s/g, '').toLowerCase();

// ========================= PROCESS ===================================

async function processChannelLogo(channelName: string, satName: string) {
  const messages = [];
  let browser;
  const normalizedChannelName = normalizeChannelName(channelName);

  try {
    const existingDbLogo = await getDbExistingLogo(normalizedChannelName);

    if (existingDbLogo) {
      await updateLogoInDB(channelName, existingDbLogo);

      return [
        `SUCCESS: Using existing logo for "${channelName}": ${existingDbLogo}`,
      ];
    }

    browser = await puppeteer.launch();
    const page = await browser.newPage();
    const searchUrl = `https://www.google.com/search?q=site:lyngsat.com/tvchannels+${encodeURIComponent(removeTimeFromChannelName(channelName))}+${satName}`;
    await page.goto(searchUrl);

    messages.push(searchUrl);

    const content = await page.content();
    const $ = cheerio.load(content);
    const lyngsatLink = $('a[href^="https://www.lyngsat.com/"]')
      .first()
      .attr('href');

    if (!lyngsatLink) return [`LyngSat link not found for: ${searchUrl}`];

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
    messages.push(`ERROR: ${(error as Error).message}`);

    return messages;
  } finally {
    if (browser) await browser.close();
  }

  return messages;
}

const getChannelsLogo = async (batchSize: string) => {
  const messages = [];

  const channels = await getChannelsWithoutLogo(batchSize);

  if (channels instanceof Error) return [`ERROR: ${channels.message}`];

  for (const channel of channels) {
    messages.push(`┌──────────────── "${channel.title}" ────────────────┐`);
    const res = await processChannelLogo(channel.title, channel.sat_slug);
    messages.push(...res);
    messages.push(`└──────────── "${channel.sat_slug}" ──────────────┘`);

    sleep(500);
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

export default async function Page({
  searchParams,
}: {
  searchParams?: TSearchParams;
}) {
  const quantity = validSearchParam(EUrlSearchParam.INTERVAL, searchParams);

  const messages = await getChannelsLogo(quantity);

  await sendReportMail(messages, quantity);

  return (
    <>
      <Title>{`Load and save ${quantity} logos from LyngSat`}</Title>

      <h2 className="font-bold text-blue-700 text-xl">Messages:</h2>
      <ul>
        {messages.map((message, i) => (
          <li key={i}>{message}</li>
        ))}
      </ul>
    </>
  );
}
