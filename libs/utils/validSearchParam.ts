import { TSearchParams } from '@/models/ui.model';
import { EUrlSearchParam } from '@/models/url.model';

export const validSearchParam = (
  paramName: EUrlSearchParam,
  searchParams?: TSearchParams
) =>
  searchParams &&
  searchParams[paramName] &&
  typeof searchParams[paramName] === 'string'
    ? decodeURIComponent(searchParams[paramName] as string)
    : '';

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
