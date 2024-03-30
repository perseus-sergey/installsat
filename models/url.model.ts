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
  SAT_COVERAGE_MAP = 'mapa-pokryttia-suputnyka',
  NEWS_AND_ARTICLES = 'novyny-ta-statti',
  CHANNEL_PARAMS = 'parametry-kanalu',
  ONLINE_CHANNEL_LIST = 'telekanaly-onlain',
  TV_ONLINE = 'tb-online',
  // TV_PROGRAM = 'programa-tb',
  CHANNELS_TV_PROGRAM = 'programa-telekanaliv',
  PRODUCT = 'tovar',
  PRODUCT_LIST = 'spysok-tovariv',
  PRODUCT_CATEGORY = 'kategorija-tovara',
}

export enum EUrlSearchParam {
  SAT = 'sat',
  INTERVAL = 'interval',
  PAGE = 'page',
}
