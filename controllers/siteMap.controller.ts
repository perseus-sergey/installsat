import { poolExecute } from '@/libs/db/mysqldb';
import { WRONG_CAT_IDS } from './articles.controller';
import { getFormattedDateStrYearFirst } from '@/libs/utils/dates';
import { EDBTableTitles } from '@/models/ui.model';

const { ARTICLE: TBL_ARTICLE, FLY_CHANNELS, FLY_SATELLITES } = EDBTableTitles;

export const getNewsForSiteMap = async () => {
  const sql = `SELECT cpu FROM ${TBL_ARTICLE} WHERE cat NOT IN ${WRONG_CAT_IDS}`;
  const res = await poolExecute<{ cpu: string }[]>(sql);

  return res instanceof Error ? [] : res;
};

export const getArticleCatListSiteMap = async () => {
  const sql = `SELECT cpu FROM tbl_categories WHERE id NOT IN ${WRONG_CAT_IDS}`;

  const res = await poolExecute<{ cpu: string }[]>(sql);

  return res instanceof Error ? [] : res;
};

export const getChannelsSiteMap = async () => {
  const sql = `SELECT cpu FROM tbl_channals WHERE compress != 5`;

  const res = await poolExecute<{ cpu: string }[]>(sql);

  return res instanceof Error ? [] : res;
};

export const getFlyChannelsMap = async () => {
  const sql = `SELECT slug AS cpu FROM ${FLY_CHANNELS} WHERE is_removed != 1`;

  const res = await poolExecute<{ cpu: string }[]>(sql);

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

export const getSchedulesSiteMap = async () => {
  const sql = `
  SELECT cpu FROM tbl_channals
  WHERE tema != 15 
  AND ((vipiko != '' AND vipiko != 0) OR (vsetv != '' AND vsetv != 0))
  `;

  const res = await poolExecute<{ cpu: string }[]>(sql);

  return res instanceof Error ? [] : res;
};

export const getOnlineChanSiteMap = async () => {
  const sql = `
  SELECT cpu FROM tbl_channals 
  WHERE (compress = 5 AND tema != 15) OR (compress != 5 AND tema != 15 AND tvforsite_net != '' AND cat != 23)
  `;

  const res = await poolExecute<{ cpu: string }[]>(sql);

  return res instanceof Error ? [] : res;
};

export const getTransNewsSiteMap = async () => {
  const sql = `SELECT date FROM tbl_digest WHERE date >= CURDATE() - INTERVAL 180 DAY GROUP BY date;`;

  const res = await poolExecute<{ date: string }[]>(sql);

  return res instanceof Error
    ? []
    : res.map((r) => ({
        cpu: getFormattedDateStrYearFirst(r.date),
      }));
};
