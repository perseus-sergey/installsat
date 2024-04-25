import { headers } from 'next/headers';

export const getUserIP = () =>
  (headers().get('x-forwarded-for') ?? '127.0.0.1').split(',')[0];
