import { Browser } from 'puppeteer';
import { poolExecute } from '@/libs/db/mysqldb';
import { EDBTableTitles } from '@/models/dbTblNames.model';
import { sleep } from '@/libs/utils/sleep';

export const getContentFromPuppeteerBrowser = async (
  browser: Browser,
  url: string
) => {
  let page;

  try {
    page = await browser.newPage();

    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36'
    );

    await page.goto(url, { waitUntil: 'domcontentloaded' });

    await sleep();

    const content = await page.content();

    return content;
  } catch (error) {
    throw error;
  } finally {
    if (page) await page.close();
  }
};

export const clearTable = async (tableName: EDBTableTitles) => {
  const res = await poolExecute(`TRUNCATE TABLE ${tableName}`);
  if (res instanceof Error)
    throw new Error(`DB TRUNCATE table ${tableName}: ${res.message}`);

  return `SUCCESS: Table ${tableName} cleared`;
};
