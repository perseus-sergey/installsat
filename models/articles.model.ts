import { ILang } from './ui.model';
import { EUrlBaseParam } from './url.model';

export const ARTICLES = {
  article: {
    meta: {
      getTitle() {
        return {
          ua: 'Останні новини та статті про цифрове телебачення',
          en: 'Latest news and articles about digital television',
        };
      },
      getKeywords(lang: keyof ILang) {
        return `${this.getDescription()[lang]}`;
      },
      getDescription() {
        return {
          ua: 'Список статей про новини в сфері цифрового телебачення, статей про налаштування обладнання для прийому та перегляду телевізійних та радіо каналів, статей про новини від провайдерів платного телебачення',
          en: 'List of articles about news in the field of digital television, articles about setting up equipment for receiving and viewing tv and radio channels, articles about news from pay TV providers',
        };
      },
    },
    images: {
      h1Image: {
        path: '/Images/channelsOptimized/',
        height: '100px',
        width: '140px',
        defaultImg: {
          src: '/Images/channelsOptimized/zastavka.jpg',
          height: '100px',
          width: '100px',
        },
        alternativeStr: { title: '🎞', fontSize: '6rem' },
        getAlt() {
          return {
            ua: `Логотип до статті: `,
            en: `Logo for article: `,
          };
        },
      },
    },
  },
  articleList: {
    meta: {
      getH1(date: string) {
        return {
          ua: `Останні новини ТБ, статті та огляди на ${date}`,
          en: `Latest TV news, articles and reviews as of ${date}`,
        };
      },
      getTitle() {
        return {
          ua: 'Останні новини та статті про цифрове телебачення',
          en: 'Latest news and articles about digital television',
        };
      },
      getKeywords(lang: keyof ILang) {
        return `${this.getDescription()[lang]}`;
      },
      getDescription() {
        return {
          ua: 'Список статей про новини в сфері цифрового телебачення, статей про налаштування обладнання для прийому та перегляду телевізійних та радіо каналів, статей про новини від провайдерів платного телебачення',
          en: 'List of articles about news in the field of digital television, articles about setting up equipment for receiving and viewing tv and radio channels, articles about news from pay TV providers',
        };
      },
    },
    images: {
      h1Image: {
        src: '/Images/articles/all_news_64.png',
        height: '64px',
        width: '64px',
        alternativeStr: { title: '📰', fontSize: '6rem' },
        alt: {
          ua: 'Новини та статті про цифрове телебачення',
          en: 'News and articles about digital television',
        },
      },
      titleImg: {
        src: '/Images/articles/package_network_4729.png',
        height: '32px',
        width: '32px',
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
          en: 'To page: ',
          ua: 'На сторінку: ',
        },
        firstPage: {
          en: 'To first page',
          ua: 'На першу сторінку',
        },
        nextPage: {
          en: 'To next page',
          ua: 'На наступну сторінку',
        },
        previousPage: {
          en: 'To previous page',
          ua: 'На попередню сторінку',
        },
        lastPage: {
          en: 'To last page',
          ua: 'На останню сторінку',
        },
      },
    },
    articlesCountCaption: {
      en: 'Number of articles in this category: ',
      ua: 'Кількість статей в цієї категорії: ',
    },
  },
  articleSingleCatList: {
    meta: {
      getH1(date: string, title: string) {
        return {
          ua: `${title} на ${date}`,
          en: `${title} as of ${date}`,
        };
      },
    },
    images: {
      h1Image: {
        src: '/Images/articles/all_news_64.png',
        height: '64px',
        width: '64px',
        alternativeStr: { title: '📰', fontSize: '6rem' },
        alt: {
          ua: 'Новини та статті про цифрове телебачення',
          en: 'News and articles about digital television',
        },
      },
      titleImg: {
        src: '/Images/articles/package_network_4729.png',
        height: '32px',
        width: '32px',
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
    theme: { ua: 'Тема', en: 'Theme' },
    views: { ua: 'Переглядів', en: 'Views' },
    date: { ua: 'Дата', en: 'Date' },
    comments: { ua: 'Коментарів', en: 'Comments' },
  },
};

// export const START_CONTENT = `У наведеному списку показані ті канали, які транслюються без абонентської плати.`;

export interface IAllNewsModel {
  id: number;
  cat: number;
  title: string;
  cpu: string;
  description: string;
  date: Date;
  author: string;
  logo: string;
  view: number;
  comment_count: number | null;
  total_count: number;
  category_title: string;
  category_cpu: string;
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

export interface ICommentsModel {
  post: number;
  author: string;
  parent_id: number;
  mail: string;
  text: string;
  date: Date;
  ip: string;
  country: string;
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
