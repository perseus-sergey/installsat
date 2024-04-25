'use server';

import { executeQuery } from '@/libs/db/mysqldb';
import { getFormattedDateStr } from '@/libs/utils/utils';
import { ICommentsModel, ISubscribersEmails } from '@/models/comments.model';
import { EDBTableTitles } from '@/models/ui.model';
import { cache } from 'react';

export const getComments = cache(
  async (tblName: EDBTableTitles, postId: string, start = 0, perPage = 20) => {
    const sql = `
  SELECT * FROM ${tblName} WHERE post = ? ORDER BY id DESC LIMIT ?, ?
`;

    return await executeQuery<ICommentsModel>(sql, [
      postId,
      `${start}`,
      `${perPage}`,
    ]);
  }
);

export const getCommentsNumber = cache(
  async (tblName: EDBTableTitles, postId: string) => {
    const sql = `
    SELECT COUNT(id) AS total_count FROM ${tblName} WHERE post = ?
`;

    const respCommentsNumber = await executeQuery<{ total_count: number }>(
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

  return await executeQuery<{ text: string }>(sql, [commentId]);
};

export const insertComment = async (
  dbTableName: EDBTableTitles,
  articleId: string,
  author: string,
  email: string,
  text: string,
  ip = '',
  country = ''
) =>
  await executeQuery(
    `INSERT INTO ${dbTableName} (post,author,mail,text,date,ip,country) VALUES (?,?,?,?,?,?,?)`,
    [articleId, author, email, text, getFormattedDateStr(), ip, country]
  );

export const editCommentDB = async (
  dbTableName: EDBTableTitles,
  commentId: number,
  text: string
) =>
  await executeQuery(`UPDATE ${dbTableName} SET text = ? WHERE id = ?`, [
    text,
    `${commentId}`,
  ]);

export const deleteSubscriptionEmail = async (
  dbTableName: EDBTableTitles,
  articleId: string,
  email: string
) =>
  await executeQuery(
    `UPDATE ${dbTableName} SET mail='' WHERE post=? AND mail=?`,
    [articleId, email]
  );

export const deleteComment = async (
  dbTableName: EDBTableTitles,
  commentID: string
) => await executeQuery(`DELETE FROM ${dbTableName} WHERE id=?`, [commentID]);

export const getArticleSubscribers = async (
  dbTableName: EDBTableTitles,
  articleId: string
) =>
  await executeQuery<ISubscribersEmails>(
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
