import { createDecipheriv, scryptSync } from 'crypto';

export const decrypt = async (text: string, secretKey: string) => {
  if (!text || !secretKey) return '';

  const [saltHex, ivHex, encrypted] = text.split(':');
  const salt = Buffer.from(saltHex, 'hex');
  const iv = Buffer.from(ivHex, 'hex');
  const key = scryptSync(secretKey, salt, 32);
  const decipher = createDecipheriv('aes-256-cbc', key, iv);
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
};
