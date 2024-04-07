export const SITE_BASE_URL = 'https://www.installsat.tv';

export enum EUrlBaseParam {
  BASE_PATH = '/',
  TRANSPONDER_NEWS = 'transponderni-novyny',
  // SAT_NEWS = 'suputnykovi-novyny',
  PACKAGE_CHANNEL_LIST = 'spysok-kanaliv-paketu',
  SAT_CHANNEL_LIST = 'spysok-kanaliv-suputnyka',
  // ALL_SATS_CHANNEL_LIST = 'vsi-suputnyky',
  INSTALLATION_OPTIONS = 'varianty-vstanovlennia-anten',
  ARTICLE = 'stattia',
  SAT_COVERAGE_MAP = 'karty-pokryttia-suputnykiv',
  SAT_FINDER = 'satellite-finder',
  NEWS_AND_ARTICLES = 'novyny-ta-statti',
  CHANNEL_PARAMS = 'parametry-kanalu',
  ONLINE_CHANNEL_LIST = 'telekanaly-onlain',
  // TV_ONLINE = 'tb-online',
  // TV_PROGRAM = 'programa-tb',
  CHANNELS_TV_PROGRAM = 'programa-telekanaliv',
  PRODUCT = 'tovar',
  PRODUCT_LIST = 'spysok-tovariv',
  PRODUCT_CATEGORIES = 'kategoriji-tovariv',
}

export enum EUrlSearchParam {
  ARTICLE = 'q',
  SAT = 'sat',
  CHANNEL = 'channel',
  INTERVAL = 'interval',
  PAGE = 'page',
  DATE = 'date',
  CHANNEL_FORMAT_T2MI = 't2-mi',
  CHANNEL_FORMAT_MPG4 = 'mpeg4',
}
