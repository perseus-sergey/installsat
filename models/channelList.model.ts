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
};

export const META_ALL_SAT_CHANNEL_LIST = {
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
    filterByChannelName: {
      placeholder: {
        [ELanguage.UA]: 'Назва каналу...',
        [ELanguage.EN]: 'Channel name...',
      },
      labelTitle: {
        [ELanguage.UA]: 'Фільтр каналів по назві',
        [ELanguage.EN]: 'Filter channels by name',
      },
      cancelButton: {
        ariaLabel: {
          [ELanguage.UA]: 'Скасувати',
          [ELanguage.EN]: 'Cancel',
        },
        searchIconStr: '⏿',
        imgStr: 'x',
      },
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

export const START_CONTENT = `У наведеному списку показані ті канали, які транслюються без абонентської плати.`;

const satChannelListEmptyModel = {
  id: -1,
  title: '',
  cpu: '',
  sat_title: '',
  sat_position: '',
  sat_logo: '',
  sat_slug: '',
  sat_grade: -1,
  frequency: -1,
  sat: -1,
  tema: -1,
  logo: '',
  programma: -1,
  encryption: '',
  biss: '',
  description: '',
  freq: -1,
  sr: -1,
  fec: '',
  polar: '',
  beam: '',
  tem: '',
  compr: '',
  lan: '',
};

export type TSatChannelListModel = typeof satChannelListEmptyModel;

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
