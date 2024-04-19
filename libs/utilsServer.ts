'use server';

import { IImgParams } from '@/models/ui.model';
// import { EUrlSearchParam } from '@/models/url.model';
import {
  randomBytes,
  createCipheriv,
  createDecipheriv,
  scryptSync,
} from 'crypto';

import fs from 'fs';
import path from 'path';

// export const isFileExists = (filePath: string): boolean =>
//   fs.existsSync(path.join(process.cwd(), 'public', filePath));

export const isFileExists = (filePath: string): boolean => {
  const fullPath = path.join(process.cwd(), 'public', filePath);

  try {
    const stats = fs.statSync(fullPath);

    return stats.isFile();
  } catch (error) {
    return false;
  }
};

const changeExtToGif = (path: string) => {
  const splitted = path.split('.').reverse();
  const [, ...startPath] = splitted;

  return [...startPath, 'gif'].join('.');
};

export const imagePathValidate = (
  img: IImgParams,
  alternativeString: string,
  alternativeImg?: IImgParams,
  isChangeToGif = false
): IImgParams | string => {
  const path = isChangeToGif ? changeExtToGif(img.src) : img.src;

  return isFileExists(path)
    ? { ...img, src: path }
    : alternativeImg && isFileExists(alternativeImg.src)
      ? alternativeImg
      : alternativeString;
};

// export const validSearchParam = (
//   paramName: EUrlSearchParam,
//   searchParams?: TSearchParams
// ) =>
//   searchParams &&
//   searchParams[paramName] &&
//   typeof searchParams[paramName] === 'string'
//     ? (searchParams[paramName] as string)
//     : '';

export const encrypt = async (text: string, secretKey: string) => {
  const salt = randomBytes(16);
  const key = scryptSync(secretKey, salt, 32);
  const iv = randomBytes(16);
  const cipher = createCipheriv('aes-256-cbc', key, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  return `${salt.toString('hex')}:${iv.toString('hex')}:${encrypted}`;
};

export const decrypt = async (text: string, secretKey: string) => {
  const [saltHex, ivHex, encrypted] = text.split(':');
  const salt = Buffer.from(saltHex, 'hex');
  const iv = Buffer.from(ivHex, 'hex');
  const key = scryptSync(secretKey, salt, 32);
  const decipher = createDecipheriv('aes-256-cbc', key, iv);
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
};
