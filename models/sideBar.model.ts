import { ILang } from './ui.model';

export const NUMBER_OF_LAST_NEWS_WIDGET = 5;

export interface IAccordionItemOptions {
  name: string;
  img: {
    src: string;
    width: number;
    height: number;
    alt: ILang;
  };
  title: ILang;
  href?: string;
}

export const accordionTitles: { [key: string]: IAccordionItemOptions } = {
  SATELLITE_TV: {
    name: 'SATELLITE_TV',
    img: {
      src: '/images/accordion/folder_home_3055.png',
      width: 32,
      height: 32,
      alt: {
        ua: 'Супутникове телебачення InstallSat',
        en: 'Satellite TV Installsat',
      },
    },
    title: { ua: 'Цифрове телебачення', en: 'Digital TV' },
    href: '/statja/sputnikovoe-televidenie/',
  },
  INSTALLATIONS: {
    name: 'INSTALLATIONS',
    img: {
      src: '/images/accordion/advancedsettings_2775.png',
      width: 32,
      height: 32,
      alt: {
        ua: 'Варіанти встановлення супутникового тб',
        en: 'Installing options for satellite TV',
      },
    },
    title: { ua: 'Варіанти встановлення', en: 'Installing options' },
  },
  SATELLITES: {
    name: 'SATELLITES',
    img: {
      src: '/images/accordion/satellite32.png',
      width: 34,
      height: 32,
      alt: {
        ua: 'Канали на супутниках',
        en: 'Channels on satellites',
      },
    },
    title: { ua: 'Канали на супутниках', en: 'Channels on satellites' },
  },
  PACKAGES: {
    name: 'PACKAGES',
    img: {
      src: '/images/accordion/film24.png',
      width: 32,
      height: 24,
      alt: {
        ua: 'Пакети каналів',
        en: 'Channels packages',
      },
    },
    title: { ua: 'Пакети каналів', en: 'Channel packages' },
  },
  USEFUL: {
    name: 'USEFUL',
    img: {
      src: '/images/accordion/icon_info_key.png',
      width: 32,
      height: 32,
      alt: {
        ua: 'Корисні статті',
        en: 'Useful articles',
      },
    },
    title: { ua: 'Корисні статті', en: 'Useful articles' },
  },
  ONLINE_TV: {
    name: 'ONLINE_TV',
    img: {
      src: '/images/accordion/trailer-icon_37.png',
      width: 37,
      height: 32,
      alt: {
        ua: 'Онлайн ТБ',
        en: 'Online TV',
      },
    },
    title: { ua: 'Онлайн ТБ', en: 'Online TV' },
    href: '/spisok-online-kanalov/vse-tv/',
  },
};
