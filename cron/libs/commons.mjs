import { DateTime } from 'luxon';
import memoize from 'lodash.memoize';
import { execSync } from 'child_process';

export const DEFAULT_ARTICLE_LOGO_NAME = 'zastavka.jpg';

export const EDBTableTitles = {
  ARTICLE: 'tbl_useful',
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

  return url.toString();
};

export const getContentFromPuppeteerBrowser = async (browser, url) => {
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
