import { ILang } from './ui.model';
import { EUrlBaseParam } from './url.model';

type IBreadCrumbs = Map<EUrlBaseParam, ILang>;

export const BREAD_SEPARATOR = '჻';

export const BREAD_CRUMBS_HOME: ILang = { ua: 'Дім', en: 'Home' };

export const MBreadCrumbs: IBreadCrumbs = new Map([
  [
    EUrlBaseParam.TRANSPONDER_NEWS,
    { ua: 'Транспондерні новини', en: 'Transponder news' },
  ],
]);
