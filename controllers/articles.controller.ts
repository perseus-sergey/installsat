import { executeQuery } from '@/libs/db/mysqldb';
import {
  IAllNewsModel,
  IArticleModel,
  ISingleCatArticlesModel,
} from '@/models/articles.model';
import { cache } from 'react';

export const getChunkOfNews = async (
  quantity: number,
  start = 0,
  catId?: number
) => {
  const catValue = catId ? `=${catId}` : 'NOT IN (2,8,0,12,13)';

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
CROSS JOIN
    (SELECT 
         COUNT(*) AS total_count 
     FROM 
         tbl_useful 
     WHERE 
         cat ${catValue}) T
LEFT JOIN
    tbl_categories C2
ON
    U.cat = C2.id
WHERE 
    U.cat ${catValue}
ORDER BY 
    U.date DESC, U.id 
LIMIT ?, ?
`;

  return await executeQuery<IAllNewsModel>(sql, [`${start}`, `${quantity}`]);
};

export const getArticle = async (slug: string) => {
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
};

export const getArticleCatList = cache(async () => {
  const sql = `SELECT id, title, cpu, description, text FROM tbl_categories WHERE id NOT IN (2,8,0,12,13)`;

  return await executeQuery<ISingleCatArticlesModel>(sql);
});
