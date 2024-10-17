import { poolExecute } from '@/libs/db/mysqldb';
import { getFormattedDateStrYearFirst } from '@/libs/utils/dates';
import { getStartOfWeekDate } from '@/libs/utils/scheduleDates';
import { WRONG_CAT_IDS } from '@/models/articles/articleList.model';
import { EDBTableTitles } from '@/models/dbTblNames.model';

const {
  ARTICLE: TBL_ARTICLE,
  FLY_CHANNELS,
  FLY_SATELLITES,
  ARTICLE_CATEGORIES,
  CHANNELS,
  TRANS_NEWS,
} = EDBTableTitles;

export const getNewsForSiteMap = async () => {
  const sql = `SELECT cpu FROM ${TBL_ARTICLE} WHERE cat NOT IN ${WRONG_CAT_IDS}`;
  const res = await poolExecute<{ cpu: string }[]>(sql);

  return res instanceof Error ? [] : res;
};

export const getArticleCatListSiteMap = async () => {
  const sql = `SELECT cpu FROM ${ARTICLE_CATEGORIES} WHERE id NOT IN ${WRONG_CAT_IDS}`;

  const res = await poolExecute<{ cpu: string }[]>(sql);

  return res instanceof Error ? [] : res;
};

export const getChannelsSiteMap = async () => {
  const sql = `SELECT cpu FROM ${CHANNELS} WHERE compress != ?`;

  const res = await poolExecute<{ cpu: string }[]>(sql, [5]);

  return res instanceof Error ? [] : res;
};

export const getFlyChannelsMap = async () => {
  const sql = `SELECT slug AS cpu FROM ${FLY_CHANNELS} WHERE is_removed != ?`;

  const res = await poolExecute<{ cpu: string }[]>(sql, [1]);

  return res instanceof Error ? [] : res;
};

export const getPackagesSiteMap = async () => {
  const sql = `SELECT cpu FROM tbl_chan_categ WHERE parent = 0 AND id NOT IN (2,23,25)`;

  const res = await poolExecute<{ cpu: string }[]>(sql);

  return res instanceof Error ? [] : res;
};

export const getSatellitesSiteMap = async () => {
  const sql = `SELECT slug AS cpu FROM ${FLY_SATELLITES}`;

  const res = await poolExecute<{ cpu: string }[]>(sql);

  return res instanceof Error ? [] : res;
};

export const getChannelsWithSchedule = async () => {
  const sql = `
  SELECT cpu FROM ${CHANNELS}
  WHERE tema != 15 
  AND ((vipiko != '' AND vipiko != 0) OR (vsetv != '' AND vsetv != 0))
  `;

  const res = await poolExecute<{ cpu: string }[]>(sql);

  return res instanceof Error ? [] : res;
};

export const getChannelsWithScheduleAndWeekDays = async () => {
  const res = await getChannelsWithSchedule();

  const startWeekDate = getStartOfWeekDate(new Date());

  return [...Array(7)]
    .map((_, index) => {
      const date = new Date(startWeekDate);
      date.setDate(date.getDate() + index);
      const dateStr = getFormattedDateStrYearFirst(date);

      return res.map((channel) => ({ cpu: `${channel.cpu}/${dateStr}` }));
    })
    .flat();
};

export const getOnlineChanSiteMap = async () => {
  const sql = `
  SELECT cpu FROM ${CHANNELS} 
  WHERE (compress = 5 AND tema != 15) OR (compress != 5 AND tema != 15 AND tvforsite_net != '' AND cat != 23)
  `;

  const res = await poolExecute<{ cpu: string }[]>(sql);

  return res instanceof Error ? [] : res;
};

export const getTransNewsSiteMap = async () => {
  const sql = `SELECT date FROM ${TRANS_NEWS} WHERE date >= CURDATE() - INTERVAL 180 DAY GROUP BY date;`;

  const res = await poolExecute<{ date: string }[]>(sql);

  return res instanceof Error
    ? []
    : res.map((r) => ({
        cpu: getFormattedDateStrYearFirst(r.date),
      }));
};
