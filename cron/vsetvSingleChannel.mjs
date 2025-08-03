import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import fs from 'fs';
import path from 'path';

// Підключаємо плагін приховування слідів Puppeteer
puppeteer.use(StealthPlugin());

// Введи ID каналу для тесту тут:
const TEST_CHANNEL_ID = 1014; // Наприклад: «1-HD»

// Функція генерації URL для каналу

const getParseURL = (vsetvId) =>
  `http://www.vsetv.com/schedule_channel_${vsetvId}_week.html`;

const run = async () => {
  const browser = await puppeteer.launch({
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
    ],
  });

  const page = await browser.newPage();

  try {
    const url = getParseURL(TEST_CHANNEL_ID);
    console.log(`➡️ Opening URL: ${url}`);

    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
    );

    const response = await page.goto(url, {
      waitUntil: 'domcontentloaded',
      timeout: 20000,
    });

    if (!response) {
      console.error('❌ No response received from the page.');
    } else {
      const status = response.status();
      console.log(`📡 Response status: ${status}`);
      if (status >= 400) {
        console.warn(`⚠️ HTTP error ${status} on ${url}`);
      }
    }

    // Створюємо скріншот
    const screenshotPath = path.resolve(
      'screenshots',
      `channel-${TEST_CHANNEL_ID}.png`
    );

    fs.mkdirSync('screenshots', { recursive: true });

    await page.screenshot({ path: screenshotPath, fullPage: true });
    console.log(`🖼 Screenshot saved to: ${screenshotPath}`);

    // Додатково можна зберегти HTML
    const htmlContent = await page.content();
    fs.writeFileSync(
      path.resolve('screenshots', `channel-${TEST_CHANNEL_ID}.html`),
      htmlContent
    );
    console.log(`📄 HTML saved`);
  } catch (err) {
    console.error(
      `💥 Error occurred while parsing channel ${TEST_CHANNEL_ID}:`,
      err
    );
  } finally {
    await browser.close();
    console.log('🛑 Browser closed');
  }
};

run();

// =======================================================
// Для запуску з консолі: node cron/vsetvSingleChannel.mjs
// =======================================================
