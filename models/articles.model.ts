import { ELanguage } from './ui.model';
import { z } from 'zod';

export const DEFAULT_ARTICLE_LOGO_NAME = 'zastavka.jpg';
export const DEFAULT_ARTICLE_LOGO_PATH = `/Images/channelsOptimized/${DEFAULT_ARTICLE_LOGO_NAME}`;

export const ARTICLE_CARD = {
  images: {
    h1Image: {
      path: '/Images/channelsOptimized/',
      height: 100,
      width: 120,
      defaultImg: {
        src: DEFAULT_ARTICLE_LOGO_PATH,
        height: 100,
        width: 100,
      },
      alternativeStr: { title: '🎞', fontSize: '6rem' },
      altStart: {
        [ELanguage.UA]: `Логотип до статті:`,
        [ELanguage.EN]: `Logo for article:`,
      },
    },
  },
};

export const META_ALL_ARTICLES = {
  h1Start: {
    [ELanguage.UA]: `Останні новини ТБ, статті та огляди на`,
    [ELanguage.EN]: `Latest TV news, articles and reviews as of`,
  },
  title: {
    [ELanguage.UA]: 'Останні новини та статті про цифрове телебачення',
    [ELanguage.EN]: 'Latest news and articles about digital television',
  },
  description: {
    [ELanguage.UA]:
      'Список статей про новини в сфері цифрового телебачення, статей про налаштування обладнання для прийому та перегляду телевізійних та радіо каналів, статей про новини від провайдерів платного телебачення',
    [ELanguage.EN]:
      'List of articles about news in the field of digital television, articles about setting up equipment for receiving and viewing tv and radio channels, articles about news from pay TV providers',
  },
};

export const ARTICLE_LIST_MODEL = {
  search: {
    placeholder: {
      [ELanguage.UA]: 'Пошук статті...',
      [ELanguage.EN]: 'Search article...',
    },
    labelTitle: {
      [ELanguage.UA]: 'Шукати статті по назві та опису',
      [ELanguage.EN]: 'Search articles by title and description...',
    },
  },
  images: {
    h1Image: {
      src: '/Images/articles/all_news_64.png',
      height: 64,
      width: 64,
      alternativeStr: { title: '📰', fontSize: '6rem' },
      alt: {
        [ELanguage.UA]: 'Новини та статті про цифрове телебачення',
        [ELanguage.EN]: 'News and articles about digital television',
      },
    },
    titleImg: {
      src: '/Images/articles/package_network_4729.png',
      height: 32,
      width: 32,
      alternativeStr: { title: '🌎', fontSize: '2rem' },
    },
  },
  articlesCountCaption: {
    [ELanguage.EN]: 'Number of articles found: ',
    [ELanguage.UA]: 'Кількість знайдених статей: ',
  },
};

export const ARTICLE_PAGINATION_PARAMS = {
  perPage: 20,
  offsetNumber: 3,
  firstPageTitle: '<<',
  lastPageTitle: '>>',
  previousPageTitle: '<',
  nextPageTitle: '>',
  linkTitle: {
    currentPage: {
      [ELanguage.UA]: 'Зараз ви на сторінці: ',
      [ELanguage.EN]: 'You are now on page: ',
    },
    pageStartStr: {
      [ELanguage.UA]: 'Перейти на сторінку: ',
      [ELanguage.EN]: 'Go to page: ',
    },
    firstPage: {
      [ELanguage.UA]: 'Перейти на першу сторінку',
      [ELanguage.EN]: 'Go to first page',
    },
    nextPage: {
      [ELanguage.UA]: 'Перейти на наступну сторінку',
      [ELanguage.EN]: 'Go to next page',
    },
    previousPage: {
      [ELanguage.UA]: 'Перейти на попередню сторінку',
      [ELanguage.EN]: 'Go to previous page',
    },
    lastPage: {
      [ELanguage.UA]: 'Перейти на останню сторінку',
      [ELanguage.EN]: 'Go to last page',
    },
  },
};

export const SINGLE_CAT_ARTICLE_LIST_IMAGES = {
  images: {
    h1Image: {
      src: '/Images/articles/all_news_64.png',
      height: 64,
      width: 64,
      alternativeStr: { title: '📰', fontSize: '6rem' },
      alt: {
        [ELanguage.UA]: 'Новини та статті про цифрове телебачення',
        [ELanguage.EN]: 'News and articles about digital television',
      },
    },
    titleImg: {
      src: '/Images/articles/package_network_4729.png',
      height: 32,
      width: 32,
      alternativeStr: { title: '🌎', fontSize: '2rem' },
    },
  },
};

export const INFO_PANEL_TITLES = {
  theme: { [ELanguage.UA]: 'Тема', [ELanguage.EN]: 'Theme' },
  views: { [ELanguage.UA]: 'Переглядів', [ELanguage.EN]: 'Views' },
  date: { [ELanguage.UA]: 'Дата', [ELanguage.EN]: 'Date' },
  comments: { [ELanguage.UA]: 'Коментарів', [ELanguage.EN]: 'Comments' },
};

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
    allMaps: {
      h1Image: {
        src: '/Images/articles/signal-satellite.png',
        height: 128,
        width: 128,
        alternativeStr: { title: '🗺', fontSize: '8rem' },
        alt: {
          [ELanguage.UA]: 'Карти покриття телевізійних супутників',
          [ELanguage.EN]: 'Satellite coverage maps',
        },
      },
      titleImg: {
        src: '/Images/articles/package_network_4729.png',
        height: 32,
        width: 32,
        alternativeStr: { title: '🌎', fontSize: '2rem' },
      },
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
      path: '/Images/satellites/',
      height: 100,
      width: 140,
      defaultImg: {
        src: DEFAULT_ARTICLE_LOGO_PATH,
        height: 100,
        width: 100,
      },
      alternativeStr: { title: '🎞', fontSize: '6rem' },
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
      alternativeStr: { title: '🗺', fontSize: '20rem' },
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

export interface IAllNewsModel {
  id: number;
  cat: number;
  title: string;
  title_en?: string;
  description_en?: string;
  cpu: string;
  description: string;
  date: Date;
  date_upd: Date;
  author: string;
  logo: string;
  view: number;
  comment_count: number | null;
  total_count: number;
  category_title: string;
  category_title_en: string;
  category_cpu: string;
}

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

export interface ISingleCatArticlesModel {
  id: number;
  title: string;
  description: string;
  title_en: string;
  description_en: string;
  cpu: string;
  text: string;
  text_en: string;
}

export interface ISimilarArticleModel {
  id: number;
  title: string;
  title_en: string;
  cpu: string;
  date: Date;
}

export interface IArticleModel {
  id: number;
  title: string;
  slug: string;
  date: Date;
  description: string;
  text: string;
  author: string;
  cat_id: number;
  view: number;
  logo: string;
  cat_name: string;
  cat_name_en: string;
  cat_slug: string;
  cat_folder: string;
  title_en: string;
  original_slug: string;
  description_en: string;
  keywords: string;
  keywords_en: string;
  text_en: string;
}

export enum EArticleEditFields {
  logo = 'logo',
  source = 'source',
  title = 'title',
  cpu = 'cpu',
  description = 'description',
  text = 'text',
  author = 'author',
  date = 'date',
  cat = 'cat',
  folder = 'folder',
  title_en = 'title_en',
  original_slug = 'original_slug',
  description_en = 'description_en',
  keywords = 'keywords',
  keywords_en = 'keywords_en',
  text_en = 'text_en',
}

const optionalOrMinString = (minNum: number) =>
  z
    .string()
    .trim()
    .max(0, `String must contains 0 OR > ${minNum - 1} characters`)
    .or(z.string().trim().min(minNum))
    .optional();

export const editArticleSchema = z.object({
  [EArticleEditFields.logo]: optionalOrMinString(2),
  [EArticleEditFields.source]: optionalOrMinString(2),
  [EArticleEditFields.title]: z.string().min(2).trim(),
  [EArticleEditFields.cpu]: z.string().min(2).trim(),
  [EArticleEditFields.description]: z.string().min(5).trim(),
  [EArticleEditFields.text]: z.string().min(15).trim(),
  [EArticleEditFields.author]: optionalOrMinString(2),
  [EArticleEditFields.date]: z.coerce.date(),
  [EArticleEditFields.cat]: z.coerce.number(),
  [EArticleEditFields.folder]: optionalOrMinString(2),
  [EArticleEditFields.title_en]: optionalOrMinString(2),
  [EArticleEditFields.original_slug]: z.string().trim().optional(),
  [EArticleEditFields.description_en]: optionalOrMinString(5),
  [EArticleEditFields.keywords]: optionalOrMinString(5),
  [EArticleEditFields.keywords_en]: optionalOrMinString(5),
  [EArticleEditFields.text_en]: optionalOrMinString(15),
});
export type TArticleTableModel = z.input<typeof editArticleSchema>;

export interface IArticleCategory {
  id: number;
  title: string;
}
