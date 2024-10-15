import { IImgParams } from '@/models/ui/image.model';
import fs from 'fs';
import path from 'path';
import { cache } from 'react';

export const isFileExists = cache((filePath: string): boolean => {
  const fullPath = path.join(process.cwd(), 'public', filePath);

  try {
    const stats = fs.statSync(fullPath);

    return stats.isFile();
  } catch (error) {
    return false;
  }
});

export const imagePathValidate = cache(
  (img: IImgParams, alternativeImg: IImgParams): IImgParams => {
    return isFileExists(img.src) ? img : alternativeImg;
  }
);
