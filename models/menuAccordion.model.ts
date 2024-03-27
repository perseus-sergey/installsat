import { ILang } from './ui.model';
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
        ua: 'Супутникове телебачення InstallSat',
        en: 'Satellite TV Installsat',
      },
    },
    title: { ua: 'Цифрове телебачення', en: 'Digital TV' },
    titleHref: `/${EUrlBaseParam.ARTICLE}/sputnikovoe-televidenie`,
  },
  INSTALLATIONS: {
    name: 'INSTALLATIONS',
    img: {
      src: '/Images/accordion/advancedsettings_2775.png',
      width: 32,
      height: 32,
      alt: {
        ua: 'Варіанти встановлення супутникового тб',
        en: 'Installing options for satellite TV',
      },
    },
    title: { ua: 'Варіанти встановлення', en: 'Installing options' },
    baseHrefOfList: `/${EUrlBaseParam.INSTALLATION_OPTIONS}`,
  },
  SATELLITES: {
    name: 'SATELLITES',
    img: {
      src: '/Images/accordion/satellite32.png',
      width: 34,
      height: 32,
      alt: {
        ua: 'Канали на супутниках',
        en: 'Channels on satellites',
      },
    },
    title: { ua: 'Канали на супутниках', en: 'Channels on satellites' },
    baseHrefOfList: `/${EUrlBaseParam.SAT_CHANNEL_LIST}`,
  },
  PACKAGES: {
    name: 'PACKAGES',
    img: {
      src: '/Images/accordion/film24.png',
      width: 32,
      height: 24,
      alt: {
        ua: 'Пакети каналів',
        en: 'Channels packages',
      },
    },
    title: { ua: 'Пакети каналів', en: 'Channel packages' },
    baseHrefOfList: `/${EUrlBaseParam.PACKAGE_CHANNEL_LIST}`,
  },
  USEFUL: {
    name: 'USEFUL',
    img: {
      src: '/Images/accordion/icon_info_key.png',
      width: 32,
      height: 32,
      alt: {
        ua: 'Корисні статті',
        en: 'Useful articles',
      },
    },
    title: { ua: 'Корисні статті', en: 'Useful articles' },
    baseHrefOfList: `/${EUrlBaseParam.ARTICLE}`,
  },
  ONLINE_TV: {
    name: 'ONLINE_TV',
    img: {
      src: '/Images/accordion/trailer-icon_37.png',
      width: 37,
      height: 32,
      alt: {
        ua: 'Онлайн ТБ',
        en: 'Online TV',
      },
    },
    title: { ua: 'Онлайн ТБ', en: 'Online TV' },
    titleHref: `/${EUrlBaseParam.ONLINE_CHANNEL_LIST}`,
    // titleHref: '/spisok-online-kanalov/vse-tv/',
  },
};

export const ADDED_ITEMS = {
  freeChannels: {
    title: {
      ua: 'Безкоштовні',
      en: 'Free channels',
    },
    link: `/${EUrlBaseParam.SAT_CHANNEL_LIST}`,
  },
};
