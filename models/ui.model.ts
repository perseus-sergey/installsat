export const IS_PRODUCTION = true;

export interface ILang {
  ua: string;
  en: string;
}

export enum EUITitles {
  ERROR_EMPTY_DATA,
  ERROR_PAGE_TITLE,
  NOT_FOUND_TITLE,
  NOT_FOUND_DESCRIPTION,
  NOT_FOUND_ACTION,
}

type TUITitle = Map<EUITitles, ILang>;

export interface IImgParams {
  src: string;
  width: string;
  height: string;
}

export const IMG_PROPERTIES = {
  defaultImgBlur: '/Images/1blur.gif',
  channelLogo: {
    big: {
      path: '/Images/channelsOptimized/',
      height: '99px',
      width: '132px',
      alternativeImgStr: { title: '🎞', fontSize: '6rem' },
      defaultImage: {
        src: '/Images/1not_found_chan.png',
        height: '99px',
        width: '132px',
      },
    },
    small: {
      path: '/Images/channel_55/',
      height: '42px',
      width: '55px',
      alternativeImgStr: { title: '🎞', fontSize: '2rem' },
      defaultImage: {
        src: '/Images/1not_found_chan.png',
        height: '42px',
        width: '55px',
      },
    },
  },
};

export const BREADCRUMBS_SEPARATOR = '჻';
export const SIDE_BAR_CLOSE_BTN = '⚔';

export const MUITitles: TUITitle = new Map([
  [
    EUITitles.ERROR_EMPTY_DATA,
    { ua: 'Не вдалося вилучити дані', en: 'Failed to retrieve data' },
  ],
  [
    EUITitles.ERROR_PAGE_TITLE,
    {
      ua: '⚠ Не вдалося завантажити контент. Будь ласка, спробуйте пізніше.',
      en: '⚠ Failed to load content. Please try again later.',
    },
  ],
  [
    EUITitles.NOT_FOUND_TITLE,
    {
      ua: 'Сторінку не знайдено.',
      en: 'Page not found.',
    },
  ],
  [
    EUITitles.NOT_FOUND_DESCRIPTION,
    {
      ua: 'На жаль, зазначену сторінку не знайдено. Можливо, вона була видалена або переміщена.',
      en: 'Unfortunately, the specified page was not found. It may have been deleted or moved.',
    },
  ],
  [
    EUITitles.NOT_FOUND_ACTION,
    {
      ua: 'Перейти на головну сторінку.',
      en: 'Go to the main page.',
    },
  ],
]);

export const defaultMetaData = {
  ua: {
    title: 'Сайт про цифрове телебачення',
    description:
      'Статті, новини, списки телеканалів в пакетах провайдерів цифрового телебачення. Програма телепередач',
    keywords:
      'Статті, новини, списки телеканалів, провайдери, цифрове телебачення, Програма телепередач, бісс ключі, мовлення',
  },
  en: {
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
    en: 'Similar articles',
    ua: 'Схожі статті',
  },
};
