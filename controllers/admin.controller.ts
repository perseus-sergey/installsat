import { executeMultipleQuery, executeQuery } from '@/libs/db/mysqldb';
import { getFormattedDateStrYearFirst } from '@/libs/utils/dates';
import { IAllNewsModel, TArticleTableModel } from '@/models/articles.model';
import { EDBTableTitles } from '@/models/ui.model';
import { cache } from 'react';

// export const WRONG_CAT_IDS = '(2,0,11,12,13)';

export const deleteItemFromDbTable = async (
  dbTableName: EDBTableTitles,
  id: string
) => await executeQuery(`DELETE FROM ${dbTableName} WHERE id=?`, [id]);

export const getAllDbDataById = cache(
  async <T>(dbTableName: EDBTableTitles, id: string) => {
    const sql = `SELECT * FROM ${dbTableName} WHERE id = ?`;

    return await executeQuery<T>(sql, [`${id}`]);
  }
);

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

export const getArticleAndCatDb = cache(async (articleId: string | number) => {
  const sql = `SELECT * FROM tbl_useful WHERE id = ${articleId} LIMIT 1; SELECT title, id FROM tbl_categories`;

  return executeMultipleQuery<
    [TArticleTableModel[], { id: number; title: string }[]]
  >(sql);
});

export const editArticleDB = async (
  articleID: string,
  articleData: TArticleTableModel
) =>
  await executeQuery(
    `
    UPDATE tbl_useful SET title = ?, cpu = ?, description = ?, text = ?, cat = ?, author = ?, logo = ?, folder = ?, date = ?, date_upd = ?
    WHERE id = ?`,
    [
      articleData.title,
      articleData.cpu,
      articleData.description,
      articleData.text,
      `${articleData.cat}`,
      articleData.author || '',
      articleData.logo || '',
      articleData.folder || '',
      getFormattedDateStrYearFirst(articleData.date),
      getFormattedDateStrYearFirst(),
      articleID,
    ]
  );

// if (isset($title) && isset($cpu) && isset($cat1) && isset($description) && isset($text) && isset($logo) && isset($folder)){
// 	$dateUpd = date('Y-m-d');
//   add_to_db ("
//   UPDATE $tbl SET title='$title',cpu='$cpu',description='$description',text='$text',cat='$cat1',author='$author',logo='$logo',folder='$folder',date='$date',date_upd='$dateUpd'
//   WHERE id='$id'");
// }
