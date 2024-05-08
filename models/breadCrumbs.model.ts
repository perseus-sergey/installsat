import { ELanguage, ILang } from './ui.model';
import { EUrlBaseParam } from './url.model';

type IBreadCrumbs = Map<EUrlBaseParam, ILang>;

export const BREAD_SEPARATOR = '჻';
export const BREAD_START_ELEMENT_TITLE = '🌍';

export const FIRST_ELEMENT_SIZE = '1.1rem';

export const MBreadCrumbs: IBreadCrumbs = new Map([
  [
    EUrlBaseParam.BASE_PATH,
    { [ELanguage.UA]: 'На головну', [ELanguage.EN]: 'Home' },
  ],
  // [EUrlBaseParam.BASE_PATH, { [ELanguage.UA]: '🚀', [ELanguage.EN]: '🚀' }],
  [
    EUrlBaseParam.TRANSPONDER_NEWS,
    {
      [ELanguage.UA]: 'Транспондерні новини',
      [ELanguage.EN]: 'Transponder news',
    },
  ],
  [
    EUrlBaseParam.SAT_CHANNEL_LIST,
    {
      [ELanguage.UA]: 'Список безкоштовних каналів супутників',
      [ELanguage.EN]: 'List of satellite free channels',
    },
  ],
  [
    EUrlBaseParam.PACKAGE_CHANNEL_LIST,
    {
      [ELanguage.UA]: 'Список пакетів',
      [ELanguage.EN]: 'List of packages',
    },
  ],
  [
    EUrlBaseParam.INSTALLATION_OPTIONS,
    {
      [ELanguage.UA]: 'Варіанти встановлення',
      [ELanguage.EN]: 'Installation options',
    },
  ],
  [
    EUrlBaseParam.ARTICLE,
    { [ELanguage.UA]: 'Статті', [ELanguage.EN]: 'Articles' },
  ],
  [
    EUrlBaseParam.SAT_COVERAGE_MAP,
    {
      [ELanguage.UA]: 'Мапа покриття супутника',
      [ELanguage.EN]: 'Satellite coverage map',
    },
  ],
  [
    EUrlBaseParam.NEWS_AND_ARTICLES,
    { [ELanguage.UA]: 'Новини та статті', [ELanguage.EN]: 'News and articles' },
  ],
  [
    EUrlBaseParam.CHANNEL_PARAMS,
    {
      [ELanguage.UA]: 'Параметри каналів',
      [ELanguage.EN]: 'Channel parameters',
    },
  ],
  [
    EUrlBaseParam.ONLINE_CHANNEL_LIST,
    {
      [ELanguage.UA]: 'Список онлайн каналів',
      [ELanguage.EN]: 'Online channel list',
    },
  ],
  // [EUrlBaseParam.TV_ONLINE, { [ELanguage.UA]: 'Канали онлайн', [ELanguage.EN]: 'Online channels' }],
  [
    EUrlBaseParam.CHANNELS_TV_PROGRAM,
    { [ELanguage.UA]: 'Програма каналів', [ELanguage.EN]: 'Channel program' },
  ],
  [
    EUrlBaseParam.PRODUCT,
    { [ELanguage.UA]: 'Товари', [ELanguage.EN]: 'Products' },
  ],
  [
    EUrlBaseParam.PRODUCT_LIST,
    { [ELanguage.UA]: 'Список товарів', [ELanguage.EN]: 'Product list' },
  ],
  [
    EUrlBaseParam.PRODUCT_CATEGORIES,
    {
      [ELanguage.UA]: 'Категорії товарів',
      [ELanguage.EN]: 'Product categories',
    },
  ],
]);

export const BREAD_CRUMBS = {
  BASE_PATH: {
    href: EUrlBaseParam.BASE_PATH,
    title: { [ELanguage.UA]: 'На головну', [ELanguage.EN]: 'Home' },
  },

  TRANSPONDER_NEWS: {
    href: EUrlBaseParam.TRANSPONDER_NEWS,
    title: {
      [ELanguage.UA]: 'Транспондерні новини',
      [ELanguage.EN]: 'Transponder news',
    },
  },

  SAT_CHANNEL_LIST: {
    href: EUrlBaseParam.SAT_CHANNEL_LIST,
    title: {
      [ELanguage.UA]: 'Список безкоштовних каналів супутників',
      [ELanguage.EN]: 'List of satellite free channels',
    },
  },

  PACKAGE_CHANNEL_LIST: {
    href: EUrlBaseParam.PACKAGE_CHANNEL_LIST,
    title: {
      [ELanguage.UA]: 'Список пакетів',
      [ELanguage.EN]: 'List of packages',
    },
  },

  INSTALLATION_OPTIONS: {
    href: EUrlBaseParam.INSTALLATION_OPTIONS,
    title: {
      [ELanguage.UA]: 'Варіанти встановлення',
      [ELanguage.EN]: 'Installation options',
    },
  },

  ARTICLE: {
    href: EUrlBaseParam.ARTICLE,
    title: { [ELanguage.UA]: 'Статті', [ELanguage.EN]: 'Articles' },
  },

  SAT_COVERAGE_MAP: {
    href: EUrlBaseParam.SAT_COVERAGE_MAP,
    title: {
      [ELanguage.UA]: 'Мапи покриття супутників',
      [ELanguage.EN]: 'Satellite coverage maps',
    },
  },

  NEWS_AND_ARTICLES: {
    href: EUrlBaseParam.NEWS_AND_ARTICLES,
    title: {
      [ELanguage.UA]: 'Новини та статті',
      [ELanguage.EN]: 'News and articles',
    },
  },

  CHANNEL_PARAMS: {
    href: EUrlBaseParam.CHANNEL_PARAMS,
    title: {
      [ELanguage.UA]: 'Параметри каналів',
      [ELanguage.EN]: 'Channel parameters',
    },
  },

  ONLINE_CHANNEL_LIST: {
    href: EUrlBaseParam.ONLINE_CHANNEL_LIST,
    title: {
      [ELanguage.UA]: 'Список онлайн каналів',
      [ELanguage.EN]: 'Online channel list',
    },
  },

  CHANNELS_TV_PROGRAM: {
    href: EUrlBaseParam.CHANNELS_TV_PROGRAM,
    title: {
      [ELanguage.UA]: 'Програма каналів',
      [ELanguage.EN]: 'Channel program',
    },
  },

  PRODUCT: {
    href: EUrlBaseParam.PRODUCT,
    title: { [ELanguage.UA]: 'Товари', [ELanguage.EN]: 'Products' },
  },

  PRODUCT_LIST: {
    href: EUrlBaseParam.PRODUCT_LIST,
    title: { [ELanguage.UA]: 'Список товарів', [ELanguage.EN]: 'Product list' },
  },

  PRODUCT_CATEGORIES: {
    href: EUrlBaseParam.PRODUCT_CATEGORIES,
    title: {
      [ELanguage.UA]: 'Категорії товарів',
      [ELanguage.EN]: 'Product categories',
    },
  },
};
