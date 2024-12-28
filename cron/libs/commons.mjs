import { DateTime } from 'luxon';
import memoize from 'lodash.memoize';
import { execSync } from 'child_process';

export const DEFAULT_ARTICLE_LOGO_NAME = 'zastavka.jpg';
export const DB_ARRAY_SEPARATOR = ' | ';

export const WRONG_CAT_IDS = '(2,0,11,12,13)';

export const ELanguage = {
  UA: 'ua',
  EN: 'en',
  RU: 'ru',
  ES: 'es',
  AR: 'ar',
  DE: 'de',
  FR: 'fr',
  IT: 'it',
};

const { UA, EN, RU, ES, AR, DE, FR, IT } = ELanguage;

export const langSuffixUaEmpty = {
  [UA]: '',
  [EN]: '_en',
  [RU]: '_ru',
  [ES]: '_es',
  [AR]: '_ar',
  [DE]: '_de',
  [FR]: '_fr',
  [IT]: '_it',
};

export const langSuffix = { ...langSuffixUaEmpty, [UA]: '_ua' };

export const EUrlBaseParam = {
  BASE_PATH: '/',
  LANG: 'lang',
  DATE: 'date',
  URL_DATE: 'url_date',
  SLUG: 'slug',
  SATELLITE: 'sat',
  ARTICLE_PARAM: 'article',
  CATEGORY: 'cat',
  TRANSPONDER_NEWS: 'transponderni-novyny',
  PACKAGE_CHANNEL_LIST: 'spysok-kanaliv-paketu',
  SAT_CHANNEL_LIST: 'spysok-kanaliv-suputnyka',
  INSTALLATION_OPTIONS: 'varianty-vstanovlennia-anten',
  ARTICLE: 'stattia',
  SAT_COVERAGE_MAP: 'karty-pokryttia-suputnykiv',
  SAT_FINDER: 'satellite-finder',
  NEWS_AND_ARTICLES: 'novyny-ta-statti',
  CHANNEL_PARAMS: 'parametry-kanalu',
  KANAL: 'kanal',
  ONLINE_CHANNEL_LIST: 'telekanaly-onlain',
  CHANNELS_TV_PROGRAM: 'programa-telekanaliv',
  PRODUCT: 'tovar',
  PRODUCT_LIST: 'spysok-tovariv',
  PRODUCT_CATEGORIES: 'kategoriji-tovariv',
  DELETE_COMMENT_SUBSCRIPTION: 'delete-subscription',
  SIGN_IN: 'login',
  SIGN_UP: 'login/sign-up',
};

export const EDBTableTitles = {
  ARTICLE: 'tbl_useful',
  ARTICLE_CATEGORIES: 'tbl_categories',
  TRANS_NEWS: 'tbl_digest',
  CHANNELS: 'tbl_channals',
  CHANNEL_SAT: 'tbl_chan_sat',
  CHANNEL_CATEGORY: 'tbl_chan_categ',
  COMMENTS_ARTICLE: 'tbl_comments',
  COMMENTS_CHANNEL: 'tbl_comments_chan',
  COMMENTS_CHAT: 'tbl_comments_chat',
  COMMENTS_INSTALLATION: 'tbl_comments_instal',
  COMMENTS_MAPS: 'tbl_comments_maps',
  COMMENTS_ONLINE: 'tbl_comments_online',
  COMMENTS_PACKAGES: 'tbl_comments_packs',
  COMMENTS_SATELLITE: 'tbl_comments_sat',
  COMMENTS_GENRE: 'tbl_comments_tema',
  TV_SCHEDULE_VIPIKO: 'tv_shedule_vipiko',
  VIPIKO_CHANNELS: 'vipiko_chan',
  TV_SCHEDULE_VSE_TV: 'tv_shedule_vsetv',
  TV_SCHEDULE: 'tv_shedule',
  FLY_SATELLITES: 'fly_satellites',
  FLY_CHANNELS: 'fly_channels',
};

export const EUrlAdminParam = {
  BASE_PATH: 'guru',
  EDIT_COMMENT: 'edit-comments',
  ARTICLES_EDIT: 'articles',
  CHANNELS_EDIT: 'channels',
  PARSE: 'parse',
  PARSE_SCHEDULE_VSETV: 'vsetv',
  PARSE_FLY_SATELLITES: 'fly-satellites',
  PARSE_SAT_DIGEST: 'trans-news',
};

export const EUrlSearchParam = {
  ARTICLE: 'q',
  SAT: 'sat',
  CHANNEL: 'channel',
  INTERVAL: 'interval',
  PAGE: 'page',
  DATE: 'date',
  CHANNEL_FORMAT_T2MI: 't2-mi',
  CHANNEL_FORMAT_MPG4: 'mpeg4',
  LATITUDE: 'lat',
  LONGITUDE: 'lng',
  COMMENT_ID: 'comm-id',
  COMMENT_DEL_DB_TABLE: 't',
  COMMENT_DEL_ARTICLE_ID: 'i',
  COMMENT_DEL_ARTICLE_NAME: 'n',
  COMMENT_DEL_AUTHOR_EMAIL: 'm',
};

export const validSearchParam = (paramName, searchParams) =>
  searchParams &&
  searchParams[paramName] &&
  typeof searchParams[paramName] === 'string'
    ? decodeURIComponent(searchParams[paramName])
    : '';

export const getDbTableLink = (tblName) =>
  `https://installsat.tv/tvefir/index.php?route=/sql&pos=0&db=installsat&table=${tblName}`;

export const getFormattedDate = memoize((date, format) =>
  DateTime.fromJSDate(date).toFormat(format)
);

export const makeUrlSearchParams = (searchParams) => {
  const params = new URLSearchParams();
  Object.entries(searchParams).forEach(([key, value]) => {
    if (value !== undefined) {
      if (Array.isArray(value)) {
        value.forEach((v) => params.append(key, v));
      } else {
        params.set(key, value);
      }
    }
  });

  return params;
};

export const createURLWithParams = (baseURL, searchParams = undefined) => {
  if (!searchParams) return baseURL;

  const url = new URL(baseURL);
  const params = makeUrlSearchParams(searchParams);
  url.search = params.toString();

  return url;
};

export const getContentFromPuppeteerBrowser = async (browser, url) => {
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'domcontentloaded' });

  const content = await page.content();
  await page.close();

  return content;
};

export const killChromeProcesses = (isProduction = true) => {
  const messages = [];
  const chromeProcessPath = isProduction ? 'chrome' : 'puppeteer/chrome';

  const command = isProduction
    ? `pkill -f "chrome"` // Target headless Chrome specifically in production
    : `pgrep -f "puppeteer/chrome" | xargs -r kill -9`; // Force kill processes on non-production

  try {
    execSync(command, { stdio: 'pipe' }); // Виконуємо команду
    messages.push(
      `SUCCESS: Chrome processes (matching "${chromeProcessPath}") killed successfully.`
    );
  } catch (error) {
    // Перевіряємо, чи error є об'єктом і чи має поле 'code'
    if (typeof error === 'object' && error !== null && 'code' in error) {
      if (error.code === 1) {
        // pgrep повертає код 1, якщо жоден процес не знайдено
        messages.push('ERROR: No Chrome processes found.');
      } else {
        messages.push(
          `ERROR: killing chrome processes: ${error instanceof Error ? error.message : new Error('Unknown error.')}`
        );
      }
    } else {
      messages.push(
        `Unexpected error: ${error instanceof Error ? error.message : new Error('Unknown error.')}`
      );
    }
  }

  return messages;
};

export const sleep = (ms = 1000) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const cutBigText = (text, cutLength = 230) => {
  if (!text) return '';

  let trimmedText = text.trim();

  if (trimmedText.length <= cutLength) return trimmedText;

  trimmedText = text.slice(0, cutLength);
  const lastSpaceIndex = trimmedText.lastIndexOf(' ');

  return lastSpaceIndex !== -1
    ? trimmedText.slice(0, lastSpaceIndex)
    : trimmedText;
};
