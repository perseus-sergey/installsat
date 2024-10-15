import { ELanguage, ILang } from '../language.model';
import { EUrlBaseParam } from '../url/url.model';

export interface IAccordionItemOptions {
  name: string;
  img: {
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
      alt: {
        [ELanguage.UA]:
          'Іконка з зображенням фільмової стрічки. Для пакетів каналів',
        [ELanguage.EN]: 'Icon with film strip. For channels packages',
      },
    },
    title: {
      [ELanguage.UA]: 'Пакети каналів',
      [ELanguage.EN]: 'Channels packages',
    },
    baseHrefOfList: `/${EUrlBaseParam.PACKAGE_CHANNEL_LIST}`,
  },
  USEFUL: {
    name: 'USEFUL',
    img: {
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
