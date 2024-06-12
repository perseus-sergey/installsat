import { ELanguage, ILang } from './ui.model';
import { EUrlAdminParam } from './url.model';

interface ILink {
  title: string;
  href: string;
}

interface IImage {
  src: string;
  width: number;
  height: number;
  alt: ILang;
}

interface IMenuType {
  name: string;
  titleHref?: string;
  img: IImage;
  title: ILang;
  links?: ILink[];
}

interface IMenuAccordionAdmin {
  [key: string]: IMenuType;
}

export const MENU_ACCORDION_ADMIN: IMenuAccordionAdmin = {
  ARTICLES: {
    name: 'ARTICLES',
    img: {
      src: '/Images/accordion/icon_info_key.png',
      width: 32,
      height: 32,
      alt: {
        [ELanguage.EN]: 'Articles',
        [ELanguage.UA]: 'Статті',
      },
    },
    title: {
      [ELanguage.EN]: 'Articles',
      [ELanguage.UA]: 'Статті',
    },
    links: [
      {
        title: 'Add new',
        href: `/${EUrlAdminParam.BASE_PATH}/${EUrlAdminParam.ARTICLES_EDIT}/add`,
      },
      {
        title: 'Edit',
        href: `/${EUrlAdminParam.BASE_PATH}/${EUrlAdminParam.ARTICLES_EDIT}/edit`,
      },
    ],
  },

  CHANNELS: {
    name: 'CHANNELS',
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
      [ELanguage.UA]: 'Канали',
      [ELanguage.EN]: 'Channels',
    },
    links: [
      {
        title: 'Add new',
        href: `/${EUrlAdminParam.BASE_PATH}/${EUrlAdminParam.CHANNELS_EDIT}/add`,
      },
      {
        title: 'Edit',
        href: `/${EUrlAdminParam.BASE_PATH}/${EUrlAdminParam.CHANNELS_EDIT}/edit`,
      },
    ],
  },

  PARSING: {
    name: 'PARSING',
    img: {
      src: '/Images/accordion/html.png',
      width: 32,
      height: 32,
      alt: {
        [ELanguage.UA]: 'Парсинг',
        [ELanguage.EN]: 'Parsing',
      },
    },
    title: {
      [ELanguage.UA]: 'Парсинг',
      [ELanguage.EN]: 'Parsing',
    },
    titleHref: `/${EUrlAdminParam.BASE_PATH}/${EUrlAdminParam.PARSE}`,
  },

  // MAPS: {
  //   name: 'MAPS',
  //   img: {
  //     src: '/Images/accordion/point.png',
  //     width: 32,
  //     height: 32,
  //     alt: {
  //       [ELanguage.UA]: 'Карти покриття телевізійних супутників',
  //       [ELanguage.EN]: 'Satellite coverage maps',
  //     },
  //   },
  //   title: {
  //     [ELanguage.UA]: 'Карти покриття',
  //     [ELanguage.EN]: 'Satellite Maps',
  //   },
  //   baseHrefOfList: `/${EUrlBaseParam.SAT_COVERAGE_MAP}`,
  // },
  // INSTALLATIONS: {
  //   name: 'INSTALLATIONS',
  //   img: {
  //     src: '/Images/accordion/advancedsettings_2775.png',
  //     width: 32,
  //     height: 32,
  //     alt: {
  //       [ELanguage.UA]: 'Варіанти встановлення супутникового тб',
  //       [ELanguage.EN]: 'Installing options for satellite TV',
  //     },
  //   },
  //   title: {
  //     [ELanguage.UA]: 'Варіанти встановлення',
  //     [ELanguage.EN]: 'Installing options',
  //   },
  //   baseHrefOfList: `/${EUrlBaseParam.INSTALLATION_OPTIONS}`,
  // },
  // PACKAGES: {
  //   name: 'PACKAGES',
  //   img: {
  //     src: '/Images/accordion/film24.png',
  //     width: 32,
  //     height: 24,
  //     alt: {
  //       [ELanguage.UA]: 'Пакети каналів',
  //       [ELanguage.EN]: 'Channels packages',
  //     },
  //   },
  //   title: {
  //     [ELanguage.UA]: 'Пакети каналів',
  //     [ELanguage.EN]: 'Channel packages',
  //   },
  //   baseHrefOfList: `/${EUrlBaseParam.PACKAGE_CHANNEL_LIST}`,
  // },
  // ONLINE_TV: {
  //   name: 'ONLINE_TV',
  //   img: {
  //     src: '/Images/accordion/trailer-icon_37.png',
  //     width: 37,
  //     height: 32,
  //     alt: {
  //       [ELanguage.UA]: 'Онлайн ТБ',
  //       [ELanguage.EN]: 'Online TV',
  //     },
  //   },
  //   title: { [ELanguage.UA]: 'Онлайн ТБ', [ELanguage.EN]: 'Online TV' },
  //   titleHref: `/${EUrlBaseParam.ONLINE_CHANNEL_LIST}`,
  // },
  // SCHEDULE: {
  //   name: 'SCHEDULE',
  //   img: {
  //     src: '/Images/accordion/calendar.png',
  //     width: 32,
  //     height: 32,
  //     alt: {
  //       [ELanguage.UA]: 'Розклад передач ТБ',
  //       [ELanguage.EN]: 'TV schedule',
  //     },
  //   },
  //   title: { [ELanguage.UA]: 'Програма ТБ', [ELanguage.EN]: 'TV schedule' },
  //   titleHref: `/${EUrlBaseParam.CHANNELS_TV_PROGRAM}`,
  // },
};

// export const ADDED_ITEMS = {
//   freeChannels: {
//     title: {
//       [ELanguage.UA]: 'Безкоштовні',
//       [ELanguage.EN]: 'Free channels',
//     },
//     link: `/${EUrlBaseParam.SAT_CHANNEL_LIST}`,
//   },
