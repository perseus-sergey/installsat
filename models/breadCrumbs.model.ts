import { ILang } from './ui.model';
import { EUrlBaseParam } from './url.model';

type IBreadCrumbs = Map<EUrlBaseParam, ILang>;

export const BREAD_SEPARATOR = '჻';

export const MBreadCrumbs: IBreadCrumbs = new Map([
  [EUrlBaseParam.BASE_PATH, { ua: 'Дім', en: 'Home' }],
  [
    EUrlBaseParam.TRANSPONDER_NEWS,
    { ua: 'Транспондерні новини', en: 'Transponder news' },
  ],
  [
    EUrlBaseParam.SAT_CHANNEL_LIST,
    {
      ua: 'Список безкоштовних каналів супутників',
      en: 'List of satellite free channels',
    },
  ],
  [
    EUrlBaseParam.PACKAGE_CHANNEL_LIST,
    { ua: 'Список каналів пакета', en: 'List of package channels' },
  ],
  [
    EUrlBaseParam.INSTALLATION_OPTIONS,
    { ua: 'Варіанти встановлення', en: 'Installation options' },
  ],
  [EUrlBaseParam.ARTICLE, { ua: 'Статті', en: 'Articles' }],
  [
    EUrlBaseParam.SAT_COVERAGE_MAP,
    { ua: 'Мапа покриття супутника', en: 'Satellite coverage map' },
  ],
  [
    EUrlBaseParam.NEWS_AND_ARTICLES,
    { ua: 'Новини та статті', en: 'News and articles' },
  ],
  [
    EUrlBaseParam.CHANNEL_PARAMS,
    { ua: 'Параметри каналів', en: 'Channel parameters' },
  ],
  [
    EUrlBaseParam.ONLINE_CHANNEL_LIST,
    { ua: 'Список онлайн каналів', en: 'Online channel list' },
  ],
  [EUrlBaseParam.TV_ONLINE, { ua: 'Канали онлайн', en: 'Online channels' }],
  [
    EUrlBaseParam.CHANNELS_TV_PROGRAM,
    { ua: 'Програма каналів', en: 'Channel program' },
  ],
  [EUrlBaseParam.PRODUCT, { ua: 'Товари', en: 'Products' }],
  [EUrlBaseParam.PRODUCT_LIST, { ua: 'Список товарів', en: 'Product list' }],
  [
    EUrlBaseParam.PRODUCT_CATEGORIES,
    { ua: 'Категорії товарів', en: 'Product categories' },
  ],
]);
