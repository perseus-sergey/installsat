import { ELanguage, ILang } from './ui.model';
import { EUrlBaseParam } from './url.model';

export interface IAccordionItemOptions {
  name: string;
  img: {
    src: string;
    width: number;
    height: number;
    alt: ILang;
  };
  title: ILang;
  titleHref?: string;
  baseHrefOfList?: string;
}

export const MENU_ACCORDION: { [key: string]: IAccordionItemOptions } = {
  SAT_FINDER: {
    name: 'SAT_FINDER',
    img: {
      src: '/Images/accordion/compass.png',
      width: 32,
      height: 32,
      alt: {
        [ELanguage.UA]: 'Іконка пошуку супутників',
        [ELanguage.EN]: 'Satellite search icon',
      },
    },
    title: {
      [ELanguage.UA]: 'Пошук супутників',
      [ELanguage.EN]: 'Satellite Finder',
    },
    titleHref: `/${EUrlBaseParam.SAT_FINDER}`,
  },
  MAPS: {
    name: 'MAPS',
    img: {
      src: '/Images/accordion/point.png',
      width: 32,
      height: 32,
      alt: {
        [ELanguage.UA]: 'Іконка для карт покриття телевізійних супутників',
        [ELanguage.EN]: 'Satellite coverage maps icon',
      },
    },
    title: {
      [ELanguage.UA]: 'Карти покриття',
      [ELanguage.EN]: 'Satellite Maps',
    },
    baseHrefOfList: `/${EUrlBaseParam.SAT_COVERAGE_MAP}`,
  },
  SATELLITES: {
    name: 'SATELLITES',
    img: {
      src: '/Images/accordion/satellite32.png',
      width: 34,
      height: 32,
      alt: {
        [ELanguage.UA]: 'Іконка з зображенням супутника',
        [ELanguage.EN]: 'Satellite icon',
      },
    },
    title: {
      [ELanguage.UA]: 'Канали на супутниках',
      [ELanguage.EN]: 'Channels on satellites',
    },
    baseHrefOfList: `/${EUrlBaseParam.SAT_CHANNEL_LIST}`,
  },
  PACKAGES: {
    name: 'PACKAGES',
    img: {
      src: '/Images/accordion/film24.png',
      width: 32,
      height: 24,
      alt: {
        [ELanguage.UA]: 'Пакети каналів',
        [ELanguage.EN]: 'Channels packages',
      },
    },
    title: {
      [ELanguage.UA]:
        'Іконка з зображенням фільмової стрічки. Для пакетів каналів',
      [ELanguage.EN]: 'Icon with film strip. For channels packages',
    },
    baseHrefOfList: `/${EUrlBaseParam.PACKAGE_CHANNEL_LIST}`,
  },
  USEFUL: {
    name: 'USEFUL',
    img: {
      src: '/Images/accordion/icon_info_key.png',
      width: 32,
      height: 32,
      alt: {
        [ELanguage.UA]:
          'Іконка з зображенням листа паперу з ключем. Для корисних статей',
        [ELanguage.EN]:
          'Icon with the image of a sheet of paper with a key. For useful articles',
      },
    },
    title: {
      [ELanguage.UA]: 'Корисні статті',
      [ELanguage.EN]: 'Useful articles',
    },
    baseHrefOfList: `/${EUrlBaseParam.ARTICLE}`,
  },
  ONLINE_TV: {
    name: 'ONLINE_TV',
    img: {
      src: '/Images/accordion/trailer-icon_37.png',
      width: 37,
      height: 32,
      alt: {
        [ELanguage.UA]:
          'Іконка з зображенням бобини з кіноплівкою. Для онлайн ТБ',
        [ELanguage.EN]:
          'An icon with the image of a reel with film. For online TV',
      },
    },
    title: { [ELanguage.UA]: 'Онлайн ТБ', [ELanguage.EN]: 'Online TV' },
    titleHref: `/${EUrlBaseParam.ONLINE_CHANNEL_LIST}`,
  },
  SCHEDULE: {
    name: 'SCHEDULE',
    img: {
      src: '/Images/accordion/calendar.png',
      width: 32,
      height: 32,
      alt: {
        [ELanguage.UA]: 'Іконка з календарем розкладу телевізійних передач',
        [ELanguage.EN]: 'An icon with a schedule of television programs',
      },
    },
    title: { [ELanguage.UA]: 'Програма ТБ', [ELanguage.EN]: 'TV schedule' },
    titleHref: `/${EUrlBaseParam.CHANNELS_TV_PROGRAM}`,
  },
};

export const ADDED_ITEMS = {
  freeChannels: {
    title: {
      [ELanguage.UA]: 'Безкоштовні',
      [ELanguage.EN]: 'Free channels',
    },
    link: `/${EUrlBaseParam.SAT_CHANNEL_LIST}`,
  },
};
