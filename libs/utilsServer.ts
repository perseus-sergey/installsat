import fs from 'fs';
import path from 'path';

export const isFileExists = (filePath: string): boolean =>
  fs.existsSync(path.join(process.cwd(), 'public', filePath));

export const imagePathValidate = (
  imgPath: string,
  alternativePath: string
): string | null =>
  isFileExists(imgPath)
    ? imgPath
    : isFileExists(alternativePath)
      ? alternativePath
      : null;

export const getSmallSatLogoPath = (
  imgPath: string,
  alternativePath: string
): string | null => {
  const splitted = imgPath.split('.').reverse();
  const [, ...startPath] = splitted;
  const newPath = [...startPath, 'gif'].join('.');

  return isFileExists(newPath)
    ? newPath
    : isFileExists(alternativePath)
      ? alternativePath
      : null;
};
