import { cache } from 'react';

import { poolExecute } from '@/libs/db/mysqldb';
import { ISatModel } from '@/models/tblSat.model';
import { NUMBER_OF_LAST_NEWS_WIDGET } from '@/models/ui/widget.model';
import { EDBTableTitles } from '@/models/dbTblNames.model';
import { DEFAULT_LANG, ELanguage } from '@/models/language.model';
import {
  IAllNewsModel,
  WRONG_CAT_IDS,
} from '@/models/articles/articleList.model';

interface IChannelCatsModel {
  id: number;
  location: number;
  parent: number;
  view: number;
  title: string;
  cpu: string;
  text: string;
  logo: string;
  h1: string;
  description: string;
  price: number;
}

const {
  ARTICLE: TBL_ARTICLE,
  FLY_SATELLITES,
  CHANNEL_CATEGORY,
  ARTICLE_CATEGORIES,
} = EDBTableTitles;

const { UA, EN, RU, ES, AR, DE, FR, IT } = ELanguage;

const langTitle = {
  [UA]: 'title',
  [EN]: 'title_en',
  [RU]: 'title_ru',
  [ES]: 'title_es',
  [AR]: 'title_ar',
  [DE]: 'title_de',
  [FR]: 'title_fr',
  [IT]: 'title_it',
};

export const getArtCatListSideBar = async (lang: ELanguage) => {
  const sql = `
  SELECT
    ${langTitle[lang] || langTitle[EN]} AS title,
    cpu
  FROM ${ARTICLE_CATEGORIES} 
  WHERE id NOT IN ${WRONG_CAT_IDS}
  `;

  const res = await poolExecute<{ title: string; cpu: string }[]>(sql);

  return res instanceof Error ? [] : res;
};

export const getChannelCatList = cache(async (lang = DEFAULT_LANG) => {
  const titleField = lang === ELanguage.UA ? 'title' : 'title_en AS title';

  return await poolExecute<IChannelCatsModel[]>(
    `
      SELECT 
        ${titleField}, 
        id, 
        parent, 
        cpu 
      FROM ${CHANNEL_CATEGORY} 
      WHERE parent=0 
      AND title != '' 
      AND id NOT IN (2,23,25) 
      ORDER BY title
      `
  );
});

export const getFlyChannelSatList = async (isFilling = false) => {
  const res = await poolExecute<ISatModel[]>(`
  SELECT title, position, slug AS cpu
  FROM ${FLY_SATELLITES}
  WHERE all_count > 0 
  ${isFilling ? 'AND fill = 1' : ''}
  ORDER BY grade
  `);

  return res instanceof Error || res.length === 0 ? [] : res;
};

export const getLastNewsWidgetList = cache(
  async (lang: ELanguage) =>
    await poolExecute<IAllNewsModel[]>(`
    SELECT 
      id, 
      ${lang === ELanguage.UA ? 'title' : 'title_en'} AS title,
      cpu 
    FROM ${TBL_ARTICLE} 
    WHERE cat NOT IN ${WRONG_CAT_IDS} 
    ORDER BY date DESC, id DESC 
    LIMIT ${NUMBER_OF_LAST_NEWS_WIDGET}
    `)
);

export const getUsefulArticleList = async (lang: ELanguage) =>
  await poolExecute<IAllNewsModel[]>(`
  SELECT 
    id,
    ${lang === ELanguage.UA ? 'title' : 'title_en'} AS title,
    cpu 
   FROM ${TBL_ARTICLE} 
   WHERE cat=4 OR cat=5
  `);

export const getSatMapsSideBar = async () => {
  const sql = `
    SELECT DISTINCT s.title, s.cpu, s.position, s.grade
    FROM tbl_chan_beam AS b
    LEFT JOIN tbl_chan_sat AS s ON b.sat = s.id
    WHERE b.map_img != ''
    ORDER BY s.grade;
  `;
  const res =
    await poolExecute<{ title: string; cpu: string; position: string }[]>(sql);

  return res instanceof Error ? [] : res;
};

// export const getChannelSatList = cache(
//   async (isFilling = true) =>
//     await poolExecute<ISatModel[]>(`
//   SELECT title,position,id,cpu,logo
//   FROM tbl_chan_sat
//   WHERE id != 1
//   ${isFilling ? 'AND fill = 1' : ''}
//   ORDER BY grade
//   `)
// );
