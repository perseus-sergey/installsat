import { cache } from 'react';

import { poolExecute } from '@/libs/db/mysqldb';
import { ISatModel } from '@/models/tblSat.model';
import { NUMBER_OF_LAST_NEWS_WIDGET } from '@/models/ui/widget.model';
import { EDBTableTitles } from '@/models/dbTblNames.model';
import {
  DEFAULT_LANG,
  ELanguage,
  langSuffixUaEmpty,
} from '@/models/language.model';
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

export const getArtCatListSideBar = async (lang: ELanguage) => {
  const sql = `
  SELECT
    title${langSuffixUaEmpty[lang]} AS title,
    cpu
  FROM ${ARTICLE_CATEGORIES} 
  WHERE id NOT IN ${WRONG_CAT_IDS}
  `;

  const res = await poolExecute<{ title: string; cpu: string }[]>(sql);

  return res instanceof Error ? [] : res;
};

export const getChannelCatList = cache(async (lang = DEFAULT_LANG) => {
  return await poolExecute<IChannelCatsModel[]>(
    `
      SELECT 
        title${langSuffixUaEmpty[lang]} AS title,
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
      COALESCE(title${langSuffixUaEmpty[lang]}, title_en) AS title,
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
    COALESCE(title${langSuffixUaEmpty[lang]}, title_en) AS title,
    cpu 
   FROM ${TBL_ARTICLE} 
   WHERE cat=4 OR cat=5
   ORDER BY id ASC
   LIMIT 10
  `);

export const getSatMapsSideBar = async () => {
  const sql = `
    SELECT DISTINCT s.title, s.cpu, s.position, s.grade
    FROM tbl_chan_beam AS b
    INNER JOIN tbl_chan_sat AS s ON b.sat = s.id
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
