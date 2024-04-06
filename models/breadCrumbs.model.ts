import { ELanguage, ILang } from './ui.model';
import { EUrlBaseParam } from './url.model';

type IBreadCrumbs = Map<EUrlBaseParam, ILang>;

export const BREAD_SEPARATOR = '჻';

export const MBreadCrumbs: IBreadCrumbs = new Map([
  [EUrlBaseParam.BASE_PATH, { [ELanguage.UA]: 'Дім', [ELanguage.EN]: 'Home' }],
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
      [ELanguage.UA]: 'Список каналів пакета',
      [ELanguage.EN]: 'List of package channels',
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
