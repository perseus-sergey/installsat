import { ELanguage } from './ui.model';
import { EUrlBaseParam } from './url.model';

export const NUMBER_OF_LAST_NEWS_WIDGET = 5;

export const WIDGET_LAST_NEWS = {
  title: {
    [ELanguage.UA]: 'Останні новини',
    [ELanguage.EN]: 'Last news',
  },
  href: `/${EUrlBaseParam.NEWS_AND_ARTICLES}`,
  baseHrefOfList: `/${EUrlBaseParam.ARTICLE}`,
};

export const WIDGET_ARTICLE_CATEGORY = {
  title: {
    [ELanguage.UA]: 'Транспондерні новини',
    [ELanguage.EN]: 'Transponder news',
  },
  href: `/${EUrlBaseParam.TRANSPONDER_NEWS}`,
  baseHrefOfList: `/${EUrlBaseParam.NEWS_AND_ARTICLES}`,
};
