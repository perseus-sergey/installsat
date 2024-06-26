import { DEFAULT_LANG, ELanguage, TSearchParams } from '@/models/ui.model';
import { EUrlSearchParam } from '@/models/url.model';
import { cache } from 'react';

export const validSearchParam = (
  paramName: EUrlSearchParam,
  searchParams?: TSearchParams
) =>
  searchParams &&
  searchParams[paramName] &&
  typeof searchParams[paramName] === 'string'
    ? decodeURIComponent(searchParams[paramName] as string)
    : '';

export const isValidLanguage = (lang: string): boolean =>
  Object.values(ELanguage).includes(lang as ELanguage);

export const getELangKey = cache((lang: string): ELanguage => {
  const isValid = isValidLanguage(lang);

  return isValid ? (lang as ELanguage) : DEFAULT_LANG;
});

export const validSearchParamArray = (
  paramName: EUrlSearchParam,
  searchParams?: TSearchParams
): undefined | string[] => {
  if (!searchParams || !searchParams[paramName]) return undefined;

  const serPar = searchParams[paramName];
  if (!serPar || (Array.isArray(serPar) && serPar.length === 0))
    return undefined;

  return Array.isArray(serPar)
    ? serPar.map((par) => decodeURIComponent(par))
    : [decodeURIComponent(serPar)];
};
