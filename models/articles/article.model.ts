import { ELanguage } from '../language.model';
import { DEFAULT_ARTICLE_LOGO_PATH } from '../ui/image.model';

export const ARTICLE_CARD_IMAGES = {
  h1Image: {
    currentImg: {
      path: '/Images/channelsOptimized/',
      height: 100,
      width: 120,
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
};

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
  original_slug: string;
  keywords: string;
}
