import { executeQuery } from '@/libs/db/mysqldb';
import { TChannelCatsModel } from '@/models/tblChannelCateg.model';
import { TInstallationsModel } from '@/models/tblInstallations.model';
import { TSatModel } from '@/models/tblSat.model';
import { NUMBER_OF_LAST_NEWS_WIDGET } from '@/models/widget.model';
import { cache } from 'react';
import { WRONG_CAT_IDS } from './articles.controller';
import { TCategories } from '@/models/tblCategories.model';
import { IAllNewsModel } from '@/models/articles.model';

export const getInstallationsList = cache(
  async () =>
    await executeQuery<TInstallationsModel>(`
  SELECT title, cpu, id FROM tbl_installations WHERE id NOT IN (8,9)
  `)
);

export const getChannelCatList = cache(
  async () =>
    await executeQuery<TChannelCatsModel>(
      `SELECT title, id, parent, cpu FROM tbl_chan_categ WHERE parent=0 AND title != '' AND id NOT IN (2,4,23,25) ORDER BY title`
    )
);

export const getArticleCatWidgetList = async () =>
  await executeQuery<TCategories>(`
    SELECT id,title, cpu FROM tbl_categories WHERE id != 2 AND id!=12 AND title!=''
    `);

export const getChannelSatList = cache(
  async (isFilling = true) =>
    await executeQuery<TSatModel>(`
  SELECT title,position,id,cpu,logo
  FROM tbl_chan_sat
  WHERE id != 1 
  ${isFilling ? 'AND fill = 1' : ''}
  ORDER BY grade
  `)
);

export const getLastNewsWidgetList = async () =>
  await executeQuery<IAllNewsModel>(`
    SELECT id, title, cpu FROM tbl_useful WHERE cat NOT IN ${WRONG_CAT_IDS} ORDER BY date DESC, id DESC LIMIT ${NUMBER_OF_LAST_NEWS_WIDGET}
    `);

export const getUsefulArticleList = cache(
  async () =>
    await executeQuery<IAllNewsModel>(`
  SELECT title, id, cpu FROM tbl_useful WHERE cat=4 OR cat=5
  `)
);
