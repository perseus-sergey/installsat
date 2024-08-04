import { Browser } from 'puppeteer';
import { execSync } from 'child_process';
import { poolExecute } from '@/libs/db/mysqldb';
import { EDBTableTitles } from '@/models/ui.model';

export const getContentFromPuppeteerBrowser = async (
  browser: Browser,
  url: string
) => {
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'domcontentloaded' });

  const content = await page.content();
  await page.close();

  return content;
};

export const killChromeProcesses = () => {
  try {
    execSync('pkill -f chrome');

    return null;
  } catch (error) {
    return error;
  }
};

export const clearTable = async (tableName: EDBTableTitles) => {
  const res = await poolExecute(`TRUNCATE TABLE ${tableName}`);
  if (res instanceof Error)
    throw new Error(`DB TRUNCATE table ${tableName}: ${res.message}`);

  return `SUCCESS: Table ${tableName} cleared`;
};
