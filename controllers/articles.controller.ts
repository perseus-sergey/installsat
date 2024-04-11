import { executeQuery } from '@/libs/db/mysqldb';
import {
  IAllNewsModel,
  IArticleModel,
  ICommentsModel,
  ISimilarArticleModel,
  ISingleCatArticlesModel,
} from '@/models/articles.model';
import { cache } from 'react';

export const WRONG_CAT_IDS = '(2,8,0,11,12,13)';

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
FROM 
  tbl_useful U
LEFT JOIN
  (SELECT 
       post, 
       COUNT(id) AS comment_count 
   FROM 
       tbl_comments 
   GROUP BY 
       post) C
ON 
  U.id = C.post
LEFT JOIN
  tbl_categories C2
ON
  U.cat = C2.id
CROSS JOIN
  (SELECT COUNT(id) AS total_count FROM tbl_useful WHERE cat ${catValue} AND (title ${searchText} OR description ${searchText})) T
WHERE 
  U.cat ${catValue}
  AND (U.title ${searchText} OR U.description ${searchText})
ORDER BY 
  U.date DESC, U.id 
LIMIT ?, ?
`;

  return await executeQuery<IAllNewsModel>(sql, [`${start}`, `${quantity}`]);
};

export const getArticle = cache(async (slug: string) => {
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
`;

  return await executeQuery<IArticleModel>(sql, [slug]);
});

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

  return await executeQuery<ISimilarArticleModel>(sql, [logo]);
};

export const getArticleCatList = cache(async () => {
  const sql = `SELECT id, title, cpu, description, text FROM tbl_categories WHERE id NOT IN ${WRONG_CAT_IDS}`;

  return await executeQuery<ISingleCatArticlesModel>(sql);
});

export const getArticleSlugList = cache(async () => {
  const sql = `SELECT cpu FROM tbl_useful`;

  return await executeQuery<{ cpu: string }>(sql);
});

export const getComments = async (
  articleId: number,
  dbCommentTableTitle: string
) => {
  const sql = `SELECT * FROM ${dbCommentTableTitle} WHERE post = ?`;

  return await executeQuery<ICommentsModel>(sql, [`${articleId}`]);
};

export const updateViewCount = async (
  dbTableTitle: string,
  articleId: number,
  oldViewNumber: number
) =>
  await executeQuery(`UPDATE ${dbTableTitle} SET view = ? WHERE id = ?`, [
    `${oldViewNumber + 1}`,
    `${articleId}`,
  ]);
