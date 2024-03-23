import { executeQuery } from '@/libs/db/mysqldb';
import {
  IAllNewsModel,
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

// export const channelCatsSql = `
// SELECT title, id, parent, cpu FROM tbl_chan_categ WHERE parent=0 AND title != '' AND id NOT IN (2,4,23,25) ORDER BY title
// `;

// export const lastNewsWidgetSql = `
// SELECT id, title, cpu FROM tbl_useful WHERE cat NOT IN (2,8,0,12) ORDER BY date DESC, id DESC LIMIT ${NUMBER_OF_LAST_NEWS_WIDGET}
// `;

// export const usefulArticlesSql = `
// SELECT title, id, cpu FROM tbl_useful WHERE cat=4 OR cat=5
// `;

// export const channelSatsSql = `
// SELECT title,position,id,cpu,logo
// FROM tbl_chan_sat
// WHERE id != 1 AND fill = 1
// ORDER BY position
// `;

// export const articleCategoriesSql = `
// SELECT id,title, cpu FROM tbl_categories WHERE id != 2 AND id!=12 AND title!=''
// `;

export const getArticleCatList = cache(async () => {
  const sql = `SELECT id, title, cpu, description, text FROM tbl_categories WHERE id NOT IN (2,8,0,12,13)`;

  return await executeQuery<ISingleCatArticlesModel>(sql);
});

// export const getChannelCatList = cache(
//   async () => await executeQuery<TChannelCatsModel>(channelCatsSql)
// );

// export const getChannelSatList = cache(
//   async () => await executeQuery<TSatModel>(channelSatsSql)
// );

// export const getUsefulArticleList = cache(
//   async () => await executeQuery<TUsefulArticlesSqlModel>(usefulArticlesSql)
// );
