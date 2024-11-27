import { ELanguage } from '../language.model';
import { EUrlBaseParam } from '../url/url.model';
import { EUrlSearchParam } from '../url/urlSearch.model';

const { UA, EN, RU, ES, AR, DE, FR, IT } = ELanguage;

export const META_SAT_CHANNEL_LIST = {
  getH1Start(satTitle: string) {
    return {
      [UA]: `Таблиця частот каналів з супутника ${satTitle}`,
      [EN]: `Channel Frequency Table from ${satTitle} Satellite`,
      [RU]: `Таблица частот каналов со спутника ${satTitle}`,
      [ES]: `Tabla de frecuencias de canales del satélite ${satTitle}`,
      [AR]: `جدول ترددات القنوات من قمر ${satTitle} الصناعي`,
      [DE]: `Kanalfrequenztabelle vom ${satTitle}-Satelliten`,
      [FR]: `Tableau des fréquences des chaînes du satellite ${satTitle}`,
      [IT]: `Tabella delle frequenze dei canali dal satellite ${satTitle}`,
    };
  },
  getMetaTitle(satTitle: string) {
    return {
      [UA]: `Частоти і канали супутника ${satTitle}`,
      [EN]: `Frequencies and Channels of ${satTitle} Satellite`,
      [RU]: `Частоты и каналы спутника ${satTitle}`,
      [ES]: `Frecuencias y Canales del Satélite ${satTitle}`,
      [AR]: `ترددات وقنوات قمر ${satTitle} الصناعي`,
      [DE]: `Frequenzen und Kanäle des ${satTitle}-Satelliten`,
      [FR]: `Fréquences et Canaux du Satellite ${satTitle}`,
      [IT]: `Frequenze e Canali del Satellite ${satTitle}`,
    };
  },
  getMetaDescription(satTitle: string) {
    return {
      [UA]: `Список частот телевізійних і радіо каналів, які ведуть мовлення з супутника ${satTitle}`,
      [EN]: `List of TV and radio channel frequencies broadcasting from the ${satTitle} satellite`,
      [RU]: `Список частот телевизионных и радиоканалов, вещающих со спутника ${satTitle}`,
      [ES]: `Lista de frecuencias de canales de TV y radio que transmiten desde el satélite ${satTitle}`,
      [AR]: `قائمة ترددات قنوات التلفزيون والراديو التي تبث من قمر ${satTitle} الصناعي`,
      [DE]: `Liste der Frequenzen von TV- und Radiosendern, die vom ${satTitle}-Satelliten senden`,
      [FR]: `Liste des fréquences des chaînes TV et radio diffusées depuis le satellite ${satTitle}`,
      [IT]: `Elenco delle frequenze dei canali TV e radio trasmessi dal satellite ${satTitle}`,
    };
  },
};

export const START_SECTION_TEXT = {
  [UA]: `Всього каналів: `,
  [EN]: `Total channels: `,
  [RU]: `Всего каналов: `,
  [ES]: `Total de canales: `,
  [AR]: `إجمالي القنوات: `,
  [DE]: `Gesamtkanäle: `,
  [FR]: `Total des chaînes: `,
  [IT]: `Totale canali: `,
};

export const getEmptyPageTitle = (satSlug: string) => ({
  [UA]: `Супутник «${satSlug}» не знайдено. Спробуйте вибрати інший із списку супутників.`,
  [EN]: `Satellite «${satSlug}» not found. Try selecting another one from the satellite list.`,
  [RU]: `Спутник «${satSlug}» не найден. Попробуйте выбрать другой из списка спутников.`,
  [ES]: `El satélite «${satSlug}» no encontrado. Intente seleccionar otro de la lista de satélites.`,
  [AR]: `لم يتم العثور على القمر الصناعي «${satSlug}». حاول اختيار قمر آخر من قائمة الأقمار الصناعية.`,
  [DE]: `Satellit «${satSlug}» nicht gefunden. Versuchen Sie, einen anderen aus der Satellitenliste auszuwählen.`,
  [FR]: `Satellite «${satSlug}» introuvable. Essayez d'en sélectionner un autre dans la liste des satellites.`,
  [IT]: `Satellite «${satSlug}» non trovato. Prova a selezionarne un altro dall'elenco dei satelliti.`,
});

export const BREAD_SAT_CHANNEL_LIST = {
  href: EUrlBaseParam.SAT_CHANNEL_LIST,
  title: {
    [UA]: 'Список каналів супутників',
    [EN]: 'List of satellite channels',
    [RU]: 'Список каналов спутников',
    [ES]: 'Lista de canales satelitales',
    [AR]: 'قائمة القنوات الفضائية',
    [DE]: 'Liste der Satellitenkanäle',
    [FR]: 'Liste des chaînes satellites',
    [IT]: 'Elenco dei canali satellitari',
  },
};

export const TOTAL_CHANNELS_TITLE = {
  [UA]: 'Всього каналів: ',
  [EN]: 'Total channels: ',
  [RU]: 'Всего каналов: ',
  [ES]: 'Total de canales: ',
  [AR]: 'إجمالي القنوات: ',
  [DE]: 'Gesamtkanäle: ',
  [FR]: 'Total des chaînes : ',
  [IT]: 'Canali totali: ',
};

export const SAT_CHANNEL_LIST_IMAGES = {
  h1SatImage: {
    path: '/Images/satellites/',
    height: 99,
    width: 132,
    alt: {
      [UA]: `Логотип супутника`,
      [EN]: `Logo of the satellite`,
      [RU]: `Логотип спутника`,
      [ES]: `Logotipo del satélite`,
      [AR]: `شعار القمر الصناعي`,
      [DE]: `Logo des Satelliten`,
      [FR]: `Logo du satellite`,
      [IT]: `Logo del satellite`,
    },
    defaultImage: {
      src: '/Images/satellite_132-99.png',
      height: 99,
      width: 132,
    },
  },
  h2SatListImage: {
    path: '/Images/satellites/',
    height: 52.5,
    width: 70,
    alt: {
      [UA]: `Логотип супутника`,
      [EN]: `Logo of the satellite`,
      [RU]: `Логотип спутника`,
      [ES]: `Logotipo del satélite`,
      [AR]: `شعار القمر الصناعي`,
      [DE]: `Logo des Satelliten`,
      [FR]: `Logo du satellite`,
      [IT]: `Logo del satellite`,
    },
    defaultImage: {
      src: '/Images/satellite_132-99.png',
      height: 52.5,
      width: 70,
    },
  },
  genreImage: {
    path: '/Images/genre/',
    height: 24,
    width: 24,
    altPre: {
      [UA]: 'Іконка для позначення каналів жанру:',
      [EN]: 'Icon for indicating genre channels:',
      [RU]: 'Иконка для обозначения жанровых каналов:',
      [ES]: 'Ícono para indicar canales de género:',
      [AR]: 'رمز للإشارة إلى قنوات النوع:',
      [DE]: 'Symbol zur Kennzeichnung von Genrekanälen:',
      [FR]: 'Icône pour indiquer les chaînes de genre :',
      [IT]: 'Icona per indicare i canali di genere:',
    },
  },
  genreRadioImage: {
    src: '/Images/genre/radio.png',
    height: 16,
    width: 16,
    alt: {
      [UA]: 'Радіо',
      [EN]: 'Radio',
      [RU]: 'Радио',
      [ES]: 'Radio',
      [AR]: 'راديو',
      [DE]: 'Radio',
      [FR]: 'Radio',
      [IT]: 'Radio',
    },
  },
  t2Image: {
    src: '/Images/t2_antenna_24.png',
    height: 24,
    width: 24,
    alt: {
      [UA]: 'Цифрове ефірне телебачення',
      [EN]: 'Digital terrestrial television',
      [RU]: 'Цифровое эфирное телевидение',
      [ES]: 'Televisión terrestre digital',
      [AR]: 'التلفزيون الأرضي الرقمي',
      [DE]: 'Digitales terrestrisches Fernsehen',
      [FR]: 'Télévision terrestre numérique',
      [IT]: 'Televisione terrestre digitale',
    },
  },
};

export const META_ALL_SAT_CHANNEL_LIST = {
  metaH1: {
    [UA]: 'Підбір каналів за параметрами з доступних супутників',
    [EN]: 'Channel selection by parameters with available satellites',
    [RU]: 'Выбор каналов по параметрам доступных спутников',
    [ES]: 'Selección de canales por parámetros con satélites disponibles',
    [AR]: 'اختيار القنوات حسب المعايير مع الأقمار الصناعية المتاحة',
    [DE]: 'Kanalwahl nach Parametern mit verfügbaren Satelliten',
    [FR]: 'Sélection de chaînes par paramètres avec des satellites disponibles',
    [IT]: 'Selezione di canali per parametri con satelliti disponibili',
  },
  metaTitle: {
    [UA]: 'Таблиці частот супутникових каналів',
    [EN]: 'Frequency tables of satellite channels',
    [RU]: 'Таблицы частот спутниковых каналов',
    [ES]: 'Tablas de frecuencias de canales de satélite',
    [AR]: 'جداول تردد قنوات الأقمار الصناعية',
    [DE]: 'Frequenztabellen von Satellitenkanälen',
    [FR]: 'Tableaux de fréquences des chaînes satellites',
    [IT]: 'Tabelle di frequenza dei canali satellitari',
  },
  metaKeywords: {
    [UA]: `Безкоштовні канали Список із програмою передач, доступних для вільного перегляду з найбільш популярних супутників без будь-яких зобов'язань та абонентської плати кодовані платні радіо DVB-T2 DVB-S DVB-S2 MPEG-2 MPEG-4 частоти напрямок вибір мови аудіо`,
    [EN]: 'Free channels List with a program of programs available for free viewing from the most popular satellites without any obligations and subscription fees encoded paid radio DVB-T2 DVB-S DVB-S2 MPEG-2 MPEG-4 frequencies direction language selection audio',
    [RU]: `Бесплатные каналы Список с программой передач, доступных для свободного просмотра с самых популярных спутников без каких-либо обязательств и абонентской платы закодированные платные радио DVB-T2 DVB-S DVB-S2 MPEG-2 MPEG-4 частоты направление выбор языка аудио`,
    [ES]: `Canales gratuitos Lista con un programa de programas disponibles para visualización gratuita desde los satélites más populares sin ninguna obligación y tarifas de suscripción codificadas, radio de pago DVB-T2 DVB-S DVB-S2 MPEG-2 MPEG-4 frecuencias dirección selección de idioma audio`,
    [AR]: `قنوات مجانية قائمة ببرنامج البرامج المتاحة للمشاهدة المجانية من أكثر الأقمار الصناعية شعبية دون أي التزامات ورسوم اشتراك مشفرة مدفوعة الراديو DVB-T2 DVB-S DVB-S2 MPEG-2 MPEG-4 الترددات الاتجاه اختيار اللغة الصوت`,
    [DE]: `Kostenlose Kanäle Liste mit einem Programm von Programmen, die für eine kostenlose Ansicht von den beliebtesten Satelliten ohne Verpflichtungen und Abonnements geboten werden, codierte kostenpflichtige Radio DVB-T2 DVB-S DVB-S2 MPEG-2 MPEG-4 Frequenzen Richtung Auswahl von Sprache Audio`,
    [FR]: `Chaînes gratuites Liste avec un programme d'émissions disponibles pour une visualisation gratuite à partir des satellites les plus populaires sans aucune obligation ni frais d'abonnement canaux payants codés DVB-T2 DVB-S DVB-S2 MPEG-2 MPEG-4 fréquences direction sélection de langue audio`,
    [IT]: `Canali gratuiti Elenco con un programma di programmi disponibili per la visualizzazione gratuita dai satelliti più popolari senza alcun obbligo e spese di abbonamento canali a pagamento codificati DVB-T2 DVB-S DVB-S2 MPEG-2 MPEG-4 frequenze direzione selezione della lingua audio`,
  },
  metaDescription: {
    [UA]: `Список телевізійних і радіо каналів, доступних для вільного перегляду без будь-яких зобов'язань та абонентської плати, а також платних каналів з всіх доступних супутників.`,
    [EN]: `List of television and radio channels available for free viewing without any obligations and subscription fees, as well as paid channels from all available satellites.`,
    [RU]: `Список телевизионных и радио каналов, доступных для свободного просмотра без каких-либо обязательств и абонентской платы, а также платных каналов со всех доступных спутников.`,
    [ES]: `Lista de canales de televisión y radio disponibles para ver gratis sin ninguna obligación y tarifas de suscripción, así como canales de pago de todos los satélites disponibles.`,
    [AR]: `قائمة بالقنوات التلفزيونية والإذاعية المتاحة للمشاهدة المجانية دون أي التزامات ورسوم اشتراك، بالإضافة إلى القنوات المدفوعة من جميع الأقمار الصناعية المتاحة.`,
    [DE]: `Liste der Fernsehsender und Radiosender, die kostenlos ohne Verpflichtungen und Abonnements verfügbar sind, sowie kostenpflichtige Kanäle von allen verfügbaren Satelliten.`,
    [FR]: `Liste des chaînes de télévision et de radio disponibles pour un visionnage gratuit sans aucune obligation ni frais d'abonnement, ainsi que des chaînes payantes de tous les satellites disponibles.`,
    [IT]: `Elenco di canali televisivi e radiofonici disponibili per la visione gratuita senza alcun obbligo e spese di abbonamento, oltre a canali a pagamento di tutti i satelliti disponibili.`,
  },
};

export const ALL_SAT_CHANNEL_LIST_FILTERS = {
  satCheckBox: {
    tooltip: {
      [UA]: 'Обрати супутник',
      [EN]: 'Choose a satellite',
      [RU]: 'Выбрать спутник',
      [ES]: 'Elegir un satélite',
      [AR]: 'اختر القمر الصناعي',
      [DE]: 'Wählen Sie einen Satelliten',
      [FR]: 'Choisir un satellite',
      [IT]: 'Scegli un satellite',
    },
  },
  satAnchor: {
    tooltip: {
      [UA]: 'Перейти до супутника',
      [EN]: 'Go to satellite',
      [RU]: 'Перейти к спутнику',
      [ES]: 'Ir al satélite',
      [AR]: 'اذهب إلى القمر الصناعي',
      [DE]: 'Zum Satelliten gehen',
      [FR]: 'Aller au satellite',
      [IT]: 'Vai al satellite',
    },
  },
  filterByChannelName: {
    placeholder: {
      [UA]: 'Назва каналу...',
      [EN]: 'Channel name...',
      [RU]: 'Название канала...',
      [ES]: 'Nombre del canal...',
      [AR]: 'اسم القناة...',
      [DE]: 'Kanalname...',
      [FR]: 'Nom de la chaîne...',
      [IT]: 'Nome del canale...',
    },
    labelTitle: {
      [UA]: 'Фільтр каналів по назві',
      [EN]: 'Filter channels by name',
      [RU]: 'Фильтр каналов по названию',
      [ES]: 'Filtrar canales por nombre',
      [AR]: 'تصفية القنوات حسب الاسم',
      [DE]: 'Kanäle nach Name filtern',
      [FR]: 'Filtrer les chaînes par nom',
      [IT]: 'Filtra i canali per nome',
    },
    cancelBtnAriaLabel: {
      [UA]: 'Скасувати',
      [EN]: 'Cancel',
      [RU]: 'Отмена',
      [ES]: 'Cancelar',
      [AR]: 'إلغاء',
      [DE]: 'Abbrechen',
      [FR]: 'Annuler',
      [IT]: 'Annulla',
    },
    searchIconStr: '⏿',
  },
  resetAllFiltersButton: {
    ariaLabel: {
      [UA]: 'Скинути всі фільтри',
      [EN]: 'Reset All Filters',
      [RU]: 'Сбросить все фильтры',
      [ES]: 'Restablecer todos los filtros',
      [AR]: 'إعادة تعيين جميع الفلاتر',
      [DE]: 'Alle Filter zurücksetzen',
      [FR]: 'Réinitialiser tous les filtres',
      [IT]: 'Reimposta tutti i filtri',
    },
    imgStr: '⏻',
  },
  filterByChannelFormat: {
    formats: [
      {
        title: 'T2-MI',
        searchQueryName: EUrlSearchParam.CHANNEL_FORMAT_T2MI,
      },
      {
        title: 'MPEG-4, DVB-S2, HD, 4K(UHD)',
        searchQueryName: EUrlSearchParam.CHANNEL_FORMAT_MPG4,
      },
    ],
  },
  filterByChannelFormatFly: {
    formats: [
      {
        title: {
          [EN]: 'C-band (frequencies up to 10,700 MHz)',
          [UA]: 'C-діапазон (частоти до 10,700 МГц)',
          [RU]: 'C-диапазон (частоты до 10,700 МГц)',
          [ES]: 'Banda C (frecuencias de hasta 10,700 MHz)',
          [AR]: 'نطاق C (الترددات تصل إلى 10,700 ميغاهيرتز)',
          [DE]: 'C-Band (Frequenzen bis zu 10.700 MHz)',
          [FR]: 'Bande C (fréquences jusqu’à 10 700 MHz)',
          [IT]: 'Banda C (frequenze fino a 10.700 MHz)',
        },
        searchQueryName: EUrlSearchParam.CHANNEL_C_BAND,
      },
      {
        title: {
          [EN]: 'Only UNENCRYPTED channels',
          [UA]: 'Тільки НЕ КОДОВАНІ канали',
          [RU]: 'Только НЕЗАШИФРОВАННЫЕ каналы',
          [ES]: 'Solo canales NO ENCRIPTADOS',
          [AR]: 'فقط القنوات غير المشفرة',
          [DE]: 'Nur UNVERSCHLÜSSELTE Kanäle',
          [FR]: 'Seulement les chaînes NON CRYPTÉES',
          [IT]: 'Solo canali NON CRYPTATI',
        },
        searchQueryName: EUrlSearchParam.CHANNEL_NOT_ENCRYPTED,
      },
      {
        title: {
          [EN]: 'Radio channels',
          [UA]: 'Радіо канали',
          [RU]: 'Радиоканалы',
          [ES]: 'Canales de radio',
          [AR]: 'قنوات الراديو',
          [DE]: 'Radiokanäle',
          [FR]: 'Chaînes de radio',
          [IT]: 'Canali radio',
        },
        searchQueryName: EUrlSearchParam.CHANNEL_RADIO,
      },
      {
        title: {
          [UA]: 'DVB-T2',
          [EN]: 'DVB-T2',
          [RU]: 'DVB-T2',
          [ES]: 'DVB-T2',
          [AR]: 'DVB-T2',
          [DE]: 'DVB-T2',
          [FR]: 'DVB-T2',
          [IT]: 'DVB-T2',
        },
        searchQueryName: EUrlSearchParam.CHANNEL_FORMAT_T2MI,
      },
    ],
  },
};

export const ALL_SAT_CHANNEL_LIST_LINKS = {
  anchors: {
    legendTitle: {
      [UA]: 'Фільтри',
      [EN]: 'Filtering',
      [RU]: 'Фильтры',
      [ES]: 'Filtros',
      [AR]: 'الفلاتر',
      [DE]: 'Filter',
      [FR]: 'Filtres',
      [IT]: 'Filtri',
    },
  },
  links: {
    satTitleLink: {
      tooltipTitle: {
        [UA]: 'Дивитись мапи покриття супутника',
        [EN]: 'See satellite coverage maps',
        [RU]: 'Посмотреть карты покрытия спутника',
        [ES]: 'Ver mapas de cobertura de satélites',
        [AR]: 'شاهد خرائط تغطية الأقمار الصناعية',
        [DE]: 'Satellitenabdeckungs Karten ansehen',
        [FR]: 'Voir les cartes de couverture satellite',
        [IT]: 'Visualizza le mappe di copertura satellitare',
      },
      linkUrl: `/${EUrlBaseParam.SAT_COVERAGE_MAP}`,
    },
  },
};

export const ALL_SAT_CHANNEL_LIST_IMAGES = {
  h1FlyImageAlt: {
    [UA]: 'Зображення сортувального пристрою для вибору списку каналів за налаштуваннями',
    [EN]: 'Image of sorting device for selecting channel list based on settings',
    [RU]: 'Изображение устройства сортировки для выбора списка каналов по настройкам',
    [ES]: 'Imagen del dispositivo de clasificación para seleccionar la lista de canales según la configuración',
    [AR]: 'صورة لجهاز الفرز لاختيار قائمة القنوات بناءً على الإعدادات',
    [DE]: 'Bild des Sortiergeräts zur Auswahl der Kanalliste basierend auf den Einstellungen',
    [FR]: `Image de l'appareil de tri pour sélectionner la liste des chaînes en fonction des paramètres`,
    [IT]: `Immagine del dispositivo di ordinamento per selezionare l'elenco dei canali in base alle impostazioni`,
  },
};

export const START_CONTENT = {
  [UA]: 'У наведеному списку показані ті канали, які транслюються без абонентської плати.',
  [EN]: 'The list shows those channels that are broadcast without a subscription fee.',
  [RU]: 'В представленном списке показаны те каналы, которые транслируются без абонентской платы.',
  [ES]: 'La lista muestra aquellos canales que se transmiten sin tarifa de suscripción.',
  [AR]: 'تظهر القائمة القنوات التي يتم بثها بدون رسوم اشتراك.',
  [DE]: 'In der Liste werden die Kanäle angezeigt, die ohne Abonnementgebühr ausgestrahlt werden.',
  [FR]: 'La liste montre les chaînes qui sont diffusées sans frais d’abonnement.',
  [IT]: 'L’elenco mostra i canali che vengono trasmessi senza una quota di abbonamento.',
};

export const CHANNEL_TOOLTIP_TITLES = {
  name: {
    [UA]: 'Назва',
    [EN]: 'Name',
    [RU]: 'Название',
    [ES]: 'Nombre',
    [AR]: 'اسم',
    [DE]: 'Name',
    [FR]: 'Nom',
    [IT]: 'Nome',
  },
  genre: {
    [UA]: 'Жанр',
    [EN]: 'Genre',
    [RU]: 'Жанр',
    [ES]: 'Género',
    [AR]: 'نوع',
    [DE]: 'Genre',
    [FR]: 'Genre',
    [IT]: 'Genere',
  },
  language: {
    [UA]: 'Мова',
    [EN]: 'Language',
    [RU]: 'Язык',
    [ES]: 'Idioma',
    [AR]: 'لغة',
    [DE]: 'Sprache',
    [FR]: 'Langue',
    [IT]: 'Lingua',
  },
  description: {
    [UA]: 'Опис',
    [EN]: 'Description',
    [RU]: 'Описание',
    [ES]: 'Descripción',
    [AR]: 'وصف',
    [DE]: 'Beschreibung',
    [FR]: 'Description',
    [IT]: 'Descrizione',
  },
  compression: {
    [UA]: 'Формат',
    [EN]: 'Compression',
    [RU]: 'Формат',
    [ES]: 'Compresión',
    [AR]: 'ضغط',
    [DE]: 'Kompression',
    [FR]: 'Compression',
    [IT]: 'Compressione',
  },
};
