import fs from 'fs';
import path from 'path';

export const isFileExists = (filePath: string): boolean =>
  fs.existsSync(path.join(process.cwd(), 'public', filePath));

const changeExtToGif = (path: string) => {
  const splitted = path.split('.').reverse();
  const [, ...startPath] = splitted;

  return [...startPath, 'gif'].join('.');
};

export const imagePathValidate = (
  imgPath: string,
  alternativePath: string,
  isChangeToGif = false
): string | null => {
  const path = isChangeToGif ? changeExtToGif(imgPath) : imgPath;

  return isFileExists(path)
    ? path
    : isFileExists(alternativePath)
      ? alternativePath
      : null;
};
