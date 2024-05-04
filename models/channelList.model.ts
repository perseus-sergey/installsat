import { ELanguage, ILang } from './ui.model';
import { EUrlBaseParam, EUrlSearchParam } from './url.model';

export const META_SAT_CHANNEL_LIST = {
  getH1(satTitle: string) {
    return {
      [ELanguage.UA]: `Безкоштовні канали з супутника ${satTitle}`,
      [ELanguage.EN]: `Free satellite channels on ${satTitle}`,
    };
  },
  getTitle() {
    return {
      [ELanguage.UA]: 'Список каналів супутника',
      [ELanguage.EN]: 'List of satellite channels',
    };
  },
  getKeywords(lang: keyof ILang) {
    return `${META_SAT_CHANNEL_LIST.getTitle()[lang]} ${META_SAT_CHANNEL_LIST.getDescription()[lang]}`;
  },
  getDescription() {
    return {
      [ELanguage.UA]:
        'Список доступних некодованих каналів, які ведуть мовлення з супутника',
      [ELanguage.EN]:
        'List of available unencrypted channels broadcast from satellite',
    };
  },
  images: {
    h1SatImage: {
      path: '/Images/satellites/',
      alternativeString: { title: '🛰', fontSize: '5rem' },
      height: '99px',
      width: '132px',
      alt: {
        [ELanguage.UA]: `Безкоштовні канали супутника`,
        [ELanguage.EN]: `Free channels of`,
      },
      defaultImage: {
        src: '/Images/satellite_7144.png',
        height: '99px',
        width: '132px',
      },
    },
    genreImage: {
      path: '/Images/genre/',
      height: '24px',
      width: '24px',
      altPre: {
        [ELanguage.UA]: 'Жанр:',
        [ELanguage.EN]: 'Genre:',
      },
    },
  },
};

export const META_ONLINE_CHANNEL_LIST = {
  ONLINE_CHANNEL_LIST_DB_ID: '16',
  metaH1: {
    [ELanguage.UA]: 'Телеканали онлайн',
    [ELanguage.EN]: 'Online TV channels',
  },
  getH1After(searchQuery: string) {
    return {
      [ELanguage.UA]: searchQuery
        ? ` назва яких містить «${searchQuery}»`
        : '.',
      [ELanguage.EN]: searchQuery
        ? ` the name of which contains «${searchQuery}»`
        : '.',
    };
  },
  metaTitle: {
    [ELanguage.UA]:
      'Телеканали онлайн. Дивитися безкоштовне телебачення у прямому ефірі.',
    [ELanguage.EN]: 'Online TV channels. Watch free TV live.',
  },
  metaDescription: {
    [ELanguage.UA]:
      'Дивіться онлайн телебачення безкоштовно. Обирайте канали, клікнувши на відповідний логотип. Онлайн телебачення розвивається швидко, відкриваючи нові можливості для перегляду улюблених каналів у високій якості без телевізійних антен.',
    [ELanguage.EN]:
      'Watch online television for free. Choose channels by clicking on the respective logo. Online television is advancing rapidly, offering new possibilities for viewing favorite channels in high quality without TV antennas.',
  },
  metaKeywords: {
    [ELanguage.UA]:
      'онлайн телебачення, безкоштовне телебачення, трансляція каналів, високоякісне телебачення, цифрове телебачення, онлайн-канали, телевізійні антени',
    [ELanguage.EN]:
      'online television, free television, channel streaming, high-quality television, digital television, online channels, TV antennas',
  },
  images: {
    h1Image: {
      src: '/Images/packages/Popcorn-icon.png',
      alternativeString: { title: '📺', fontSize: '7rem' },
      height: '128px',
      width: '128px',
      alt: {
        [ELanguage.UA]: `Дивитися телеканали онлайн`,
        [ELanguage.EN]: `Watch free TV live.`,
      },
    },
    genreImage: {
      path: '/Images/genre/',
      height: '24px',
      width: '24px',
      altPre: {
        [ELanguage.UA]: 'Жанр:',
        [ELanguage.EN]: 'Genre:',
      },
    },
  },
  linkChannel: {
    path: `/${EUrlBaseParam.ONLINE_CHANNEL_LIST}`,
    ariaLabel: {
      [ELanguage.UA]: 'Перейти до каналу',
      [ELanguage.EN]: 'Go to channel',
    },
  },
  fieldsetFilters: {
    legendText: {
      [ELanguage.UA]: 'Швидкий пошук',
      [ELanguage.EN]: 'Quick search',
    },
    anchorLink: {
      ariaLabel: {
        [ELanguage.UA]: 'Перейти до жанру:',
        [ELanguage.EN]: 'Go to genre:',
      },
      hrefStart: 'genre-',
    },
  },
};

export const META_PACKAGE_CHANNEL_LIST = {
  metaH1: {
    [ELanguage.UA]:
      'Пакети каналів цифрового супутникового та ефірного телебачення',
    [ELanguage.EN]: 'Digital satellite and television packages',
  },
  metaTitle: {
    [ELanguage.UA]: 'Пакети каналів',
    [ELanguage.EN]: 'TV channel packages',
  },
  metaDescription: {
    [ELanguage.UA]:
      'Пакети каналів цифрового супутникового та ефірного телебачення',
    [ELanguage.EN]: 'Digital satellite and television packages',
  },
  metaKeywords: {
    [ELanguage.UA]:
      'канали пакета без абонплати, віасат, viasat, xtra tv, t2, ua тв, ефірні',
    [ELanguage.EN]:
      'package channels without subscription, viasat, viasat, xtra tv, t2, ua tv, television',
  },
  packageImage: {
    path: '/Images/packages/',
    width: '100px',
    height: '86px',
    altPre: {
      [ELanguage.UA]: `Логотип до пакету:`,
      [ELanguage.EN]: `Logo for package:`,
    },
    defaultImg: {
      src: '/Images/channelsOptimized/zastavka.jpg',
      height: '100px',
      width: '100px',
    },
    alternativeStr: { title: '🎞', fontSize: '6rem' },
  },
  // linkChannel: {
  //   path: `/${EUrlBaseParam.ONLINE_CHANNEL_LIST}`,
  //   ariaLabel: {
  //     [ELanguage.UA]: 'Перейти до каналу',
  //     [ELanguage.EN]: 'Go to channel',
  //   },
  // },
};

export const META_ALL_SAT_CHANNEL_LIST = {
  CHANNEL_LIST_DB_ID: '4',
  getH1() {
    return {
      [ELanguage.UA]: 'Безкоштовні канали на популярних супутниках',
      [ELanguage.EN]: 'Free channels on popular satellites',
    };
  },
  getTitle() {
    return {
      [ELanguage.UA]: 'Безкоштовні канали. Частоти супутникових каналів',
      [ELanguage.EN]: 'Free channels. Satellite channel frequencies',
    };
  },
  getKeywords() {
    return {
      [ELanguage.UA]: `Безкоштовні канали Список каналів із програмою передач, доступних для вільного перегляду з найбільш популярних супутників без будь-яких зобов'язань та абонентської плати`,
      [ELanguage.EN]:
        'Free channels List of channels with program guides available for free viewing from the most popular satellites without any obligations or subscription fees',
    };
  },
  getDescription() {
    return {
      [ELanguage.UA]: `Список каналів із програмою передач, доступних для вільного перегляду з найбільш популярних супутників без будь-яких зобов'язань та абонентської плати`,
      [ELanguage.EN]:
        'List of channels with program guides available for free viewing from the most popular satellites without any obligations or subscription fees',
    };
  },
  anchors: {
    legendTitle: {
      [ELanguage.UA]: 'Швидке переміщення',
      [ELanguage.EN]: 'Fast moving',
    },
    goUpLink: {
      title: {
        [ELanguage.UA]: 'На початок',
        [ELanguage.EN]: 'Go to top',
      },
      img: '⇧',
    },
  },
  links: {
    satTitleLink: {
      tooltipTitle: {
        [ELanguage.UA]: 'Дивитись мапи покриття супутника',
        [ELanguage.EN]: 'See satellite coverage maps',
      },
      linkUrl: `/${EUrlBaseParam.SAT_COVERAGE_MAP}`,
    },
  },
  filtering: {
    satCheckBox: {
      tooltip: {
        [ELanguage.UA]: 'Обрати супутник',
        [ELanguage.EN]: 'Choose a satellite',
      },
    },
    satAnchor: {
      tooltip: {
        [ELanguage.UA]: 'Перейти до супутника',
        [ELanguage.EN]: 'Go to satellite',
      },
    },
    filterByChannelName: {
      placeholder: {
        [ELanguage.UA]: 'Назва каналу...',
        [ELanguage.EN]: 'Channel name...',
      },
      labelTitle: {
        [ELanguage.UA]: 'Фільтр каналів по назві',
        [ELanguage.EN]: 'Filter channels by name',
      },
      cancelBtnAriaLabel: {
        [ELanguage.UA]: 'Скасувати',
        [ELanguage.EN]: 'Cancel',
      },
      searchIconStr: '⏿',
    },
    resetAllFiltersButton: {
      ariaLabel: {
        [ELanguage.UA]: 'Скинути всі фільтри',
        [ELanguage.EN]: 'Reset All Filters',
      },
      imgStr: '⏻',
    },
    filterByChannelFormat: {
      formats: [
        {
          title: 'T2-MI',
          searchQueryName: EUrlSearchParam.CHANNEL_FORMAT_T2MI,
        },
        {
          title: 'MPEG-4, DVB-S2, HD, 4K(UHD)',
          searchQueryName: EUrlSearchParam.CHANNEL_FORMAT_MPG4,
        },
      ],
    },
  },
  image: {
    satTitleImgParams: {
      height: '60px',
      width: '80px',
    },
    h1ImageParams: {
      path: '/Images/packages/money_free.jpg',
      defaultImage: '/Images/satellite_7144.png',
      alternativeSymbol: '🛰',
      height: '150px',
      width: '239px',
      alt: {
        [ELanguage.UA]: 'Безкоштовні канали популярних супутників',
        [ELanguage.EN]: 'Free channels of popular satellites',
      },
    },
  },
};

export const START_CONTENT = {
  [ELanguage.UA]:
    'У наведеному списку показані ті канали, які транслюються без абонентської плати.',
  [ELanguage.EN]:
    'The list shows those channels that are broadcast without a subscription fee.',
};

export interface ISatChannelListEmptyModel {
  id: number;
  title: string;
  cpu: string;
  sat_title: string;
  sat_position: string;
  sat_logo: string;
  sat_slug: string;
  sat_grade: number;
  frequency: number;
  sat: number;
  tema: number;
  logo: string;
  programma: number;
  encryption: string;
  biss: string;
  description: string;
  freq: number;
  sr: number;
  fec: string;
  polar: string;
  beam: string;
  tem: string;
  compr: string;
  lan: string;
}

export interface IOnlineChannelListModel {
  id: number;
  title: string;
  cpu: string;
  genre: string;
  potok: string;
  tema: number;
  view: number;
  compress: number;
  logo: string;
  encryption: string;
  description: string;
  tem: string;
  compr: string;
  lan: string;
  tvforsite_net: string;
}

export interface IChannelPackagesModel {
  id: number;
  title: string;
  cpu: string;
  view: number;
  comment_count: number;
  logo: string;
  description: string;
}

export const MCompressionColors = new Map([
  ['MPEG-2', '#E9E3FD'],
  ['DEFAULT', '#E9E3FD'],
  ['T2-MI', '#f5b3cb'],
  ['MPEG-4', '#FFEDCA'],
  ['DVB-S2', '#FFEDCA'],
  ['HD', '#C5F9F7'],
  ['4K UHD', '#81e3f3'],
]);

export const MChanTheme = new Map([
  [1, 'public.png'],
  [2, 'news.png'],
  [3, 'cinema.png'],
  [4, 'sport.png'],
  [5, 'sunset.png'],
  [6, 'kids.png'],
  [7, 'xxx.png'],
  [8, 'music.png'],
  [9, 'discovery.png'],
  [10, 'comedy.png'],
  [11, 'game.png'],
  [12, 'religion.png'],
  [13, 'tv_shopping.png'],
  [14, 'fashion.png'],
]);
// 656D7D

export const CHANNEL_TOOLTIP_TITLES = {
  name: { [ELanguage.UA]: 'Назва', [ELanguage.EN]: 'Name' },
  genre: { [ELanguage.UA]: 'Жанр', [ELanguage.EN]: 'Genre' },
  language: { [ELanguage.UA]: 'Мова', [ELanguage.EN]: 'Language' },
  description: { [ELanguage.UA]: 'Опис', [ELanguage.EN]: 'Description' },
  compression: { [ELanguage.UA]: 'Формат', [ELanguage.EN]: 'Compression' },
};

export const ONLINE_CHANNEL_TOOLTIP_TITLES = {
  name: { [ELanguage.UA]: 'Назва', [ELanguage.EN]: 'Name' },
  language: { [ELanguage.UA]: 'Мова', [ELanguage.EN]: 'Language' },
  views: { [ELanguage.UA]: 'Переглядів', [ELanguage.EN]: 'Views:' },
  description: { [ELanguage.UA]: 'Опис', [ELanguage.EN]: 'Description' },
};
