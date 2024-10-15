import { ELanguage } from '../language.model';
import { EUrlBaseParam } from '../url/url.model';

export const NUMBER_OF_LAST_NEWS_WIDGET = 5;

export const WIDGET_LAST_NEWS = {
  title: {
    [ELanguage.UA]: 'Останні новини',
    [ELanguage.EN]: 'Last news',
  },
  href: `${EUrlBaseParam.NEWS_AND_ARTICLES}`,
  baseHrefOfList: `${EUrlBaseParam.ARTICLE}`,
  ariaLabel: {
    [ELanguage.UA]: 'Перейти до перегляду статті',
    [ELanguage.EN]: 'Go to view article',
  },
  ariaLabelForTitle: {
    [ELanguage.UA]: 'Перейти до переліку всіх статей',
    [ELanguage.EN]: 'Go to the list of all articles',
  },
};

export const WIDGET_ARTICLE_CATEGORY = {
  title: {
    [ELanguage.UA]: 'Транспондерні новини',
    [ELanguage.EN]: 'Transponder news',
  },
  href: `/${EUrlBaseParam.TRANSPONDER_NEWS}`,
  baseHrefOfList: `/${EUrlBaseParam.NEWS_AND_ARTICLES}`,
  ariaLabel: {
    [ELanguage.UA]: 'Перейти до переліку статей категорії',
    [ELanguage.EN]: 'Go to the list of articles of the category',
  },
  ariaLabelForTitle: {
    [ELanguage.UA]: 'Перейти до переліку транспондерних новин',
    [ELanguage.EN]: 'Go to the list of transponder news',
  },
};
