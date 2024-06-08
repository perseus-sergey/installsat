import { executeQuery } from '@/libs/db/mysqldb';
import {
  IAllMapsModel,
  IAllNewsModel,
  IArticleModel,
  IMapModel,
  ISimilarArticleModel,
  ISingleCatArticlesModel,
} from '@/models/articles.model';
import { decode } from 'html-entities';
import { cache } from 'react';

export const WRONG_CAT_IDS = '(2,0,11,12,13)';

export const getArticleCatList = cache(async () => {
  const sql = `SELECT id, title, cpu, description, text FROM tbl_categories WHERE id NOT IN ${WRONG_CAT_IDS}`;

  return await executeQuery<ISingleCatArticlesModel>(sql);
});

export const getCurrentCatParams = cache(
  async (catCpu: string): Promise<ISingleCatArticlesModel> => {
    const allCatResponse = await getArticleCatList();
    const catParams =
      allCatResponse instanceof Error
        ? ''
        : allCatResponse.find((cat) => cat.cpu === catCpu);

    return (
      catParams || { title: '', description: '', id: -1, cpu: '', text: '' }
    );
  }
);

export const getChunkOfNews = async (
  quantity: number,
  start = 0,
  catId?: number,
  searchQuery = ''
) => {
  const catValue = catId ? `=${catId}` : `NOT IN ${WRONG_CAT_IDS}`;
  const searchText = searchQuery ? `LIKE "%${searchQuery}%"` : '!= ""';

  const sql = `
  SELECT 
  U.id,
  U.cat,
  U.title,
  U.cpu,
  U.description,
  U.date,
  U.author,
  U.logo,
  U.view,
  C.comment_count,
  T.total_count,
  C2.title AS category_title,
  C2.cpu AS category_cpu
FROM tbl_useful U
LEFT JOIN (SELECT post, COUNT(id) AS comment_count FROM tbl_comments GROUP BY post) C ON U.id = C.post
LEFT JOIN tbl_categories C2 ON U.cat = C2.id
CROSS JOIN
  (SELECT COUNT(id) AS total_count FROM tbl_useful WHERE cat ${catValue} AND (title ${searchText} OR description ${searchText})) T
WHERE 
  U.cat ${catValue}
  AND (U.title ${searchText} OR U.description ${searchText})
ORDER BY 
  U.date DESC, U.id 
LIMIT ?, ?
`;
  const res = await executeQuery<IAllNewsModel>(sql, [
    `${start}`,
    `${quantity}`,
  ]);

  return res instanceof Error
    ? []
    : res.map((r) => ({ ...r, title: decode(r.title) }));
};

export const getSatMapList = cache(async () => {
  const sql = `
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
  FROM (
      SELECT * 
      FROM tbl_chan_beam
      WHERE map_img != ''
  ) AS b
  LEFT JOIN tbl_chan_sat AS s ON b.sat = s.id
  LEFT JOIN (
      SELECT post, COUNT(id) AS comment_count 
      FROM tbl_comments_maps 
      GROUP BY post
  ) C ON s.id = C.post
  GROUP BY s.id, s.title, s.description, s.cpu, s.logo, s.view, s.position
  ORDER BY (
      SELECT grade 
      FROM tbl_chan_sat
      WHERE id = s.id
  );
`;
  const res = await executeQuery<IAllMapsModel>(sql);

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
  SELECT s.id AS sat_id, s.title AS sat_title, s.position, s.view, s.logo,
        b.title AS beam_title, b.description AS beam_description, b.cpu AS beam_slug, b.map_img
  FROM tbl_chan_sat AS s
  JOIN tbl_chan_beam AS b ON s.id = b.sat
  WHERE s.cpu = ?
  AND b.map_img != ''
`;
  const res = await executeQuery<IMapModel>(sql, [slug]);

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
  C.title AS cat_name,
  C.cpu AS cat_slug,
  C.folder AS cat_folder
FROM
  tbl_useful U
LEFT JOIN
  tbl_categories C ON U.cat = C.id
WHERE U.cpu = ?
LIMIT 1
`;
    const res = await executeQuery<IArticleModel>(sql, [slug]);

    return res instanceof Error || res.length === 0
      ? null
      : {
          ...res[0],
          title: decode(res[0].title),
          description: decode(res[0].description),
        };
  }
);

export const getSatFinderArticle = async () => {
  const sql = `SELECT id, title, cpu, description, text, view, logo FROM tbl_useful WHERE cpu = ?`;

  return await executeQuery<IArticleModel>(sql, [
    'napravlenie-antenny-po-karte',
  ]);
};

export const getSimilarArticles = async (logo: string, id = -1) => {
  const removeId = id > -1 ? `AND id != ${id}` : '';

  const sql = `
    SELECT id, title, cpu, date
    FROM tbl_useful
    WHERE logo = ?
    ${removeId}
    AND cat NOT IN ${WRONG_CAT_IDS}
    ORDER BY date DESC, id DESC
    LIMIT 7
`;

  const res = await executeQuery<ISimilarArticleModel>(sql, [logo]);

  return res instanceof Error
    ? []
    : res.map((r) => ({
        ...r,
        title: decode(r.title),
      }));
};

export const getArticleSlugList = cache(async () => {
  const sql = `SELECT cpu FROM tbl_useful`;

  return await executeQuery<{ cpu: string }>(sql);
});

export const updateViewCount = async (
  dbTableTitle: string,
  articleId: string,
  oldViewNumber: number
) =>
  await executeQuery(`UPDATE ${dbTableTitle} SET view = ? WHERE id = ?`, [
    `${oldViewNumber + 1}`,
    articleId,
  ]);
