import { executeMultipleQuery, executeQuery } from '@/libs/db/mysqldb';
import { IAllNewsModel, IArticleTableModel } from '@/models/articles.model';
import { EDBTableTitles } from '@/models/ui.model';
import { cache } from 'react';

// export const WRONG_CAT_IDS = '(2,0,11,12,13)';

// export const getArticleCatList = cache(async () => {
//   const sql = `SELECT id, title, cpu, description, text FROM tbl_categories WHERE id NOT IN ${WRONG_CAT_IDS}`;

//   return await executeQuery<ISingleCatArticlesModel>(sql);
// });

// export const getCurrentCatParams = cache(
//   async (catCpu: string): Promise<ISingleCatArticlesModel> => {
//     const allCatResponse = await getArticleCatList();
//     const catParams =
//       allCatResponse instanceof Error
//         ? ''
//         : allCatResponse.find((cat) => cat.cpu === catCpu);

//     return (
//       catParams || { title: '', description: '', id: -1, cpu: '', text: '' }
//     );
//   }
// );

export const getAdminChunkOfNews = cache(
  async (quantity: number, start = 0, searchQuery = '') => {
    const searchText = searchQuery ? `LIKE "%${searchQuery}%"` : '!= ""';

    const sql = `
  SELECT 
  U.id,
  U.title,
  U.date_upd,
  T.total_count,
  CAT.title AS category_title
FROM tbl_useful U
LEFT JOIN tbl_categories CAT ON U.cat = CAT.id
CROSS JOIN
  (SELECT COUNT(id) AS total_count FROM tbl_useful WHERE title ${searchText}) T
  WHERE U.title ${searchText}
ORDER BY 
  U.date DESC, U.id 
LIMIT ?, ?
`;
    const res = await executeQuery<IAllNewsModel>(sql, [
      `${start}`,
      `${quantity}`,
    ]);

    return res instanceof Error ? [] : res;
  }
);

export const deleteItemFromDbTable = async (
  dbTableName: EDBTableTitles,
  id: string
) => await executeQuery(`DELETE FROM ${dbTableName} WHERE id=?`, [id]);

// export const getSatMapList = cache(async () => {
//   const sql = `
//   SELECT
//       MAX(b.id) AS beam_id,
//       s.id,
//       s.title,
//       s.description,
//       s.cpu,
//       s.logo,
//       s.view,
//       s.position,
//       MAX(C.comment_count) AS comment_count
//   FROM (
//       SELECT *
//       FROM tbl_chan_beam
//       WHERE map_img != ''
//   ) AS b
//   LEFT JOIN tbl_chan_sat AS s ON b.sat = s.id
//   LEFT JOIN (
//       SELECT post, COUNT(id) AS comment_count
//       FROM tbl_comments_maps
//       GROUP BY post
//   ) C ON s.id = C.post
//   GROUP BY s.id, s.title, s.description, s.cpu, s.logo, s.view, s.position
//   ORDER BY (
//       SELECT grade
//       FROM tbl_chan_sat
//       WHERE id = s.id
//   );
// `;
//   const res = await executeQuery<IAllMapsModel>(sql);

//   return res instanceof Error ? [] : res;
// });

// export const getSatMap = cache(async (slug: string) => {
//   const sql = `
//   SELECT s.id AS sat_id, s.title AS sat_title, s.position, s.view, s.logo,
//         b.title AS beam_title, b.description AS beam_description, b.cpu AS beam_slug, b.map_img
//   FROM tbl_chan_sat AS s
//   JOIN tbl_chan_beam AS b ON s.id = b.sat
//   WHERE s.cpu = ?
//   AND b.map_img != ''
// `;
//   const res = await executeQuery<IMapModel>(sql, [slug]);

//   return res instanceof Error ? [] : res;
// });

export const getAllDbDataById = cache(
  async <T>(dbTableName: EDBTableTitles, id: string) => {
    const sql = `SELECT * FROM ${dbTableName} WHERE id = ?`;

    return await executeQuery<T>(sql, [`${id}`]);
  }
);

export const getArticleAndCatDb = cache(async (articleId: string | number) => {
  const sql = `SELECT * FROM tbl_useful WHERE id = ${articleId} LIMIT 1; SELECT title, id FROM tbl_categories`;

  return executeMultipleQuery<
    [IArticleTableModel[], { id: number; title: string }[]]
  >(sql);
});
