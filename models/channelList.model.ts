import { ELanguage } from './ui.model';
import { EUrlBaseParam, EUrlSearchParam } from './url.model';

export const CHANNEL_LIST_ANCHOR_START = 'genre-';

export const META_SAT_CHANNEL_LIST = {
  h1Start: {
    [ELanguage.UA]: `Список каналів з супутника`,
    [ELanguage.EN]: `List of channels from satellite`,
  },
  metaTitle: {
    [ELanguage.UA]: 'Список каналів супутника',
    [ELanguage.EN]: 'List of satellite channels',
  },
  metaDescription: {
    [ELanguage.UA]:
      'Список телевізійних і радіо каналів, які ведуть мовлення з супутника',
    [ELanguage.EN]:
      'List of television and radio channels that broadcast from the satellite',
  },
  images: {
    h1SatImage: {
      path: '/Images/satellites/',
      alternativeString: { title: '🛰', fontSize: '5rem' },
      height: 99,
      width: 132,
      alt: {
        [ELanguage.UA]: `Телевізійні і радіо канали супутника`,
        [ELanguage.EN]: `Television and radio channels broadcasted from the satellite`,
      },
      defaultImage: {
        src: '/Images/satellite_7144.png',
        height: 99,
        width: 132,
      },
    },
    h2SatListImage: {
      path: '/Images/satellites/',
      alternativeString: { title: '🛰', fontSize: '3rem' },
      height: 52.5,
      width: 70,
      alt: {
        [ELanguage.UA]: `Логотип супутника`,
        [ELanguage.EN]: `Logo of the satellite`,
      },
      defaultImage: {
        src: '/Images/satellite_7144.png',
        height: 52.5,
        width: 70,
      },
    },
    genreImage: {
      path: '/Images/genre/',
      height: 24,
      width: 24,
      altPre: {
        [ELanguage.UA]: 'Жанр:',
        [ELanguage.EN]: 'Genre:',
      },
    },
    genreRadioImage: {
      src: '/Images/genre/radio.png',
      height: 16,
      width: 16,
      alt: {
        [ELanguage.UA]: 'Radio',
        [ELanguage.EN]: 'Радіо',
      },
    },
    t2Image: {
      src: '/Images/t2_antenna_24.png',
      height: 24,
      width: 24,
      alt: {
        [ELanguage.UA]: 'Digital terrestrial television',
        [ELanguage.EN]: 'Цифрове ефірне телебачення',
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
      height: 128,
      width: 128,
      alt: {
        [ELanguage.UA]: `Дивитися телеканали онлайн`,
        [ELanguage.EN]: `Watch free TV live.`,
      },
    },
    genreImage: {
      path: '/Images/genre/',
      height: 24,
      width: 24,
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
    },
  },
};

export const META_PACKAGE_CHANNEL_LIST = {
  T2_SLUG: 't2-efir',
  getH1(packageName: string, searchQuery: string) {
    return {
      [ELanguage.UA]: `Список каналів телебачення «${packageName}»${searchQuery && ` назва яких містить «${searchQuery}»`}`,
      [ELanguage.EN]: `List of channels «${packageName}» TV${searchQuery && ` the name of which contains «${searchQuery}»`}`,
    };
  },
  metaTitle: {
    [ELanguage.UA]: 'Список каналів',
    [ELanguage.EN]: 'List of channels',
  },
  metaKeywords: {
    [ELanguage.UA]:
      'телебачення, трансляція каналів, високоякісне телебачення, цифрове, компанія, провайдер, пакет, телевізійні антени',
    [ELanguage.EN]:
      'television, channel streaming, high-quality television, digital, company, provider, package, TV antennas',
  },
  images: {
    h1Image: {
      path: '/Images/packages/',
      height: 120,
      width: 132,
      alternativeImgStr: { title: '💠', fontSize: '7rem' },
      defaultImage: {
        src: '/Images/1not_found_chan.png',
        height: 100,
        width: 120,
      },
      alt: {
        [ELanguage.UA]: `Логотип компанії`,
        [ELanguage.EN]: `Company logo`,
      },
    },
    subCatImage: {
      path: '/Images/packages/',
      height: 82,
      width: 82,
      altPre: {
        [ELanguage.UA]: 'Пакет:',
        [ELanguage.EN]: 'Package:',
      },
      alternativeImgStr: { title: '🌀', fontSize: '5rem' },
    },
  },
  linkChannel: {
    ariaLabel: {
      [ELanguage.UA]: 'Деталі каналу',
      [ELanguage.EN]: 'Channel details',
    },
  },
  fieldsetFilters: {
    legendText: {
      [ELanguage.UA]: 'Швидкий пошук',
      [ELanguage.EN]: 'Quick search',
    },
    anchorLink: {
      ariaLabel: {
        [ELanguage.UA]: 'Перейти до пакету:',
        [ELanguage.EN]: 'Go to package:',
      },
    },
  },
  getPriceString(price: number) {
    return {
      [ELanguage.UA]: `Вартість пакету ${price} грн/міс`,
      [ELanguage.EN]: `Package price ${price} UAH/month`,
    };
  },
  similarLinks: {
    title: {
      [ELanguage.UA]: 'Корисні посилання:',
      [ELanguage.EN]: 'Useful links:',
    },
    beforeLinkText: {
      [ELanguage.UA]: 'Пакет каналів',
      [ELanguage.EN]: 'Channel package',
    },
  },
};

export const META_PACKAGES = {
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
    width: 100,
    height: 86,
    altPre: {
      [ELanguage.UA]: `Логотип до пакету:`,
      [ELanguage.EN]: `Logo for package:`,
    },
    defaultImg: {
      src: '/Images/channelsOptimized/zastavka.jpg',
      height: 100,
      width: 100,
    },
    alternativeStr: { title: '🎞', fontSize: '6rem' },
  },
};

export const META_ALL_SAT_CHANNEL_LIST = {
  CHANNEL_LIST_DB_ID: '4',
  metaH1: {
    [ELanguage.UA]: 'Підбір каналів за параметрами з доступних супутників',
    [ELanguage.EN]: 'Channel selection by parameters with available satellites',
  },
  metaTitle: {
    [ELanguage.UA]: 'Таблиці частот супутникових каналів',
    [ELanguage.EN]: 'Frequency tables of satellite channels',
  },
  metaKeywords: {
    [ELanguage.UA]: `Безкоштовні канали Список із програмою передач, доступних для вільного перегляду з найбільш популярних супутників без будь-яких зобов'язань та абонентської плати кодовані платні радіо DVB-T2 DVB-S DVB-S2 MPEG-2 MPEG-4 частоти напрямок вибір мови аудіо`,
    [ELanguage.EN]:
      'Free channels List with a program of programs available for free viewing from the most popular satellites without any obligations and subscription fees encoded paid radio DVB-T2 DVB-S DVB-S2 MPEG-2 MPEG-4 frequencies direction language selection audio',
  },
  metaDescription: {
    [ELanguage.UA]: `Список телевізійних і радіо каналів, доступних для вільного перегляду без будь-яких зобов'язань та абонентської плати, а також платних каналів з всіх доступних супутників.`,
    [ELanguage.EN]: `List of television and radio channels available for free viewing without any obligations and subscription fees, as well as paid channels from all available satellites.`,
  },
  anchors: {
    legendTitle: {
      [ELanguage.UA]: 'Фільтри',
      [ELanguage.EN]: 'Filtering',
    },
    goUpLink: {
      title: {
        [ELanguage.UA]: 'На початок',
        [ELanguage.EN]: 'Go Up',
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
    filterByChannelFormatFly: {
      formats: [
        {
          title: {
            [ELanguage.EN]: 'C-band (frequencies up to 10,700 MHz)',
            [ELanguage.UA]: 'C-діапазон (частоти до 10,700 МГц)',
          },
          searchQueryName: EUrlSearchParam.CHANNEL_C_BAND,
        },
        {
          title: {
            [ELanguage.EN]: 'Only UNENCRYPTED channels',
            [ELanguage.UA]: 'Тільки НЕ КОДОВАНІ канали',
          },
          searchQueryName: EUrlSearchParam.CHANNEL_NOT_ENCRYPTED,
        },
        {
          title: {
            [ELanguage.EN]: 'Radio channels',
            [ELanguage.UA]: 'Радіо канали',
          },
          searchQueryName: EUrlSearchParam.CHANNEL_RADIO,
        },
        {
          title: {
            [ELanguage.UA]: 'DVB-T2',
            [ELanguage.EN]: 'DVB-T2',
          },
          searchQueryName: EUrlSearchParam.CHANNEL_FORMAT_T2MI,
        },
      ],
    },
  },
  image: {
    h1ImageParams: {
      path: '/Images/packages/money_free.jpg',
      defaultImage: '/Images/satellite_7144.png',
      alternativeSymbol: '🛰',
      height: 150,
      width: 239,
      alt: {
        [ELanguage.UA]: 'Безкоштовні канали популярних супутників',
        [ELanguage.EN]: 'Free channels of popular satellites',
      },
    },
    h1FlyImageParams: {
      path: '/Images/packages/database.png',
      defaultImage: '/Images/satellite_7144.png',
      alternativeSymbol: '🛰',
      height: 128,
      width: 128,
      alt: {
        [ELanguage.UA]: 'Вибір списку каналів за налаштуваннями',
        [ELanguage.EN]: 'Choose list of channels based on settings',
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

export interface ISatChannelListModel {
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
  genre_description: string;
  compr: string;
  lan: string;
  canonical: string;
  cat_parent_title: string;
  category: number;
}

export interface IEditChannelListModel {
  id: number;
  title: string;
  cpu: string;
  sat_title: string;
  sat_position: string;
  frequency: number;
  compr: string;
  canonical: string;
  cat_parent_title: string;
  category: number;
}
export interface IChannelListModel {
  chan_id: number;
  chan_title: string;
  chan_cpu: string;
  chan_logo: string;
  chan_description: string;
  genre_id: number;
  genre_title: string;
  genre_description: string;
  lan: string;
}

export interface IOnlineChannelListModel extends IChannelListModel {
  potok: string;
  view: number;
  compress: number;
  encryption: string;
  compr: string;
  tvforsite_net: string;
  cat_slug: string;
}
export interface IPackageChannelListModel extends IChannelListModel {
  cat_id: number;
  cat_title: string;
  cat_slug: string;
  cat_logo: string;
  cat_description: string;
  cat_view: number;
  genre_slug: string;
  genre_h1: string;
  genre_logo: string;
  price: number;
  h1: string;
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
  ['MPEG-4/1SEG', '#FFEDCA'],
  ['DVB-S2', '#FFEDCA'],

  ['HD', '#C5F9F7'],
  ['MPEG-4/HD', '#C5F9F7'],
  ['HEVC', '#C5F9F7'],
  ['HEVC/HD', '#C5F9F7'],

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
// #656D7D

export enum ECompressColors {
  MPEG_2 = '#c5f9f7',
  MPEG_2_S2 = '#caffd3',
  MPEG_4 = '#daffca',
  T2_MI = '#e9e3fd',
  UHD = '#81e37aeefff3',
  HD = '#91fffd',
}

export const getCompressColor = (
  compress: string,
  modeList: string[],
  t2Stream: string | null
) => {
  if (t2Stream) return ECompressColors.T2_MI;

  const compressLower = compress.toLowerCase();

  if (compressLower.includes('4k') || compressLower.includes('uhd'))
    return ECompressColors.UHD;
  if (compressLower.includes('hd') || compressLower.includes('hevc'))
    return ECompressColors.HD;
  if (compressLower.startsWith('mpeg-4')) return ECompressColors.MPEG_4;

  for (const mode of modeList) {
    if (mode.toLowerCase().includes('dvb-s2')) return ECompressColors.MPEG_2_S2;
  }

  return ECompressColors.MPEG_2;
};

export const isFtaChannel = (codes: string[]) => {
  if (codes.length === 1 && !codes[0]) return true;

  for (const code of codes) {
    const lowerCode = code.toLowerCase();
    if (lowerCode === 'biss' || lowerCode === 'fta') {
      return true;
    }
  }

  return false;
};

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
