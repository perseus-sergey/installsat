'use server';

import { auth } from '@/auth';
import { cache } from 'react';

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
