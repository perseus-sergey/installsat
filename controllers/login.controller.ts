'use server';

import { executeQuery } from '@/libs/db/mysqldb';
import { getFormattedDateStrYearFirst } from '@/libs/utils/dates';
import { IUser } from '@/models/login.model';
import { cache } from 'react';

export const getDbUser = cache(async (email: string) => {
  const sql = `SELECT * FROM userlist WHERE email=? LIMIT 1`;

  const res = await executeQuery<IUser>(sql, [email]);

  return res instanceof Error ? [null] : res;
});

export const createDbUser = async (
  email: string,
  password: string,
  name: string,
  roleNumber = 2
) =>
  await executeQuery(
    `INSERT INTO userlist (email,  password, name, role, registration_date) VALUES (?,?,?,?,?)`,
    [email, password, name, `${roleNumber}`, getFormattedDateStrYearFirst()]
  );

// export const editCommentDB = async (
//   dbTableName: EDBTableTitles,
//   commentId: number,
//   text: string
// ) =>
//   await executeQuery(`UPDATE ${dbTableName} SET text = ? WHERE id = ?`, [
//     text,
//     `${commentId}`,
//   ]);

// export const deleteComment = async (
//   dbTableName: EDBTableTitles,
//   commentID: string
// ) => await executeQuery(`DELETE FROM ${dbTableName} WHERE id=?`, [commentID]);
