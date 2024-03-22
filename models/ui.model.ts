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
  defaultImgBlur: '/images/1blur.gif',
  channelLogo: {
    big: {
      path: '/images/channelsOptimized/',
      height: '99px',
      width: '132px',
      alternativeImgStr: { title: '🎞', fontSize: '6rem' },
      defaultImage: {
        src: '/images/1not_found_chan.png',
        height: '99px',
        width: '132px',
      },
    },
    small: {
      path: '/images/channel_55/',
      height: '42px',
      width: '55px',
      alternativeImgStr: { title: '🎞', fontSize: '2rem' },
      defaultImage: {
        src: '/images/1not_found_chan.png',
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
