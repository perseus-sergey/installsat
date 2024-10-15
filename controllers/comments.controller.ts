'use server';

import { poolExecute } from '@/libs/db/mysqldb';
import { getFormattedDateStrYearFirst } from '@/libs/utils/dates';
import { ICommentsModel, ISubscribersEmails } from '@/models/ui/comments.model';
import { EDBTableTitles } from '@/models/dbTblNames.model';
import { ResultSetHeader } from 'mysql2';
import { cache } from 'react';

export const getComments = cache(
  async (
    tblName: EDBTableTitles,
    postId: string | number,
    start = 0,
    perPage = 20
  ) => {
    const sql = `
  SELECT * FROM ${tblName} WHERE post = ? ORDER BY id DESC LIMIT ?, ?
`;

    return await poolExecute<ICommentsModel[]>(sql, [
      postId,
      `${start}`,
      `${perPage}`,
    ]);
  }
);

export const getCommentsNumber = cache(
  async (tblName: EDBTableTitles, postId: string | number) => {
    const sql = `
    SELECT COUNT(id) AS total_count FROM ${tblName} WHERE post = ?
`;

    const respCommentsNumber = await poolExecute<{ total_count: number }[]>(
      sql,
      [postId]
    );

    return respCommentsNumber instanceof Error
      ? 0
      : respCommentsNumber[0].total_count;
  }
);

export const getCommentFromDB = async (
  tblName: EDBTableTitles,
  commentId: string
) => {
  const sql = `
  SELECT text FROM ${tblName} WHERE id = ?
`;

  const res = await poolExecute<{ text: string }[]>(sql, [commentId]);

  return res instanceof Error ? res : res[0].text;
};

export const insertComment = async (
  dbTableName: EDBTableTitles,
  articleId: string | number,
  author: string,
  email: string,
  text: string,
  ip = '',
  country = ''
) => {
  const res = await poolExecute<ResultSetHeader>(
    `INSERT INTO ${dbTableName} (post,author,mail,text,date,ip,country) VALUES (?,?,?,?,?,?,?)`,
    [
      articleId,
      author,
      email,
      text,
      getFormattedDateStrYearFirst(),
      ip,
      country,
    ]
  );

  if (res instanceof Error) throw new Error(`DB ERROR: ${res.message}`);

  return res.affectedRows;
};

export const editCommentDB = async (
  dbTableName: EDBTableTitles,
  commentId: number,
  text: string
) => {
  const res = await poolExecute<ResultSetHeader>(
    `UPDATE ${dbTableName} SET text = ? WHERE id = ?`,
    [text, `${commentId}`]
  );

  if (res instanceof Error) throw new Error(`DB ERROR: ${res.message}`);

  return res.affectedRows;
};

export const deleteSubscriptionEmail = async (
  dbTableName: EDBTableTitles,
  articleId: string,
  email: string
) =>
  await poolExecute(
    `UPDATE ${dbTableName} SET mail='' WHERE post=? AND mail=?`,
    [articleId, email]
  );

export const deleteComment = async (
  dbTableName: EDBTableTitles,
  commentID: string
) => await poolExecute(`DELETE FROM ${dbTableName} WHERE id=?`, [commentID]);

export const getArticleSubscribers = async (
  dbTableName: EDBTableTitles,
  articleId: string
) =>
  await poolExecute<ISubscribersEmails[]>(
    `
    SELECT mail, MAX(author) AS author, MAX(ip) AS ip, MAX(date) AS date
    FROM ${dbTableName}
    WHERE post=?
    AND date >= DATE_SUB( NOW( ) , INTERVAL 6 MONTH )
    AND mail!=''
    GROUP BY mail
    `,
    [articleId]
  );
