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
  SATELLITE_TV: {
    name: 'SATELLITE_TV',
    img: {
      src: '/Images/accordion/folder_home_3055.png',
      width: 32,
      height: 32,
      alt: {
        [ELanguage.UA]: 'Супутникове телебачення InstallSat',
        [ELanguage.EN]: 'Satellite TV Installsat',
      },
    },
    title: {
      [ELanguage.UA]: 'Цифрове телебачення',
      [ELanguage.EN]: 'Digital TV',
    },
    titleHref: `/${EUrlBaseParam.ARTICLE}/sputnikovoe-televidenie`,
  },
  SAT_FINDER: {
    name: 'SAT_FINDER',
    img: {
      src: '/Images/accordion/compass.png',
      width: 32,
      height: 32,
      alt: {
        [ELanguage.EN]: 'Satellite Finder',
        [ELanguage.UA]: 'Пошук супутників',
      },
    },
    title: {
      [ELanguage.UA]: 'Пошук супутників',
      [ELanguage.EN]: 'Satellite Finder',
    },
    titleHref: EUrlBaseParam.SAT_FINDER,
  },
  INSTALLATIONS: {
    name: 'INSTALLATIONS',
    img: {
      src: '/Images/accordion/advancedsettings_2775.png',
      width: 32,
      height: 32,
      alt: {
        [ELanguage.UA]: 'Варіанти встановлення супутникового тб',
        [ELanguage.EN]: 'Installing options for satellite TV',
      },
    },
    title: {
      [ELanguage.UA]: 'Варіанти встановлення',
      [ELanguage.EN]: 'Installing options',
    },
    baseHrefOfList: `/${EUrlBaseParam.INSTALLATION_OPTIONS}`,
  },
  SATELLITES: {
    name: 'SATELLITES',
    img: {
      src: '/Images/accordion/satellite32.png',
      width: 34,
      height: 32,
      alt: {
        [ELanguage.UA]: 'Канали на супутниках',
        [ELanguage.EN]: 'Channels on satellites',
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
      [ELanguage.UA]: 'Пакети каналів',
      [ELanguage.EN]: 'Channel packages',
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
        [ELanguage.UA]: 'Корисні статті',
        [ELanguage.EN]: 'Useful articles',
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
        [ELanguage.UA]: 'Онлайн ТБ',
        [ELanguage.EN]: 'Online TV',
      },
    },
    title: { [ELanguage.UA]: 'Онлайн ТБ', [ELanguage.EN]: 'Online TV' },
    titleHref: `/${EUrlBaseParam.ONLINE_CHANNEL_LIST}`,
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
