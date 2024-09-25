import { ELanguage } from './ui.model';
import { EUrlBaseParam } from './url.model';

export const BREAD_SEPARATOR = '჻';

export const FIRST_ELEMENT_SIZE = '1.1rem';

export const CUT_LAST_ELEMENT = {
  lengthThreshold: 50,
  numberOfStartWords: 2,
  numberOfEndWords: 2,
};

export const BREAD_BASE_PATH = {
  href: EUrlBaseParam.BASE_PATH,
  title: { [ELanguage.UA]: 'На головну', [ELanguage.EN]: 'Home' },
};

export const BREAD_TRANSPONDER_NEWS = {
  href: EUrlBaseParam.TRANSPONDER_NEWS,
  title: {
    [ELanguage.UA]: 'Транспондерні новини',
    [ELanguage.EN]: 'Transponder news',
  },
};

// SAT_CHANNEL_LIST: {
//   href: EUrlBaseParam.SAT_CHANNEL_LIST,
//   title: {
//     [ELanguage.UA]: 'Список безкоштовних каналів супутників',
//     [ELanguage.EN]: 'List of satellite free channels',
//   },
// },

export const BREAD_SAT_CHANNEL_LIST = {
  href: EUrlBaseParam.SAT_CHANNEL_LIST,
  title: {
    [ELanguage.UA]: 'Список каналів супутників',
    [ELanguage.EN]: 'List of satellite channels',
  },
};

export const BREAD_PACKAGE_CHANNEL_LIST = {
  href: EUrlBaseParam.PACKAGE_CHANNEL_LIST,
  title: {
    [ELanguage.UA]: 'Список пакетів',
    [ELanguage.EN]: 'List of packages',
  },
};

export const BREAD_INSTALLATION_OPTIONS = {
  href: EUrlBaseParam.INSTALLATION_OPTIONS,
  title: {
    [ELanguage.UA]: 'Варіанти встановлення',
    [ELanguage.EN]: 'Installation options',
  },
};

export const BREAD_ARTICLE = {
  href: EUrlBaseParam.ARTICLE,
  title: { [ELanguage.UA]: 'Статті', [ELanguage.EN]: 'Articles' },
};

export const BREAD_SAT_COVERAGE_MAP = {
  href: EUrlBaseParam.SAT_COVERAGE_MAP,
  title: {
    [ELanguage.UA]: 'Мапи покриття супутників',
    [ELanguage.EN]: 'Satellite coverage maps',
  },
};

export const BREAD_NEWS_AND_ARTICLES = {
  href: EUrlBaseParam.NEWS_AND_ARTICLES,
  title: {
    [ELanguage.UA]: 'Новини та статті',
    [ELanguage.EN]: 'News and articles',
  },
};

export const BREAD_CHANNEL_PARAMS = {
  href: EUrlBaseParam.CHANNEL_PARAMS,
  title: {
    [ELanguage.UA]: 'Параметри каналів',
    [ELanguage.EN]: 'Channel parameters',
  },
};

export const BREAD_ONLINE_CHANNEL_LIST = {
  href: EUrlBaseParam.ONLINE_CHANNEL_LIST,
  title: {
    [ELanguage.UA]: 'Список онлайн каналів',
    [ELanguage.EN]: 'Online channel list',
  },
};

export const BREAD_CHANNELS_TV_PROGRAM = {
  href: EUrlBaseParam.CHANNELS_TV_PROGRAM,
  title: {
    [ELanguage.UA]: 'Програма каналів',
    [ELanguage.EN]: 'Channel program',
  },
};
