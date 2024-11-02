import { ELanguage } from '../language.model';
import { EUrlBaseParam } from '../url/url.model';

export const NUMBER_OF_LAST_NEWS_WIDGET = 5;

const { UA, EN, RU, ES, AR, DE, FR, IT } = ELanguage;

export const WIDGET_LAST_NEWS = {
  title: {
    [UA]: 'Останні новини',
    [EN]: 'Last news',
    [RU]: 'Последние новости',
    [ES]: 'Últimas noticias',
    [AR]: 'آخر الأخبار',
    [DE]: 'Letzte Nachrichten',
    [FR]: 'Dernières nouvelles',
    [IT]: 'Ultime notizie',
  },
  titleImgAlt: {
    [UA]: 'Газета з новинами',
    [EN]: 'Newspaper with news',
    [RU]: 'Газета с новостями',
    [ES]: 'Periódico con noticias',
    [AR]: 'صحيفة بأخبار',
    [DE]: 'Zeitung mit Nachrichten',
    [FR]: 'Journal avec des nouvelles',
    [IT]: 'Giornale con notizie',
  },
  href: `${EUrlBaseParam.NEWS_AND_ARTICLES}`,
  baseHrefOfList: `${EUrlBaseParam.ARTICLE}`,
  ariaLabel: {
    [UA]: 'Перейти до перегляду статті',
    [EN]: 'Go to view article',
    [RU]: 'Перейти к просмотру статьи',
    [ES]: 'Ir a ver el artículo',
    [AR]: 'اذهب لعرض المقال',
    [DE]: 'Gehe zum Artikel',
    [FR]: "Aller à l'article",
    [IT]: "Vai a vedere l'articolo",
  },
  ariaLabelForTitle: {
    [UA]: 'Перейти до переліку всіх статей',
    [EN]: 'Go to the list of all articles',
    [RU]: 'Перейти к списку всех статей',
    [ES]: 'Ir a la lista de todos los artículos',
    [AR]: 'اذهب إلى قائمة جميع المقالات',
    [DE]: 'Gehe zur Liste aller Artikel',
    [FR]: 'Aller à la liste de tous les articles',
    [IT]: 'Vai alla lista di tutti gli articoli',
  },
};

export const WIDGET_ARTICLE_CATEGORY = {
  title: {
    [UA]: 'Транспондерні новини',
    [EN]: 'Transponder news',
    [RU]: 'Новости транспондеров',
    [ES]: 'Noticias de transpondedores',
    [AR]: 'أخبار النقل',
    [DE]: 'Transpondernachrichten',
    [FR]: 'Actualités des transpondeurs',
    [IT]: 'Notizie sui trasponder',
  },
  href: `/${EUrlBaseParam.TRANSPONDER_NEWS}`,
  baseHrefOfList: `/${EUrlBaseParam.NEWS_AND_ARTICLES}`,
  ariaLabel: {
    [UA]: 'Перейти до переліку статей категорії',
    [EN]: 'Go to the list of articles of the category',
    [RU]: 'Перейти к списку статей категории',
    [ES]: 'Ir a la lista de artículos de la categoría',
    [AR]: 'اذهب إلى قائمة مقالات الفئة',
    [DE]: 'Gehe zur Liste der Artikel der Kategorie',
    [FR]: 'Aller à la liste des articles de la catégorie',
    [IT]: 'Vai alla lista degli articoli della categoria',
  },
  ariaLabelForTitle: {
    [UA]: 'Перейти до переліку транспондерних новин',
    [EN]: 'Go to the list of transponder news',
    [RU]: 'Перейти к списку новостей транспондеров',
    [ES]: 'Ir a la lista de noticias de transpondedores',
    [AR]: 'اذهب إلى قائمة أخبار النقل',
    [DE]: 'Gehe zur Liste der Transpondernachrichten',
    [FR]: 'Aller à la liste des actualités des transpondeurs',
    [IT]: 'Vai alla lista delle notizie sui trasponder',
  },
};
