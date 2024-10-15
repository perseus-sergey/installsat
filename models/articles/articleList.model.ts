import { ELanguage } from '../language.model';

export const WRONG_CAT_IDS = '(2,0,11,12,13)';

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
  images: {
    h1Image: {
      src: '/Images/articles/all_news_64.png',
      height: 64,
      width: 64,
      alt: {
        [ELanguage.UA]: 'Новини та статті про цифрове телебачення',
        [ELanguage.EN]: 'News and articles about digital television',
      },
    },
    titleImg: {
      src: '/Images/articles/package_network_4729.png',
      height: 32,
      width: 32,
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
      alt: {
        [ELanguage.UA]: 'Новини та статті про цифрове телебачення',
        [ELanguage.EN]: 'News and articles about digital television',
      },
    },
    titleImg: {
      src: '/Images/articles/package_network_4729.png',
      height: 32,
      width: 32,
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
