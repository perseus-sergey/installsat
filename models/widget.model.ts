import { EUrlBaseParam } from './url.model';

export const NUMBER_OF_LAST_NEWS_WIDGET = 5;

export const WIDGET_LAST_NEWS = {
  title: {
    ua: 'Останні новини',
    en: 'Last news',
  },
  href: `/${EUrlBaseParam.NEWS_AND_ARTICLES}`,
  // href: '/novosti-i-statji/lastnews/',
  baseHrefOfList: `/${EUrlBaseParam.ARTICLE}`,
};

export const WIDGET_ARTICLE_CATEGORY = {
  title: {
    ua: 'Транспондерні новини',
    en: 'Transponder news',
  },
  href: `/${EUrlBaseParam.TRANSPONDER_NEWS}`,
  // href: '/novosti-i-statji/transpondernye-novosti/',
  baseHrefOfList: `/${EUrlBaseParam.NEWS_AND_ARTICLES}`,
};
