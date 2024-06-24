import { poolExecute } from '@/libs/db/mysqldb';
import { TChannelCatsModel } from '@/models/tblChannelCateg.model';
import { TSatModel } from '@/models/tblSat.model';
import { NUMBER_OF_LAST_NEWS_WIDGET } from '@/models/widget.model';
import { cache } from 'react';
import { WRONG_CAT_IDS, satMapListSql } from './articles.controller';
import { IAllMapsModel, IAllNewsModel } from '@/models/articles.model';

export const getSatMapList = async () => {
  const res = await poolExecute<IAllMapsModel[]>(satMapListSql);

  return res instanceof Error ? [] : res;
};

export const getChannelCatList = cache(
  async () =>
    await poolExecute<TChannelCatsModel[]>(
      `SELECT title, id, parent, cpu FROM tbl_chan_categ WHERE parent=0 AND title != '' AND id NOT IN (2,23,25) ORDER BY title`
    )
);

export const getChannelSatList = cache(
  async (isFilling = true) =>
    await poolExecute<TSatModel[]>(`
  SELECT title,position,id,cpu,logo
  FROM tbl_chan_sat
  WHERE id != 1 
  ${isFilling ? 'AND fill = 1' : ''}
  ORDER BY grade
  `)
);

export const getLastNewsWidgetList = async () =>
  await poolExecute<IAllNewsModel[]>(`
    SELECT id, title, cpu FROM tbl_useful WHERE cat NOT IN ${WRONG_CAT_IDS} ORDER BY date DESC, id DESC LIMIT ${NUMBER_OF_LAST_NEWS_WIDGET}
    `);

export const getUsefulArticleList = cache(
  async () =>
    await poolExecute<IAllNewsModel[]>(`
  SELECT title, id, cpu FROM tbl_useful WHERE cat=4 OR cat=5
  `)
);
