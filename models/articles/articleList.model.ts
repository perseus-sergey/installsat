import { ELanguage } from '../language.model';
import { EUrlBaseParam } from '../url/url.model';

export const WRONG_CAT_IDS = '(2,0,11,12,13)';

const { UA, EN, RU, ES, AR, DE, FR, IT } = ELanguage;

export const META_ALL_ARTICLES = {
  h1Start: {
    [UA]: `Останні новини ТБ, статті та огляди на`,
    [EN]: `Latest TV news, articles and reviews as of`,
    [RU]: `Последние новости ТВ, статьи и обзоры на`,
    [ES]: `Últimas noticias de TV, artículos y reseñas en`,
    [AR]: `آخر أخبار التلفاز، المقالات والمراجعات على`,
    [DE]: `Neueste TV-Nachrichten, Artikel und Bewertungen am`,
    [FR]: `Dernières nouvelles de la télévision, articles et critiques au`,
    [IT]: `Ultime notizie TV, articoli e recensioni al`,
  },
  title: {
    [UA]: 'Останні новини та статті про цифрове телебачення',
    [EN]: 'Latest news and articles about digital television',
    [RU]: 'Последние новости и статьи о цифровом телевидении',
    [ES]: 'Últimas noticias y artículos sobre televisión digital',
    [AR]: 'آخر الأخبار والمقالات حول التلفزيون الرقمي',
    [DE]: 'Neueste Nachrichten und Artikel über digitales Fernsehen',
    [FR]: 'Dernières nouvelles et articles sur la télévision numérique',
    [IT]: 'Ultime notizie e articoli sulla televisione digitale',
  },
  description: {
    [UA]: 'Список статей про новини в сфері цифрового телебачення, статей про налаштування обладнання для прийому та перегляду телевізійних та радіо каналів, статей про новини від провайдерів платного телебачення',
    [EN]: 'List of articles about news in the field of digital television, articles about setting up equipment for receiving and viewing TV and radio channels, articles about news from pay TV providers',
    [RU]: 'Список статей о новостях в сфере цифрового телевидения, статьях о настройке оборудования для приема и просмотра телевизионных и радио каналов, статьях о новостях от провайдеров платного телевидения',
    [ES]: 'Lista de artículos sobre noticias en el campo de la televisión digital, artículos sobre la configuración de equipos para recibir y ver canales de televisión y radio, artículos sobre noticias de proveedores de televisión de pago',
    [AR]: 'قائمة المقالات حول الأخبار في مجال التلفزيون الرقمي، المقالات حول إعداد المعدات لاستقبال ومشاهدة القنوات التلفزيونية والإذاعية، المقالات حول الأخبار من مقدمي خدمات التلفزيون المدفوع',
    [DE]: 'Liste von Artikeln über Nachrichten im Bereich des digitalen Fernsehens, Artikel über die Einrichtung von Geräten zum Empfang und zur Betrachtung von TV- und Radiosendern, Artikel über Nachrichten von Pay-TV-Anbietern',
    [FR]: "Liste d'articles sur les nouvelles dans le domaine de la télévision numérique, articles sur la configuration des équipements pour recevoir et regarder les chaînes de télévision et de radio, articles sur les nouvelles des fournisseurs de télévision payante",
    [IT]: 'Elenco di articoli sulle notizie nel campo della televisione digitale, articoli sulla configurazione delle attrezzature per ricevere e visualizzare canali TV e radio, articoli sulle notizie dai fornitori di TV a pagamento',
  },
};

export const BREAD_NEWS_AND_ARTICLES = {
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

export const ARTICLE_LIST_MODEL = {
  images: {
    h1Image: {
      src: '/Images/articles/all_news_64.png',
      height: 64,
      width: 64,
      alt: {
        [UA]: 'Новини та статті про цифрове телебачення',
        [EN]: 'News and articles about digital television',
        [RU]: 'Новости и статьи о цифровом телевидении',
        [ES]: 'Noticias y artículos sobre televisión digital',
        [AR]: 'أخبار ومقالات حول التلفزيون الرقمي',
        [DE]: 'Nachrichten und Artikel über digitales Fernsehen',
        [FR]: 'Nouvelles et articles sur la télévision numérique',
        [IT]: 'Notizie e articoli sulla televisione digitale',
      },
    },
    titleImg: {
      src: '/Images/articles/package_network_4729.png',
      height: 32,
      width: 32,
    },
  },
  articlesCountCaption: {
    [EN]: 'Number of articles found: ',
    [UA]: 'Кількість знайдених статей: ',
    [RU]: 'Количество найденных статей: ',
    [ES]: 'Número de artículos encontrados: ',
    [AR]: 'عدد المقالات التي تم العثور عليها: ',
    [DE]: 'Anzahl der gefundenen Artikel: ',
    [FR]: "Nombre d'articles trouvés: ",
    [IT]: 'Numero di articoli trovati: ',
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
      [UA]: 'Зараз ви на сторінці: ',
      [EN]: 'You are now on page: ',
      [RU]: 'Вы сейчас на странице: ',
      [ES]: 'Ahora estás en la página: ',
      [AR]: 'أنت الآن في الصفحة: ',
      [DE]: 'Sie sind jetzt auf der Seite: ',
      [FR]: 'Vous êtes maintenant sur la page: ',
      [IT]: 'Ora sei nella pagina: ',
    },
    pageStartStr: {
      [UA]: 'Перейти на сторінку: ',
      [EN]: 'Go to page: ',
      [RU]: 'Перейти на страницу: ',
      [ES]: 'Ir a la página: ',
      [AR]: 'اذهب إلى الصفحة: ',
      [DE]: 'Gehe zur Seite: ',
      [FR]: 'Aller à la page: ',
      [IT]: 'Vai alla pagina: ',
    },
    firstPage: {
      [UA]: 'Перейти на першу сторінку',
      [EN]: 'Go to first page',
      [RU]: 'Перейти на первую страницу',
      [ES]: 'Ir a la primera página',
      [AR]: 'اذهب إلى الصفحة الأولى',
      [DE]: 'Gehe zur ersten Seite',
      [FR]: 'Aller à la première page',
      [IT]: 'Vai alla prima pagina',
    },
    nextPage: {
      [UA]: 'Перейти на наступну сторінку',
      [EN]: 'Go to next page',
      [RU]: 'Перейти на следующую страницу',
      [ES]: 'Ir a la siguiente página',
      [AR]: 'اذهب إلى الصفحة التالية',
      [DE]: 'Gehe zur nächsten Seite',
      [FR]: 'Aller à la page suivante',
      [IT]: 'Vai alla pagina successiva',
    },
    previousPage: {
      [UA]: 'Перейти на попередню сторінку',
      [EN]: 'Go to previous page',
      [RU]: 'Перейти на предыдущую страницу',
      [ES]: 'Ir a la página anterior',
      [AR]: 'اذهب إلى الصفحة السابقة',
      [DE]: 'Gehe zur vorherigen Seite',
      [FR]: 'Aller à la page précédente',
      [IT]: 'Vai alla pagina precedente',
    },
    lastPage: {
      [UA]: 'Перейти на останню сторінку',
      [EN]: 'Go to last page',
      [RU]: 'Перейти на последнюю страницу',
      [ES]: 'Ir a la última página',
      [AR]: 'اذهب إلى الصفحة الأخيرة',
      [DE]: 'Gehe zur letzten Seite',
      [FR]: 'Aller à la dernière page',
      [IT]: "Vai all'ultima pagina",
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
        [UA]: 'Новини та статті про цифрове телебачення',
        [EN]: 'News and articles about digital television',
        [RU]: 'Новости и статьи о цифровом телевидении',
        [ES]: 'Noticias y artículos sobre televisión digital',
        [AR]: 'أخبار ومقالات عن التلفزيون الرقمي',
        [DE]: 'Nachrichten und Artikel über digitales Fernsehen',
        [FR]: 'Actualités et articles sur la télévision numérique',
        [IT]: 'Notizie e articoli sulla televisione digitale',
      },
    },
    titleImg: {
      src: '/Images/articles/package_network_4729.png',
      height: 32,
      width: 32,
    },
  },
};

export const getPackageListLink = (title: string) => ({
  [UA]: `Перейти до перегляду списку каналів пакету "${title}"`,
  [EN]: `Go to view the list of channels in the package "${title}"`,
  [RU]: `Перейти к просмотру списка каналов пакета "${title}"`,
  [ES]: `Ir a ver la lista de canales del paquete "${title}"`,
  [AR]: `انتقل إلى عرض قائمة القنوات في الحزمة "${title}"`,
  [DE]: `Gehe zur Ansicht der Kanalliste im Paket "${title}"`,
  [FR]: `Aller voir la liste des chaînes dans le package "${title}"`,
  [IT]: `Vai a visualizzare l'elenco dei canali nel pacchetto "${title}"`,
});

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
