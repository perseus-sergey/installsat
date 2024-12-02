import { ELanguage } from '../language.model';
import { DEFAULT_ARTICLE_LOGO_PATH } from '../ui/image.model';
import { EUrlBaseParam } from '../url/url.model';

const { UA, EN, RU, ES, AR, DE, FR, IT } = ELanguage;

export const getInfoPanelLinkTitle = (category_title: string) => ({
  [UA]: `Перейти до перегляду списку статей категорії "${category_title}"`,
  [EN]: `Go to view the list of articles in the "${category_title}" category`,
  [RU]: `Перейти к просмотру списка статей категории "${category_title}"`,
  [ES]: `Ir a ver la lista de artículos en la categoría "${category_title}"`,
  [AR]: `انتقل إلى عرض قائمة المقالات في فئة "${category_title}"`,
  [DE]: `Gehe zur Ansicht der Artikelliste in der Kategorie "${category_title}"`,
  [FR]: `Aller voir la liste des articles dans la catégorie "${category_title}"`,
  [IT]: `Vai a visualizzare l'elenco degli articoli nella categoria "${category_title}"`,
});

export const getSeoCardLinkTitle = (title: string) => ({
  [UA]: `Перейти до перегляду статті "${title}"`,
  [EN]: `Go to view the article "${title}"`,
  [RU]: `Перейти к просмотру статьи "${title}"`,
  [ES]: `Ir a ver el artículo "${title}"`,
  [AR]: `انتقل إلى عرض المقال "${title}"`,
  [DE]: `Gehe zur Ansicht des Artikels "${title}"`,
  [FR]: `Aller voir l'article "${title}"`,
  [IT]: `Vai a visualizzare l'articolo "${title}"`,
});

export const BREAD_ARTICLES = {
  href: EUrlBaseParam.NEWS_AND_ARTICLES,
  title: {
    [UA]: 'Новини та статті',
    [EN]: 'News and articles',
    [RU]: 'Новости и статьи',
    [ES]: 'Noticias y artículos',
    [AR]: 'الأخبار والمقالات',
    [DE]: 'Nachrichten und Artikel',
    [FR]: 'Actualités et articles',
    [IT]: 'Notizie e articoli',
  },
};

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
      [UA]: `Логотип до статті:`,
      [EN]: `Logo for article:`,
      [RU]: `Логотип к статье:`,
      [ES]: `Logo para el artículo:`,
      [AR]: `شعار للمقالة:`,
      [DE]: `Logo für den Artikel:`,
      [FR]: `Logo pour l'article:`,
      [IT]: `Logo per l'articolo:`,
    },
  },

  articleBigImg: {
    params: {
      path: '/Images/News/Article/',
      width: 1015,
      height: 580,
    },
    getAlt(title: string) {
      return {
        [UA]: `Ілюстрація до статті "${title}"`,
        [EN]: `Illustration for the article "${title}"`,
        [RU]: `Иллюстрация к статье "${title}"`,
        [ES]: `Ilustración para el artículo "${title}"`,
        [AR]: `رسم توضيحي للمقال "${title}"`,
        [DE]: `Illustration für den Artikel "${title}"`,
        [FR]: `Illustration pour l'article "${title}"`,
        [IT]: `Illustrazione per l'articolo "${title}"`,
      };
    },
  },
};

export const SIMILAR_ARTICLES_TITLE = {
  [UA]: 'Схожі статті',
  [EN]: 'Similar articles',
  [RU]: 'Похожие статьи',
  [ES]: 'Artículos similares',
  [AR]: 'مقالات مشابهة',
  [DE]: 'Ähnliche Artikel',
  [FR]: 'Articles similaires',
  [IT]: 'Articoli simili',
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
