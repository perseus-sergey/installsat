import { poolExecute } from '@/libs/db/mysqldb';
import {
  IAllMapsModel,
  IAllNewsModel,
  IArticleModel,
  IMapModel,
  ISimilarArticleModel,
  ISingleCatArticlesModel,
} from '@/models/articles.model';
import { EDBTableTitles, ELanguage } from '@/models/ui.model';
import { decode } from 'html-entities';
import { cache } from 'react';

export const WRONG_CAT_IDS = '(2,0,11,12,13)';
const { ARTICLE: TBL_ARTICLE, ARTICLE_CATEGORIES } = EDBTableTitles;

export const getArticleCatList = async () => {
  const sql = `SELECT id, title, cpu, description, text, title_en, description_en, text_en FROM ${ARTICLE_CATEGORIES} WHERE id NOT IN ${WRONG_CAT_IDS}`;

  const res = await poolExecute<ISingleCatArticlesModel[]>(sql);

  return res instanceof Error ? [] : res;
};

export const getArtCatListSideBar = async (lang: ELanguage) => {
  const sql = `
  SELECT
    ${lang === ELanguage.UA ? 'title' : 'title_en'} AS title,
    cpu
  FROM ${ARTICLE_CATEGORIES} 
  WHERE id NOT IN ${WRONG_CAT_IDS}
  `;

  const res = await poolExecute<{ title: string; cpu: string }[]>(sql);

  return res instanceof Error ? [] : res;
};

export const getCurrentCatParams = cache(
  async (catCpu: string): Promise<ISingleCatArticlesModel> => {
    const allCatResponse = await getArticleCatList();
    const catParams =
      allCatResponse instanceof Error
        ? ''
        : allCatResponse.find((cat) => cat.cpu === catCpu);

    return (
      catParams || {
        title: '',
        description: '',
        title_en: '',
        description_en: '',
        id: -1,
        cpu: '',
        text: '',
        text_en: '',
      }
    );
  }
);

interface IChankOfNews {
  quantity: number;
  start?: number;
  catId?: number;
  searchQuery?: string;
  lang: ELanguage;
}

export const getChunkOfNews = async ({
  quantity,
  start = 0,
  catId,
  searchQuery,
  lang,
}: IChankOfNews) => {
  const catValue = catId ? `=${catId}` : `NOT IN ${WRONG_CAT_IDS}`;

  const getSearchText = (alias = 'U.') => {
    const uaStr = `${alias}title LIKE "%${searchQuery}%" OR ${alias}description LIKE "%${searchQuery}%"`;

    return searchQuery
      ? lang === ELanguage.UA
        ? `AND (${uaStr})`
        : `AND (${alias}title_en LIKE "%${searchQuery}%" OR ${alias}description_en LIKE "%${searchQuery}%" OR ${uaStr})`
      : '';
  };
  // const searchText = searchQuery ? `LIKE "%${searchQuery}%"` : '!= ""';

  const sql = `
  SELECT 
  U.id,
  U.cat,
  U.title,
  U.cpu,
  U.description,
  U.title_en,
  U.description_en,
  U.date,
  U.author,
  U.logo,
  U.view,
  C.comment_count,
  T.total_count,
  C2.title AS category_title,
  C2.title_en AS category_title_en,
  C2.cpu AS category_cpu
FROM ${TBL_ARTICLE} U
LEFT JOIN (SELECT post, COUNT(id) AS comment_count FROM tbl_comments GROUP BY post) C ON U.id = C.post
LEFT JOIN ${ARTICLE_CATEGORIES} C2 ON U.cat = C2.id
CROSS JOIN
  (SELECT COUNT(id) AS total_count FROM ${TBL_ARTICLE} WHERE cat ${catValue} ${getSearchText('')}) T
WHERE 
  U.cat ${catValue}
${getSearchText()}
ORDER BY 
  U.date DESC, U.id DESC
LIMIT ?, ?
`;
  const res = await poolExecute<IAllNewsModel[]>(sql, [
    `${start}`,
    `${quantity}`,
  ]);

  return res instanceof Error
    ? []
    : res.map((r) => ({
        ...r,
        title: decode(r.title),
        title_en: decode(r.title_en),
      }));
};

export const satMapListSql = `
  SELECT 
    MAX(b.id) AS beam_id,
    s.id,
    s.title,
    s.description,
    s.cpu,
    s.logo,
    s.view,
    s.position,
    MAX(C.comment_count) AS comment_count
  FROM tbl_chan_beam AS b
  LEFT JOIN tbl_chan_sat AS s ON b.sat = s.id
  LEFT JOIN (
      SELECT post, COUNT(id) AS comment_count 
      FROM tbl_comments_maps 
      GROUP BY post
  ) AS C ON s.id = C.post
  WHERE b.map_img != ''
  GROUP BY s.id, s.title, s.description, s.cpu, s.logo, s.view, s.position, s.grade
  ORDER BY s.grade;
`;

export const getSatMapList = cache(async () => {
  const res = await poolExecute<IAllMapsModel[]>(satMapListSql);

  return res instanceof Error
    ? []
    : res.map((r) => ({
        ...r,
        title: decode(r.title),
        description: decode(r.description),
        position: decode(r.position),
      }));
});

export const getSatMap = cache(async (slug: string) => {
  const sql = `
  SELECT s.id AS sat_id, s.title AS sat_title, s.position, s.view, s.logo, s.grade,
        b.title AS beam_title, b.description AS beam_description, b.cpu AS beam_slug, b.map_img
  FROM tbl_chan_sat AS s
  JOIN tbl_chan_beam AS b ON s.id = b.sat
  WHERE s.cpu = ?
  AND b.map_img != ''
`;
  const res = await poolExecute<IMapModel[]>(sql, [slug]);

  return res instanceof Error
    ? []
    : res.map((r) => ({
        ...r,
        sat_title: decode(r.sat_title),
        position: decode(r.position),
        beam_title: decode(r.beam_title),
        beam_description: decode(r.beam_description),
      }));
});

export const getArticle = cache(
  async (slug: string): Promise<IArticleModel | null> => {
    const sql = `
  SELECT
  U.id,
  U.title,
  U.cpu AS slug,
  U.date,
  U.description,
  U.text,
  U.author,
  U.cat AS cat_id,
  U.view,
  U.logo,
  U.title_en,
  U.description_en,
  U.keywords,
  U.keywords_en,
  U.text_en,
  C.title AS cat_name,
  C.title_en AS cat_name_en,
  C.cpu AS cat_slug,
  C.folder AS cat_folder
FROM
  ${TBL_ARTICLE} U
LEFT JOIN
  ${ARTICLE_CATEGORIES} C ON U.cat = C.id
WHERE U.cpu = ?
LIMIT 1
`;
    const res = await poolExecute<IArticleModel[]>(sql, [slug]);

    return res instanceof Error || res.length === 0
      ? null
      : {
          ...res[0],
          title: decode(res[0].title),
          title_en: decode(res[0].title_en),
          description: decode(res[0].description),
          description_en: decode(res[0].description_en),
        };
  }
);

export const getSatFinderArticle = cache(async () => {
  const sql = `
  SELECT 
    id,
    title,
    cpu,
    description,
    text,
    view,
    title_en,
    description_en,
    keywords,
    keywords_en,
    text_en,
    logo 
  FROM ${TBL_ARTICLE} WHERE cpu = ?`;

  return await poolExecute<IArticleModel[]>(sql, [
    'napravlenie-antenny-po-karte',
  ]);
});

export const getSimilarArticles = async (logo: string, id = -1) => {
  const removeId = id > -1 ? `AND id != ${id}` : '';

  const sql = `
    SELECT id, title, title_en, cpu, date
    FROM ${TBL_ARTICLE}
    WHERE logo = ?
    ${removeId}
    AND cat NOT IN ${WRONG_CAT_IDS}
    ORDER BY date DESC, id DESC
    LIMIT 7
`;

  const res = await poolExecute<ISimilarArticleModel[]>(sql, [logo]);

  return res instanceof Error
    ? []
    : res.map((r) => ({
        ...r,
        title: decode(r.title),
        title_en: decode(r.title_en),
      }));
};

// export const getArticleSlugList = cache(async () => {
//   const sql = `SELECT cpu FROM ${TBL_ARTICLE}`;

//   return await poolExecute<{ cpu: string }>(sql);
// });

export const updateViewCount = async (
  dbTableTitle: string,
  articleId: string,
  oldViewNumber: number
) =>
  await poolExecute(`UPDATE ${dbTableTitle} SET view = ? WHERE id = ?`, [
    `${oldViewNumber + 1}`,
    articleId,
  ]);
