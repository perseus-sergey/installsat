import { executeMultipleQuery, executeQuery } from '@/libs/db/mysqldb';
import { getFormattedDateStrYearFirst } from '@/libs/utils/dates';
import { IAllNewsModel, TArticleTableModel } from '@/models/articles.model';
import { IEditChannelListModel } from '@/models/channelList.model';
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

export const getEditDbChannels = cache(async (searchQuery: string) => {
  if (!searchQuery) return [];

  const sql = `
      SELECT ch.id, ch.title, ch.cpu, ch.canonical,
      sat.title AS sat_title,
      sat.position AS sat_position,
      fr.freq AS frequency,
      cat.title AS category,
      co.title AS compr,
      (SELECT title FROM tbl_chan_categ WHERE id = cat.parent LIMIT 1) AS cat_parent_title
      FROM tbl_channals AS ch 
      LEFT JOIN tbl_chan_freq 		  AS fr	 ON ch.frequency 	= fr.id 
      LEFT JOIN tbl_chan_categ 		  AS cat ON ch.cat   		  = cat.id 
      LEFT JOIN tbl_chan_sat 			  AS sat ON ch.sat 			  = sat.id 
      LEFT JOIN tbl_chan_compress   AS co	 ON ch.compress 	= co.id 
      WHERE 	ch.title LIKE "%${searchQuery}%"
      ORDER BY ch.title, fr.freq
    `;

  const resp = await executeQuery<IEditChannelListModel>(sql, [searchQuery]);

  return resp;
});
