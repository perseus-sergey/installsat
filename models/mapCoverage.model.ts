import { DEFAULT_ARTICLE_LOGO_PATH } from './ui/image.model';
import { ELanguage } from './language.model';

export const META_ALL_SAT_MAPS_MODEL = {
  metaTitle: {
    [ELanguage.UA]: 'Карти покриття супутників',
    [ELanguage.EN]: 'Satellite coverage maps',
  },
  metaDescription: {
    [ELanguage.UA]:
      'Карти покриття телевізійних супутників на території Європи та ближньої Азії',
    [ELanguage.EN]:
      'Satellite coverage maps of television satellites in Europe and the Far East',
  },
  metaKeywords: {
    [ELanguage.UA]:
      'Карти покриття телевізійні супутники територія Європа Азії промінь напрямок сигнал',
    [ELanguage.EN]:
      'Coverage maps television satellites territory Europe Asia beam direction signal',
  },
  makePostDescription(satTitle: string) {
    return {
      [ELanguage.UA]: `Карта покриття телевізійного супутника ${satTitle} на території країн Європи та ближньої азії.`,
      [ELanguage.EN]: `Coverage map of the ${satTitle} television satellite in Europe and Middle Asia`,
    };
  },
  images: {
    h1ImageAlt: {
      [ELanguage.UA]:
        'Зображення телевізійного супутника, транслюючого сигнал на Землю',
      [ELanguage.EN]:
        'An image of a television satellite broadcasting a signal to Earth',
    },
  },
};

export const META_SINGLE_SAT_MAP = {
  metaTitle: {
    [ELanguage.UA]: 'Карта покриття супутника',
    [ELanguage.EN]: 'Satellite coverage map',
  },
  getDescription(satTitle: string) {
    return {
      [ELanguage.UA]: `Детальна карта покриття телевізійного супутника ${satTitle} на території Європейських та Близькосхідних країн Євразії.`,
      [ELanguage.EN]: `Detailed coverage map of the ${satTitle} television satellite in Europe and the Far East.`,
    };
  },
  getH1(satTitle: string) {
    return {
      [ELanguage.UA]: `Супутник ${satTitle}. Карти покриття країн Європи та ближньої Азії`,
      [ELanguage.EN]: `${satTitle} satellite. Coverage maps of Europe and Middle Asia`,
    };
  },
  metaKeywords: {
    [ELanguage.UA]:
      'карта покриття телевізійний супутник тв промінь Європа Азія',
    [ELanguage.EN]: 'coverage map television satellite TV beam Europe Asia',
  },
  h2Start: {
    [ELanguage.UA]: 'Промінь:',
    [ELanguage.EN]: 'Beam:',
  },
};

export const SINGLE_SAT_MAP_DATA = {
  images: {
    h1Image: {
      currentImg: {
        path: '/Images/satellites/',
        height: 100,
        width: 140,
      },
      defaultImg: {
        src: DEFAULT_ARTICLE_LOGO_PATH,
        height: 100,
        width: 100,
      },
      altStart: {
        [ELanguage.UA]: `Логотип до статті:`,
        [ELanguage.EN]: `Logo for article:`,
      },
    },

    mapParams: {
      path: '/Images/News/setting_eqp/maps/',
      height: 350,
      width: 600,
      getAlt(satTitle: string, beamTitle: string) {
        return {
          [ELanguage.UA]: `Карта покриття телевізійного супутника ${satTitle}. Промінь ${beamTitle}`,
          [ELanguage.EN]: `Coverage map of the ${satTitle} television satellite. Beam ${beamTitle}`,
        };
      },
    },

    bigMapParams: {
      path: '/Images/News/setting_eqp/maps/big_',
      height: 630,
      width: 1000,
    },
  },
  similar: {
    similarTitle: {
      [ELanguage.UA]: 'До уваги',
      [ELanguage.EN]: 'To note',
    },
    similarStart: {
      [ELanguage.UA]: 'Список доступних телеканалів супутника',
      [ELanguage.EN]: 'List of available television channels from',
    },
  },
};

export interface IAllMapsModel {
  id: number;
  title: string;
  cpu: string;
  description: string;
  logo: string;
  view: number;
  beam_id: number;
  position: string;
  comment_count: number | null;
}

export interface IMapModel {
  sat_id: number;
  sat_title: string;
  position: string;
  logo: string;
  view: number;
  beam_title: string;
  beam_description: string;
  beam_slug: string;
  map_img: string;
  grade: string;
}
