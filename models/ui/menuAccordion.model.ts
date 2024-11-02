import { ELanguage, ILang } from '../language.model';
import { EUrlBaseParam } from '../url/url.model';

export interface IAccordionItemOptions {
  name: string;
  img: {
    alt: ILang;
  };
  title: ILang;
  titleHref?: string;
  baseHrefOfList?: string;
}

const { UA, EN, RU, ES, AR, DE, FR, IT } = ELanguage;

export const MENU_ACCORDION: { [key: string]: IAccordionItemOptions } = {
  SAT_FINDER: {
    name: 'SAT_FINDER',
    img: {
      alt: {
        [UA]: 'Іконка пошуку супутників',
        [EN]: 'Satellite search icon',
        [RU]: 'Иконка поиска спутников',
        [ES]: 'Icono de búsqueda de satélites',
        [AR]: 'أيقونة البحث عن الأقمار الصناعية',
        [DE]: 'Satellitensuchsymbol',
        [FR]: 'Icône de recherche de satellite',
        [IT]: 'Icona di ricerca satellitare',
      },
    },
    title: {
      [UA]: 'Пошук супутників',
      [EN]: 'Satellite Finder',
      [RU]: 'Поиск спутников',
      [ES]: 'Buscador de satélites',
      [AR]: 'البحث عن الأقمار الصناعية',
      [DE]: 'Satellitensucher',
      [FR]: 'Chercheur de satellites',
      [IT]: 'Ricerca satellitare',
    },
    titleHref: `/${EUrlBaseParam.SAT_FINDER}`,
  },
  MAPS: {
    name: 'MAPS',
    img: {
      alt: {
        [UA]: 'Іконка для карт покриття телевізійних супутників',
        [EN]: 'Satellite coverage maps icon',
        [RU]: 'Иконка карт покрытия спутников',
        [ES]: 'Icono de mapas de cobertura satelital',
        [AR]: 'أيقونة خرائط تغطية الأقمار الصناعية',
        [DE]: 'Symbol für Satellitenabdeckkarten',
        [FR]: 'Icône des cartes de couverture satellite',
        [IT]: 'Icona delle mappe di copertura satellitare',
      },
    },
    title: {
      [UA]: 'Карти покриття',
      [EN]: 'Satellite Maps',
      [RU]: 'Карты покрытия',
      [ES]: 'Mapas de cobertura',
      [AR]: 'خرائط التغطية',
      [DE]: 'Satellitenkarten',
      [FR]: 'Cartes satellite',
      [IT]: 'Mappe satellitari',
    },
    baseHrefOfList: `/${EUrlBaseParam.SAT_COVERAGE_MAP}`,
  },
  SATELLITES: {
    name: 'SATELLITES',
    img: {
      alt: {
        [UA]: 'Іконка з зображенням супутника',
        [EN]: 'Satellite icon',
        [RU]: 'Иконка спутника',
        [ES]: 'Icono de satélite',
        [AR]: 'أيقونة القمر الصناعي',
        [DE]: 'Satellitensymbol',
        [FR]: 'Icône de satellite',
        [IT]: 'Icona del satellite',
      },
    },
    title: {
      [UA]: 'Канали на супутниках',
      [EN]: 'Channels on satellites',
      [RU]: 'Каналы на спутниках',
      [ES]: 'Canales en satélites',
      [AR]: 'القنوات على الأقمار الصناعية',
      [DE]: 'Kanäle auf Satelliten',
      [FR]: 'Chaînes sur les satellites',
      [IT]: 'Canali sui satelliti',
    },
    baseHrefOfList: `/${EUrlBaseParam.SAT_CHANNEL_LIST}`,
  },
  PACKAGES: {
    name: 'PACKAGES',
    img: {
      alt: {
        [UA]: 'Іконка з зображенням фільмової стрічки. Для пакетів каналів',
        [EN]: 'Icon with film strip. For channels packages',
        [RU]: 'Иконка с изображением кинопленки. Для пакетов каналов',
        [ES]: 'Icono con una tira de película. Para paquetes de canales',
        [AR]: 'أيقونة بشريط فيلم. لحزم القنوات',
        [DE]: 'Symbol mit Filmstreifen. Für Kanäle-Pakete',
        [FR]: 'Icône avec une bande de film. Pour les forfaits de chaînes',
        [IT]: 'Icona con una striscia di pellicola. Per i pacchetti canali',
      },
    },
    title: {
      [UA]: 'Пакети каналів',
      [EN]: 'Channels packages',
      [RU]: 'Пакеты каналов',
      [ES]: 'Paquetes de canales',
      [AR]: 'حزم القنوات',
      [DE]: 'Kanäle-Pakete',
      [FR]: 'Forfaits de chaînes',
      [IT]: 'Pacchetti canali',
    },
    baseHrefOfList: `/${EUrlBaseParam.PACKAGE_CHANNEL_LIST}`,
  },

  USEFUL: {
    name: 'USEFUL',
    img: {
      alt: {
        [UA]: 'Іконка з зображенням листа паперу з ключем. Для корисних статей',
        [EN]: 'Icon with the image of a sheet of paper with a key. For useful articles',
        [RU]: 'Иконка с изображением листа бумаги с ключом. Для полезных статей',
        [ES]: 'Icono con la imagen de una hoja de papel con una llave. Para artículos útiles',
        [AR]: 'أيقونة بصورة ورقة مع مفتاح. للمقالات المفيدة',
        [DE]: 'Symbol mit einem Blatt Papier und einem Schlüssel. Für nützliche Artikel',
        [FR]: 'Icône avec l’image d’une feuille de papier avec une clé. Pour les articles utiles',
        [IT]: 'Icona con l’immagine di un foglio di carta con una chiave. Per articoli utili',
      },
    },
    title: {
      [UA]: 'Корисні статті',
      [EN]: 'Useful articles',
      [RU]: 'Полезные статьи',
      [ES]: 'Artículos útiles',
      [AR]: 'مقالات مفيدة',
      [DE]: 'Nützliche Artikel',
      [FR]: 'Articles utiles',
      [IT]: 'Articoli utili',
    },
    baseHrefOfList: `/${EUrlBaseParam.ARTICLE}`,
  },

  ONLINE_TV: {
    name: 'ONLINE_TV',
    img: {
      alt: {
        [UA]: 'Іконка з зображенням бобини з кіноплівкою. Для онлайн ТБ',
        [EN]: 'An icon with the image of a reel with film. For online TV',
        [RU]: 'Иконка с изображением катушки с кинопленкой. Для онлайн ТВ',
        [ES]: 'Icono con la imagen de un carrete con película. Para TV en línea',
        [AR]: 'أيقونة بها صورة بكرة فيلم. للتلفاز المباشر',
        [DE]: 'Symbol mit einem Filmstreifen. Für Online-TV',
        [FR]: 'Icône avec l’image d’une bobine avec film. Pour la TV en ligne',
        [IT]: 'Icona con l’immagine di una bobina con pellicola. Per TV online',
      },
    },
    title: {
      [UA]: 'Онлайн ТБ',
      [EN]: 'Online TV',
      [RU]: 'Онлайн ТВ',
      [ES]: 'TV en línea',
      [AR]: 'التلفاز المباشر',
      [DE]: 'Online-TV',
      [FR]: 'TV en ligne',
      [IT]: 'TV online',
    },
    titleHref: `/${EUrlBaseParam.ONLINE_CHANNEL_LIST}`,
  },

  SCHEDULE: {
    name: 'SCHEDULE',
    img: {
      alt: {
        [UA]: 'Іконка з календарем розкладу телевізійних передач',
        [EN]: 'An icon with a schedule of television programs',
        [RU]: 'Иконка с изображением календаря с расписанием телепередач',
        [ES]: 'Icono con un calendario del horario de programas de televisión',
        [AR]: 'أيقونة تحتوي على جدول البرامج التلفزيونية',
        [DE]: 'Symbol mit einem Zeitplan für Fernsehprogramme',
        [FR]: 'Icône avec un calendrier de l’horaire des programmes télévisés',
        [IT]: 'Icona con un programma dei programmi televisivi',
      },
    },
    title: {
      [UA]: 'Програма ТБ',
      [EN]: 'TV schedule',
      [RU]: 'Программа ТВ',
      [ES]: 'Horario de TV',
      [AR]: 'جدول البرامج',
      [DE]: 'TV-Programm',
      [FR]: 'Programme TV',
      [IT]: 'Programma TV',
    },
    titleHref: `/${EUrlBaseParam.CHANNELS_TV_PROGRAM}`,
  },
};
export const ACCORDION_ARIA_LABELS = {
  getSatelliteAL(satTitle: string) {
    return {
      [UA]: `Перейти до перегляду списку каналів з супутника "${satTitle}"`,
      [EN]: `Go to view the list of channels broadcast from the "${satTitle}" satellite`,
      [RU]: `Перейти к просмотру списка каналов с спутника "${satTitle}"`,
      [ES]: `Ir a ver la lista de canales transmitidos desde el satélite "${satTitle}"`,
      [AR]: `انتقل لعرض قائمة القنوات المرسلة من القمر الصناعي "${satTitle}"`,
      [DE]: `Gehe zur Liste der Kanäle, die vom Satelliten "${satTitle}" übertragen werden`,
      [FR]: `Aller voir la liste des chaînes diffusées par le satellite "${satTitle}"`,
      [IT]: `Vai a vedere l'elenco dei canali trasmessi dal satellite "${satTitle}"`,
    };
  },

  getMapsAL(satTitle: string) {
    return {
      [UA]: `Перейти до перегляду мап покриття супутника "${satTitle}"`,
      [EN]: `Go to view the coverage maps of the "${satTitle}" satellite`,
      [RU]: `Перейти к просмотру карт покрытия спутника "${satTitle}"`,
      [ES]: `Ir a ver los mapas de cobertura del satélite "${satTitle}"`,
      [AR]: `انتقل لعرض خرائط التغطية للقمر الصناعي "${satTitle}"`,
      [DE]: `Gehe zur Ansicht der Abdeckungsdiagramme des Satelliten "${satTitle}"`,
      [FR]: `Voir les cartes de couverture du satellite "${satTitle}"`,
      [IT]: `Vai a vedere le mappe di copertura del satellite "${satTitle}"`,
    };
  },

  getPackageAL(packageTitle: string) {
    return {
      [UA]: `Перейти до перегляду списку каналів пакету "${packageTitle}"`,
      [EN]: `Go to view the list of channels in the "${packageTitle}" package`,
      [RU]: `Перейти к просмотру списка каналов пакета "${packageTitle}"`,
      [ES]: `Ir a ver la lista de canales en el paquete "${packageTitle}"`,
      [AR]: `انتقل لعرض قائمة القنوات في الباقة "${packageTitle}"`,
      [DE]: `Gehe zur Liste der Kanäle im Paket "${packageTitle}"`,
      [FR]: `Voir la liste des chaînes du package "${packageTitle}"`,
      [IT]: `Vai a vedere l'elenco dei canali nel pacchetto "${packageTitle}"`,
    };
  },

  getArticlesAL(articleTitle: string) {
    return {
      [UA]: `Натисніть, щоб читати статтю "${articleTitle}"`,
      [EN]: `Click to read the article "${articleTitle}"`,
      [RU]: `Нажмите, чтобы прочитать статью "${articleTitle}"`,
      [ES]: `Haga clic para leer el artículo "${articleTitle}"`,
      [AR]: `انقر لقراءة المقال "${articleTitle}"`,
      [DE]: `Klicken Sie, um den Artikel "${articleTitle}" zu lesen`,
      [FR]: `Cliquez pour lire l'article "${articleTitle}"`,
      [IT]: `Clicca per leggere l'articolo "${articleTitle}"`,
    };
  },

  getBaseAL(pageTitle: string) {
    return {
      [UA]: `Перейти до сторінки "${pageTitle}"`,
      [EN]: `Go to the view of the "${pageTitle}" page`,
      [RU]: `Перейти на страницу "${pageTitle}"`,
      [ES]: `Ir a la vista de la página "${pageTitle}"`,
      [AR]: `انتقل إلى عرض الصفحة "${pageTitle}"`,
      [DE]: `Gehe zur Ansicht der Seite "${pageTitle}"`,
      [FR]: `Aller à la vue de la page "${pageTitle}"`,
      [IT]: `Vai alla visualizzazione della pagina "${pageTitle}"`,
    };
  },
};

export const ADDED_ITEMS = {
  freeChannels: {
    title: {
      [UA]: 'Безкоштовні',
      [EN]: 'Free channels',
      [RU]: 'Бесплатные каналы',
      [ES]: 'Canales gratuitos',
      [AR]: 'قنوات مجانية',
      [DE]: 'Kostenlose Kanäle',
      [FR]: 'Chaînes gratuites',
      [IT]: 'Canali gratuiti',
    },

    link: `/${EUrlBaseParam.SAT_CHANNEL_LIST}`,
  },
};
