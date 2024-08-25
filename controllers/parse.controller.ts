import { Browser, Page } from 'puppeteer';
import { poolExecute } from '@/libs/db/mysqldb';
import { EDBTableTitles } from '@/models/ui.model';

export const getContentFromPuppeteerBrowser = async (
  browser: Browser,
  url: string
) => {
  const page = await browser.newPage();

  const content = await getContentFromPuppeteerPage(page, url);

  return content;
};

export const getContentFromPuppeteerPage = async (
  puppeteerPage: Page,
  url: string
) => {
  await puppeteerPage.goto(url, { waitUntil: 'domcontentloaded' });

  const content = await puppeteerPage.content();
  await puppeteerPage.close();

  return content;
};

// export const killChromeProcesses = () => {
//   try {
//     execSync('pkill -f chrome');

//     return null;
//   } catch (error) {
//     return error;
//   }
// };

export const clearTable = async (tableName: EDBTableTitles) => {
  const res = await poolExecute(`TRUNCATE TABLE ${tableName}`);
  if (res instanceof Error)
    throw new Error(`DB TRUNCATE table ${tableName}: ${res.message}`);

  return `SUCCESS: Table ${tableName} cleared`;
};
