export const createArray = (length: number) => [...Array(length)];

export const arrayShift = <T>(array: T[][]): T[][] => {
  const [, ...rest] = array;
  return rest;
};

export const uniqueArray = <T>(array: T[]): T[] => [...new Set(array)];

export const isUniqDeepArray = <T>(arr: T[][]): boolean =>
  new Set(arr.map((item) => item.join('|'))).size === arr.length;

export const deepUniqueArraySize = <T>(arr: T[][]): number =>
  new Set(arr.map((item) => item.join('|'))).size;

export const deepUniqueArray = <T>(arr: T[][]) =>
  Array.from(new Set(arr.map((mapItem) => JSON.stringify(mapItem))), (jItem) => JSON.parse(jItem));

export const shuffleArray = <T>(array: T[]): T[] => array.sort(() => Math.random() - 0.5);

export const capitalizedWord = (word: string) =>
  word.replace(/^(.)/, (match) => match.toUpperCase());

export const sleep = (ms = 1000) => new Promise((resolve) => setTimeout(resolve, ms));

export const addRemoveClassName = (oldArr: string[], className: string, isAdd: boolean) =>
  isAdd ? [...oldArr, className] : oldArr.filter((cl) => cl !== className);
