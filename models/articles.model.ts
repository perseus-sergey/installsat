import { ELanguage } from './ui.model';
import { EUrlBaseParam } from './url.model';
import { z } from 'zod';

export const ARTICLES = {
  article: {
    images: {
      h1Image: {
        path: '/Images/channelsOptimized/',
        height: 100,
        width: 120,
        defaultImg: {
          src: '/Images/channelsOptimized/zastavka.jpg',
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
  },
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
  articleList: {
    meta: {
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
    links: {
      articleLink: {
        path: `/${EUrlBaseParam.ARTICLE}/`,
      },
    },
    pagination: {
      perPage: 20,
      offsetNumber: 3,
      firstPageTitle: '<<',
      lastPageTitle: '>>',
      previousPageTitle: '<',
      nextPageTitle: '>',
      linkTitle: {
        pageStartStr: {
          [ELanguage.EN]: 'To page: ',
          [ELanguage.UA]: 'На сторінку: ',
        },
        firstPage: {
          [ELanguage.EN]: 'To first page',
          [ELanguage.UA]: 'На першу сторінку',
        },
        nextPage: {
          [ELanguage.EN]: 'To next page',
          [ELanguage.UA]: 'На наступну сторінку',
        },
        previousPage: {
          [ELanguage.EN]: 'To previous page',
          [ELanguage.UA]: 'На попередню сторінку',
        },
        lastPage: {
          [ELanguage.EN]: 'To last page',
          [ELanguage.UA]: 'На останню сторінку',
        },
      },
    },
    articlesCountCaption: {
      [ELanguage.EN]: 'Number of articles found: ',
      [ELanguage.UA]: 'Кількість знайдених статей: ',
    },
  },
  articleSingleCatList: {
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
    links: {
      articleLink: {
        path: `/${EUrlBaseParam.ARTICLE}/`,
      },
    },
  },
  infoPanelTitles: {
    theme: { [ELanguage.UA]: 'Тема', [ELanguage.EN]: 'Theme' },
    views: { [ELanguage.UA]: 'Переглядів', [ELanguage.EN]: 'Views' },
    date: { [ELanguage.UA]: 'Дата', [ELanguage.EN]: 'Date' },
    comments: { [ELanguage.UA]: 'Коментарів', [ELanguage.EN]: 'Comments' },
  },
};

export const SAT_MAPS_MODEL = {
  metaAllMaps: {
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
  },
  metaSingleMap: {
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
    singleMap: {
      h1Image: {
        path: '/Images/satellites/',
        height: 100,
        width: 140,
        defaultImg: {
          src: '/Images/channelsOptimized/zastavka.jpg',
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
  },
};

export interface IAllNewsModel {
  id: number;
  cat: number;
  title: string;
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
}

export interface ISingleCatArticlesModel {
  id: number;
  title: string;
  description: string;
  cpu: string;
  text: string;
}

export interface ISimilarArticleModel {
  id: number;
  title: string;
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
  cat_slug: string;
  cat_folder: string;
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
}
export const editArticleSchema = z.object({
  [EArticleEditFields.logo]: z.string().trim().optional(),
  [EArticleEditFields.source]: z.string().trim().optional(),
  [EArticleEditFields.title]: z.string().min(2).trim(),
  [EArticleEditFields.cpu]: z.string().min(2).trim(),
  [EArticleEditFields.description]: z.string().min(2).trim(),
  [EArticleEditFields.text]: z.string().min(2).trim(),
  [EArticleEditFields.author]: z.string().trim().optional(),
  [EArticleEditFields.date]: z.coerce.date(),
  [EArticleEditFields.cat]: z.coerce.number(),
  [EArticleEditFields.folder]: z.string().trim().optional(),
});
export type TArticleTableModel = z.infer<typeof editArticleSchema>;
