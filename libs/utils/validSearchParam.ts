import { TSearchParams } from '@/models/ui.model';
import { EUrlSearchParam } from '@/models/url.model';

export const validSearchParam = (
  paramName: EUrlSearchParam,
  searchParams?: TSearchParams
) =>
  searchParams &&
  searchParams[paramName] &&
  typeof searchParams[paramName] === 'string'
    ? (searchParams[paramName] as string)
    : '';
