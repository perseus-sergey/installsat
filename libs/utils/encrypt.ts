'use server';

import { randomBytes, createCipheriv, scryptSync } from 'crypto';

export const encrypt = async (text: string, secretKey: string) => {
  if (!text || !secretKey) return '';

  const salt = randomBytes(16);
  const key = scryptSync(secretKey, salt, 32);
  const iv = randomBytes(16);
  const cipher = createCipheriv('aes-256-cbc', key, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  return `${salt.toString('hex')}:${iv.toString('hex')}:${encrypted}`;
};
