'use server';

import { executeQuery } from '@/libs/db/mysqldb';
import { getFormattedDateStr } from '@/libs/utils';
import { ICommentsModel } from '@/models/articles.model';
import { ISubscribersEmails } from '@/models/comments.model';
import { cache } from 'react';

export const getComments = cache(async (tblName: string, postId: string) => {
  const sql = `
  SELECT * FROM ${tblName} WHERE post = ? ORDER BY id DESC
`;

  return await executeQuery<ICommentsModel>(sql, [postId]);
});

export const getCommentFromDB = async (tblName: string, commentId: string) => {
  const sql = `
  SELECT text FROM ${tblName} WHERE id = ?
`;

  return await executeQuery<{ text: string }>(sql, [commentId]);
};

export const insertComment = async (
  dbTableName: string,
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
  dbTableName: string,
  commentId: number,
  text: string
) =>
  await executeQuery(`UPDATE ${dbTableName} SET text = ? WHERE id = ?`, [
    text,
    `${commentId}`,
  ]);

export const deleteSubscriptionEmail = async (
  dbTableName: string,
  articleId: string,
  email: string
) =>
  await executeQuery(
    `UPDATE ${dbTableName} SET mail='' WHERE post=? AND mail=?`,
    [articleId, email]
  );

export const deleteComment = async (dbTableName: string, commentID: string) =>
  await executeQuery(`DELETE FROM ${dbTableName} WHERE id=?`, [commentID]);

export const getArticleSubscribers = async (
  dbTableName: string,
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
