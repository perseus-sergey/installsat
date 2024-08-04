import { poolExecute } from '@/libs/db/mysqldb';
import { TChannelCatsModel } from '@/models/tblChannelCateg.model';
import { TInstallationsModel } from '@/models/tblInstallations.model';
import { TSatModel } from '@/models/tblSat.model';
import { NUMBER_OF_LAST_NEWS_WIDGET } from '@/models/widget.model';
import { cache } from 'react';
import { WRONG_CAT_IDS } from './articles.controller';
import { IAllNewsModel } from '@/models/articles.model';
import { EDBTableTitles } from '@/models/ui.model';

const { ARTICLE: TBL_ARTICLE } = EDBTableTitles;

export const getInstallationsList = cache(
  async () =>
    await poolExecute<TInstallationsModel[]>(`
  SELECT title, cpu, id FROM tbl_installations WHERE id NOT IN (8,9)
  `)
);

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
    SELECT id, title, title_en, cpu FROM ${TBL_ARTICLE} WHERE cat NOT IN ${WRONG_CAT_IDS} ORDER BY date DESC, id DESC LIMIT ${NUMBER_OF_LAST_NEWS_WIDGET}
    `);

export const getUsefulArticleList = cache(
  async () =>
    await poolExecute<IAllNewsModel[]>(`
  SELECT title, title_en, id, cpu FROM ${TBL_ARTICLE} WHERE cat=4 OR cat=5
  `)
);
