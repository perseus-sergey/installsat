'use server';

import { executeQuery } from '@/libs/db/mysqldb';
import { getFormattedDateStr } from '@/libs/utils';
import { ICommentsModel } from '@/models/articles.model';
import { ISubscribersEmails } from '@/models/comments.model';

export const getComments = async (tblName: string, postId: number) => {
  const sql = `
  SELECT * FROM ${tblName} WHERE post = ? ORDER BY id DESC
`;

  return await executeQuery<ICommentsModel>(sql, [`${postId}`]);
};

export const insertComment = async (
  dbTableName: string,
  articleId: number,
  author: string,
  email: string,
  text: string,
  ip = '',
  country = ''
) =>
  await executeQuery(
    `INSERT INTO ${dbTableName} (post,author,mail,text,date,ip,country) VALUES (?,?,?,?,?,?,?)`,
    [`${articleId}`, author, email, text, getFormattedDateStr(), ip, country]
  );

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
