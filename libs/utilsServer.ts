import { IImgParams } from '@/models/ui.model';
import fs from 'fs';
import path from 'path';

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

// export const imagePathValidate = (
//   imgPath: string,
//   alternativePath: string,
//   isChangeToGif = false
// ): string | null => {
//   const path = isChangeToGif ? changeExtToGif(imgPath) : imgPath;

//   return isFileExists(path)
//     ? path
//     : isFileExists(alternativePath)
//       ? alternativePath
//       : null;
// };
