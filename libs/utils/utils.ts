import { TSearchParams } from '@/models/ui.model';

// export const cutText = (text: string, length: number) => {
//   const trimmedText = text.trim();

//   return trimmedText.length <= length
//     ? trimmedText
//     : `${text.slice(0, length).trim()} ...`;
// };

export const cutText = (text: string, cutLength: number) => {
  if (!text) return '';

  let trimmedText = text.trim();

  if (trimmedText.length <= cutLength) return trimmedText;

  trimmedText = text.slice(0, cutLength);
  trimmedText = trimmedText.replace(/[!,.-]*$/, '');
  const lastSpaceIndex = trimmedText.lastIndexOf(' ');
  trimmedText =
    lastSpaceIndex !== -1 ? trimmedText.slice(0, lastSpaceIndex) : trimmedText;

  return `${trimmedText}...`;
};

export const createArray = (length: number) => [...Array(length)];

export const arrayShift = <T>(array: T[][]): T[][] => {
  const [, ...rest] = array;

  return rest;
};

export const getDate = (date: string | Date = new Date(), lang?: string) => {
  const currDate = date instanceof Date ? date : new Date(date);
  if (currDate.toString() === 'Invalid Date') return '';

  return currDate.toLocaleDateString(lang, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const getFormattedDateStr = (
  date: string | Date = new Date(),
  isYearFirst = true
) => {
  const currDate = date instanceof Date ? date : new Date(date);
  if (currDate.toString() === 'Invalid Date') return '';

  const year = currDate.getFullYear();
  const month = String(currDate.getMonth() + 1).padStart(2, '0');
  const day = String(currDate.getDate()).padStart(2, '0');

  return isYearFirst ? `${year}-${month}-${day}` : `${day}-${month}-${year}`;
};

export const isUniqDeepArray = <T>(arr: T[][]): boolean =>
  new Set(arr.map((item) => item.join('|'))).size === arr.length;

export const deepUniqueArraySize = <T>(arr: T[][]): number =>
  new Set(arr.map((item) => item.join('|'))).size;

export const deepUniqueArray = <T>(arr: T[][]) =>
  Array.from(new Set(arr.map((mapItem) => JSON.stringify(mapItem))), (jItem) =>
    JSON.parse(jItem)
  );

export const shuffleArray = <T>(array: T[]): T[] =>
  array.sort(() => Math.random() - 0.5);

export const capitalizedWord = (word: string) =>
  word.replace(/^(.)/, (match) => match.toUpperCase());

export const sleep = (ms = 1000) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const addRemoveClassName = (
  oldArr: string[],
  className: string,
  isAdd: boolean
) => (isAdd ? [...oldArr, className] : oldArr.filter((cl) => cl !== className));

export const makeUrlSearchParams = (
  searchParams: TSearchParams
): URLSearchParams => {
  const params = new URLSearchParams();
  Object.entries(searchParams).forEach(([key, value]) => {
    if (value !== undefined) {
      if (Array.isArray(value)) {
        value.forEach((v) => params.append(key, v));
      } else {
        params.set(key, value);
      }
    }
  });

  return params;
};
