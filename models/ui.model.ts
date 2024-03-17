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

export const IMG_PROPERTIES = {
  defaultImgBlur: '/images/1blur.gif',
  h1SatImage: {
    path: '/images/satellites/',
    defaultImage: '/images/satellite_7144.png',
    alternativeSymbol: '🛰',
    height: 99,
    width: 132,
  },
  channelLogo: {
    big: {
      path: '/images/channelsOptimized/',
      defaultImage: '/images/1not_found_chan.png',
      height: 99,
      width: 132,
    },
    small: {
      path: '/images/channel_55/',
      defaultImage: '/images/1not_found_chan.png',
      height: 42,
      width: 55,
    },
  },
};

export const BREADCRUMBS_SEPARATOR = '჻';

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
