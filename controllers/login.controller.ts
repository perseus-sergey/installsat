'use server';

import { poolExecute } from '@/libs/db/mysqldb';
import { getFormattedDateStrYearFirst } from '@/libs/utils/dates';
import { IUser } from '@/models/login.model';
import { cache } from 'react';

export const getDbUser = cache(async (email: string) => {
  const sql = `SELECT * FROM userlist WHERE email=? LIMIT 1`;

  const res = await poolExecute<IUser[]>(sql, [email]);

  return res instanceof Error ? [null] : res;
});

export const createDbUser = async (
  email: string,
  password: string,
  name: string,
  roleNumber = 2
) =>
  await poolExecute(
    `INSERT INTO userlist (email,  password, name, role, registration_date) VALUES (?,?,?,?,?)`,
    [email, password, name, `${roleNumber}`, getFormattedDateStrYearFirst()]
  );
