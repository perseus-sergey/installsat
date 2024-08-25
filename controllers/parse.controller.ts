import { Browser, Page } from 'puppeteer';
import { execSync } from 'child_process';
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

export const killChromeProcesses = () => {
  const messates = [];

  try {
    // Перевіряємо, чи є активні процеси Chrome
    const activeChromeProcesses = execSync('pgrep -f chrome', { stdio: 'pipe' })
      .toString()
      .trim();

    if (activeChromeProcesses) {
      execSync('pkill -f chrome');
      messates.push('SUCCESS: Chrome processes killed successfully.');
    } else {
      messates.push('WARNING: No active Chrome processes to kill.');
    }
  } catch (error) {
    // Перевіряємо, чи error є об'єктом і чи має поле 'code'
    if (typeof error === 'object' && error !== null && 'code' in error) {
      if ((error as { code: number }).code === 1) {
        // pgrep повертає код 1, якщо жоден процес не знайдено
        messates.push('ERROR: No Chrome processes found.');
      } else {
        messates.push(
          `ERROR: killing chrome processes: ${error instanceof Error ? error.message : new Error('Unknown error.')}`
        );
      }
    } else {
      messates.push(
        `Unexpected error: ${error instanceof Error ? error.message : new Error('Unknown error.')}`
      );
    }
  }

  return messates;
};

export const clearTable = async (tableName: EDBTableTitles) => {
  const res = await poolExecute(`TRUNCATE TABLE ${tableName}`);
  if (res instanceof Error)
    throw new Error(`DB TRUNCATE table ${tableName}: ${res.message}`);

  return `SUCCESS: Table ${tableName} cleared`;
};
