export const IS_PRODUCTION = true;

export enum ELanguage {
  UA = 'ua',
  EN = 'en',
}

export const LANGUAGE = ELanguage.UA;

export interface ILang {
  [ELanguage.UA]: string;
  [ELanguage.EN]: string;
}

export type TSearchParams = { [key: string]: string | string[] | undefined };
export interface IImgParams {
  src: string;
  width: number;
  height: number;
}

export const IMG_PROPERTIES = {
  defaultImgBlur: '/Images/1blur.gif',
};

export const BREADCRUMBS_SEPARATOR = '჻';
export const SIDE_BAR_CLOSE_BTN = '⚔';

export const ERRORS = {
  ERROR_EMPTY_DATA: {
    [ELanguage.UA]: 'На жаль, запит повернув порожній результат',
    [ELanguage.EN]: 'Unfortunately, the query returned an empty result',
  },
  ERROR_PAGE_TITLE: {
    [ELanguage.UA]:
      '⚠ Не вдалося завантажити контент. Будь ласка, спробуйте пізніше.',
    [ELanguage.EN]: '⚠ Failed to load content. Please try again later.',
  },
  NOT_FOUND_TITLE: {
    [ELanguage.UA]: 'Сторінку не знайдено.',
    [ELanguage.EN]: 'Page not found.',
  },
  NOT_FOUND_DESCRIPTION: {
    [ELanguage.UA]:
      'На жаль, зазначену сторінку не знайдено. Можливо, вона була видалена або переміщена.',
    [ELanguage.EN]:
      'Unfortunately, the specified page was not found. It may have been deleted or moved.',
  },
  NOT_FOUND_ACTION: {
    [ELanguage.UA]: 'Перейти на головну сторінку.',
    [ELanguage.EN]: 'Go to the main page.',
  },
  EMPTY_DATE_NEWS_PAGE: {
    title: {
      [ELanguage.UA]: 'Немає новин за вказаний період',
      [ELanguage.EN]: 'There are no news for the specified period',
    },
    img: {
      src: '/Images/empty_page.png',
      height: 128,
      width: 128,
      alternativeImgStr: { title: '📂', fontSize: '9rem' },
    },
  },
};

export const DEFAULT_META_DATA = {
  [ELanguage.UA]: {
    title: 'Сайт про цифрове телебачення',
    description:
      'Статті, новини, списки телеканалів в пакетах провайдерів цифрового телебачення. Програма телепередач',
    keywords:
      'Статті, новини, списки телеканалів, провайдери, цифрове телебачення, Програма телепередач, бісс ключі, мовлення',
  },
  [ELanguage.EN]: {
    title: 'Site about digital television',
    description:
      'Articles, news, lists of TV channels in packages of digital television providers. TV program',
    keywords:
      'Articles, news, lists of TV channels, providers, digital television, TV program, biss keys, broadcasting',
  },
  openGraph: {
    siteName: 'Installsat TV',
    type: 'article',
    authors: ['Installsat'],
  },
};

export const SIMILAR_ARTICLES = {
  title: {
    [ELanguage.EN]: 'Similar articles',
    [ELanguage.UA]: 'Схожі статті',
  },
};

export enum EDBTableTitles {
  ARTICLE = 'tbl_useful',
  TRANS_NEWS = 'tbl_digest',
  CHANNELS = 'tbl_channals',
  CHANNEL_SAT = 'tbl_chan_sat',
  CHANNEL_CATEGORY = 'tbl_chan_categ',
  COMMENTS_ARTICLE = 'tbl_comments',
  COMMENTS_CHANNEL = 'tbl_comments_chan',
  COMMENTS_CHAT = 'tbl_comments_chat',
  COMMENTS_INSTALLATION = 'tbl_comments_instal',
  COMMENTS_MAPS = 'tbl_comments_maps',
  COMMENTS_ONLINE = 'tbl_comments_online',
  COMMENTS_PACKAGES = 'tbl_comments_packs',
  COMMENTS_SATELLITE = 'tbl_comments_sat',
  COMMENTS_GENRE = 'tbl_comments_tema',
  TV_SCHEDULE_VIPIKO = 'tv_shedule_vipiko',
  TV_SCHEDULE_VSE_TV = 'tv_shedule_vsetv',
  TV_SCHEDULE = 'tv_shedule',
}

// satellite_equipments: tbl_eqp_comments
