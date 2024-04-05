import { ELanguage, ILang } from './ui.model';
import { EUrlBaseParam } from './url.model';

export const ARTICLES = {
  article: {
    meta: {
      getTitle() {
        return {
          [ELanguage.UA]: 'Останні новини та статті про цифрове телебачення',
          [ELanguage.EN]: 'Latest news and articles about digital television',
        };
      },
      getKeywords(lang: keyof ILang) {
        return `${this.getDescription()[lang]}`;
      },
      getDescription() {
        return {
          [ELanguage.UA]:
            'Список статей про новини в сфері цифрового телебачення, статей про налаштування обладнання для прийому та перегляду телевізійних та радіо каналів, статей про новини від провайдерів платного телебачення',
          [ELanguage.EN]:
            'List of articles about news in the field of digital television, articles about setting up equipment for receiving and viewing tv and radio channels, articles about news from pay TV providers',
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
            [ELanguage.UA]: `Логотип до статті: `,
            [ELanguage.EN]: `Logo for article: `,
          };
        },
      },
    },
  },
  articleList: {
    meta: {
      getH1(date: string) {
        return {
          [ELanguage.UA]: `Останні новини ТБ, статті та огляди на ${date}`,
          [ELanguage.EN]: `Latest TV news, articles and reviews as of ${date}`,
        };
      },
      getTitle() {
        return {
          [ELanguage.UA]: 'Останні новини та статті про цифрове телебачення',
          [ELanguage.EN]: 'Latest news and articles about digital television',
        };
      },
      getKeywords(lang: keyof ILang) {
        return `${this.getDescription()[lang]}`;
      },
      getDescription() {
        return {
          [ELanguage.UA]:
            'Список статей про новини в сфері цифрового телебачення, статей про налаштування обладнання для прийому та перегляду телевізійних та радіо каналів, статей про новини від провайдерів платного телебачення',
          [ELanguage.EN]:
            'List of articles about news in the field of digital television, articles about setting up equipment for receiving and viewing tv and radio channels, articles about news from pay TV providers',
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
          [ELanguage.UA]: 'Новини та статті про цифрове телебачення',
          [ELanguage.EN]: 'News and articles about digital television',
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
    meta: {
      getH1(date: string, title: string) {
        return {
          [ELanguage.UA]: `${title} на ${date}`,
          [ELanguage.EN]: `${title} as of ${date}`,
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
          [ELanguage.UA]: 'Новини та статті про цифрове телебачення',
          [ELanguage.EN]: 'News and articles about digital television',
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
    theme: { [ELanguage.UA]: 'Тема', [ELanguage.EN]: 'Theme' },
    views: { [ELanguage.UA]: 'Переглядів', [ELanguage.EN]: 'Views' },
    date: { [ELanguage.UA]: 'Дата', [ELanguage.EN]: 'Date' },
    comments: { [ELanguage.UA]: 'Коментарів', [ELanguage.EN]: 'Comments' },
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
