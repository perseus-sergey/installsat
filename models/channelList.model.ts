import { ILang } from './ui.model';
import { EUrlBaseParam } from './url.model';

export const META_SAT_CHANNEL_LIST = {
  getH1(satTitle: string) {
    return {
      ua: `Безкоштовні канали з супутника ${satTitle}`,
      en: `Free satellite channels on ${satTitle}`,
    };
  },
  getTitle() {
    return {
      ua: 'Список каналів супутника',
      en: 'List of satellite channels',
    };
  },
  getKeywords(lang: keyof ILang) {
    return `${META_SAT_CHANNEL_LIST.getTitle()[lang]} ${META_SAT_CHANNEL_LIST.getDescription()[lang]}`;
  },
  getDescription() {
    return {
      ua: 'Список доступних некодованих каналів, які ведуть мовлення з супутника',
      en: 'List of available unencrypted channels broadcast from satellite',
    };
  },
  h1SatImage: {
    path: '/Images/satellites/',
    alternativeString: { title: '🛰', fontSize: '5rem' },
    height: '99px',
    width: '132px',
    alt: {
      ua: `Безкоштовні канали супутника`,
      en: `Free channels of`,
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
      ua: 'Безкоштовні канали на популярних супутниках',
      en: 'Free channels on popular satellites',
    };
  },
  getTitle() {
    return {
      ua: 'Безкоштовні канали. Частоти супутникових каналів',
      en: 'Free channels. Satellite channel frequencies',
    };
  },
  getKeywords() {
    return {
      ua: `Безкоштовні канали Список каналів із програмою передач, доступних для вільного перегляду з найбільш популярних супутників без будь-яких зобов'язань та абонентської плати`,
      en: 'Free channels List of channels with program guides available for free viewing from the most popular satellites without any obligations or subscription fees',
    };
  },
  getDescription() {
    return {
      ua: `Список каналів із програмою передач, доступних для вільного перегляду з найбільш популярних супутників без будь-яких зобов'язань та абонентської плати`,
      en: 'List of channels with program guides available for free viewing from the most popular satellites without any obligations or subscription fees',
    };
  },
  anchors: {
    legendTitle: {
      ua: 'Швидке переміщення',
      en: 'Fast moving',
    },
    goUpLink: {
      title: {
        ua: 'На початок',
        en: 'Go to top',
      },
      img: '⇧',
    },
  },
  links: {
    satTitleLink: {
      tooltipTitle: {
        ua: 'Дивитись мапи покриття супутника',
        en: 'See satellite coverage maps',
      },
      linkUrl: `/${EUrlBaseParam.SAT_COVERAGE_MAP}`,
    },
  },
  filtering: {
    filterByChannelName: {
      placeholder: {
        ua: 'Назва каналу...',
        en: 'Channel name...',
      },
      labelTitle: {
        ua: 'Фільтр каналів по назві',
        en: 'Filter channels by name',
      },
      cancelButton: {
        ariaLabel: {
          ua: 'Скасувати',
          en: 'Cancel',
        },
        searchIconStr: '⏿',
        imgStr: 'x',
      },
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
        ua: 'Безкоштовні канали популярних супутників',
        en: 'Free channels of popular satellites',
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
  name: { ua: 'Назва', en: 'Name' },
  genre: { ua: 'Жанр', en: 'Genre' },
  language: { ua: 'Мова', en: 'Language' },
  description: { ua: 'Опис', en: 'Description' },
  compression: { ua: 'Формат', en: 'Compression' },
};
