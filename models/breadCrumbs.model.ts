import { ILang } from './ui.model';
import { EUrlParam } from './url.model';

type IBreadCrumbs = Map<EUrlParam, ILang>;

export const BREAD_CRUMBS_HOME: ILang = { ua: 'Дім', en: 'Home' };

export const MBreadCrumbs: IBreadCrumbs = new Map([
  [
    EUrlParam.TRANSPONDER_NEWS,
    { ua: 'Транспондерні новини', en: 'Transponder news' },
  ],
]);
