'use server';

import { auth } from '@/auth';
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

export const isAdminAuth = cache(async () => {
  const session = await auth();
  const adminEmail = process.env.ADMIN_EMAIL;

  return session &&
    session.user &&
    session.user.email &&
    adminEmail &&
    session.user.email === adminEmail
    ? true
    : false;
});
