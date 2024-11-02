import { ELanguage } from '../language.model';
import { EUrlBaseParam } from '../url/url.model';

const { UA, EN, RU, ES, AR, DE, FR, IT } = ELanguage;

export const META_ONLINE_CHANNEL_LIST = {
  metaH1: {
    [UA]: 'Телеканали онлайн',
    [EN]: 'Online TV channels',
    [RU]: 'Онлайн телеканалы',
    [ES]: 'Canales de TV en línea',
    [AR]: 'قنوات التلفاز على الإنترنت',
    [DE]: 'Online-TV-Kanäle',
    [FR]: 'Chaînes de télévision en ligne',
    [IT]: 'Canali TV online',
  },
  getH1After(searchQuery: string) {
    return {
      [UA]: searchQuery ? ` назва яких містить «${searchQuery}»` : '.',
      [EN]: searchQuery ? ` the name of which contains «${searchQuery}»` : '.',
      [RU]: searchQuery ? ` название которых содержит «${searchQuery}»` : '.',
      [ES]: searchQuery ? ` cuyo nombre contiene «${searchQuery}»` : '.',
      [AR]: searchQuery ? ` اسمها يحتوي على «${searchQuery}»` : '.',
      [DE]: searchQuery ? ` deren Name «${searchQuery}» enthält` : '.',
      [FR]: searchQuery ? ` dont le nom contient «${searchQuery}»` : '.',
      [IT]: searchQuery ? ` il cui nome contiene «${searchQuery}»` : '.',
    };
  },
  metaTitle: {
    [UA]: 'Телеканали онлайн. Дивитися безкоштовне телебачення у прямому ефірі.',
    [EN]: 'Online TV channels. Watch free TV live.',
    [RU]: 'Онлайн телеканалы. Смотрите бесплатное телевидение в прямом эфире.',
    [ES]: 'Canales de TV en línea. Mira televisión gratuita en vivo.',
    [AR]: 'قنوات التلفاز على الإنترنت. شاهد التلفاز المجاني مباشرة.',
    [DE]: 'Online-TV-Kanäle. Sehen Sie kostenloses Fernsehen live.',
    [FR]: 'Chaînes de télévision en ligne. Regardez la télévision gratuite en direct.',
    [IT]: 'Canali TV online. Guarda la TV gratuita in diretta.',
  },
  metaDescription: {
    [UA]: 'Дивіться онлайн телебачення безкоштовно. Обирайте канали, клікнувши на відповідний логотип. Онлайн телебачення розвивається швидко, відкриваючи нові можливості для перегляду улюблених каналів у високій якості без телевізійних антен.',
    [EN]: 'Watch online television for free. Choose channels by clicking on the respective logo. Online television is advancing rapidly, offering new possibilities for viewing favorite channels in high quality without TV antennas.',
    [RU]: 'Смотрите онлайн телевидение бесплатно. Выбирайте каналы, нажимая на соответствующий логотип. Онлайн телевидение быстро развивается, открывая новые возможности для просмотра любимых каналов в высоком качестве без телевизионных антенн.',
    [ES]: 'Mira televisión en línea gratis. Elige canales haciendo clic en el logotipo correspondiente. La televisión en línea avanza rápidamente, ofreciendo nuevas posibilidades para ver tus canales favoritos en alta calidad sin antenas de televisión.',
    [AR]: 'شاهد التلفاز عبر الإنترنت مجانًا. اختر القنوات بالنقر على الشعار المناسب. تتطور التلفاز عبر الإنترنت بسرعة، مما يتيح فرصًا جديدة لمشاهدة قنواتك المفضلة بجودة عالية بدون هوائيات التلفاز.',
    [DE]: 'Sehen Sie online Fernsehen kostenlos. Wählen Sie Kanäle, indem Sie auf das jeweilige Logo klicken. Online-Fernsehen entwickelt sich schnell und bietet neue Möglichkeiten, Ihre Lieblingskanäle in hoher Qualität ohne Fernsehanntenne zu sehen.',
    [FR]: 'Regardez la télévision en ligne gratuitement. Choisissez des chaînes en cliquant sur le logo correspondant. La télévision en ligne progresse rapidement, offrant de nouvelles possibilités pour regarder vos chaînes préférées en haute qualité sans antennes de télévision.',
    [IT]: 'Guarda la televisione online gratuitamente. Scegli i canali facendo clic sul rispettivo logo. La televisione online si sta sviluppando rapidamente, offrendo nuove possibilità per guardare i tuoi canali preferiti in alta qualità senza antenne televisive.',
  },
  metaKeywords: {
    [UA]: 'онлайн телебачення, безкоштовне телебачення, трансляція каналів, високоякісне телебачення, цифрове телебачення, онлайн-канали, телевізійні антени',
    [EN]: 'online television, free television, channel streaming, high-quality television, digital television, online channels, TV antennas',
    [RU]: 'онлайн телевидение, бесплатное телевидение, трансляция каналов, высококачественное телевидение, цифровое телевидение, онлайн-каналы, телевизионные антенны',
    [ES]: 'televisión en línea, televisión gratuita, transmisión de canales, televisión de alta calidad, televisión digital, canales en línea, antenas de televisión',
    [AR]: 'التلفاز على الإنترنت، التلفاز المجاني، بث القنوات، التلفاز عالي الجودة، التلفاز الرقمي، القنوات على الإنترنت، هوائيات التلفاز',
    [DE]: 'Online-Fernsehen, kostenloses Fernsehen, Kanalstreaming, hochqualitatives Fernsehen, digitales Fernsehen, Online-Kanäle, TV-Antennen',
    [FR]: 'télévision en ligne, télévision gratuite, streaming de chaînes, télévision haute qualité, télévision numérique, chaînes en ligne, antennes de télévision',
    [IT]: 'televisione online, televisione gratuita, streaming di canali, televisione di alta qualità, televisione digitale, canali online, antenne TV',
  },
};

export const ONLINE_CHANNEL_LIST_IMAGES = {
  h1Image: {
    alt: {
      [UA]: `Зображення пакунка з попкорном`,
      [EN]: `Package with popcorn`,
      [RU]: `Упаковка с попкорном`,
      [ES]: `Paquete de palomitas`,
      [AR]: `عبوة من الفشار`,
      [DE]: `Packung mit Popcorn`,
      [FR]: `Emballage de popcorn`,
      [IT]: `Pacchetto di popcorn`,
    },
  },
  genreImage: {
    path: '/Images/genre/',
    height: 24,
    width: 24,
    altPre: {
      [UA]: 'Жанр:',
      [EN]: 'Genre:',
      [RU]: 'Жанр:',
      [ES]: 'Género:',
      [AR]: 'النوع:',
      [DE]: 'Genre:',
      [FR]: 'Genre:',
      [IT]: 'Genere:',
    },
  },
};

export const ONLINE_CHANNEL_LIST_DATA = {
  linkChannel: {
    path: `/${EUrlBaseParam.ONLINE_CHANNEL_LIST}`,
    ariaLabel: {
      [UA]: 'Перейти до каналу',
      [EN]: 'Go to channel',
      [RU]: 'Перейти к каналу',
      [ES]: 'Ir al canal',
      [AR]: 'انتقل إلى القناة',
      [DE]: 'Zum Kanal gehen',
      [FR]: 'Aller au canal',
      [IT]: 'Vai al canale',
    },
  },
  fieldsetFilters: {
    legendText: {
      [UA]: 'Швидкий пошук',
      [EN]: 'Quick search',
      [RU]: 'Быстрый поиск',
      [ES]: 'Búsqueda rápida',
      [AR]: 'بحث سريع',
      [DE]: 'Schnellsuche',
      [FR]: 'Recherche rapide',
      [IT]: 'Ricerca veloce',
    },
    anchorLink: {
      ariaLabel: {
        [UA]: 'Прокрутити сторінку до жанру:',
        [EN]: 'Scroll the page to genre:',
        [RU]: 'Прокрутить страницу к жанру:',
        [ES]: 'Desplazar la página al género:',
        [AR]: 'قم بالتمرير إلى نوع:',
        [DE]: 'Scrollen Sie die Seite zum Genre:',
        [FR]: `Faites défiler la page jusqu'au genre:`,
        [IT]: 'Scorri la pagina al genere:',
      },
    },
  },
};

export const ONLINE_CHANNEL_TOOLTIP_TITLES = {
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
  language: {
    [UA]: 'Мова',
    [EN]: 'Language',
    [RU]: 'Язык',
    [ES]: 'Idioma',
    [AR]: 'اللغة',
    [DE]: 'Sprache',
    [FR]: 'Langue',
    [IT]: 'Lingua',
  },
  views: {
    [UA]: 'Переглядів',
    [EN]: 'Views:',
    [RU]: 'Просмотров',
    [ES]: 'Vistas:',
    [AR]: 'مشاهدات:',
    [DE]: 'Ansichten:',
    [FR]: 'Vues:',
    [IT]: 'Visualizzazioni:',
  },
  description: {
    [UA]: 'Опис',
    [EN]: 'Description',
    [RU]: 'Описание',
    [ES]: 'Descripción',
    [AR]: 'الوصف',
    [DE]: 'Beschreibung',
    [FR]: 'Description',
    [IT]: 'Descrizione',
  },
};

export const getChannelOnlineLinkTitle = (channelName: string) => ({
  [UA]: `Перейти до сторінки з онлайн трансляцією каналу "${channelName}"`,
  [EN]: `Go to the online broadcasting page of "${channelName}" channel`,
  [RU]: `Перейти на страницу онлайн трансляции канала "${channelName}"`,
  [ES]: `Ir a la página de transmisión en línea del canal "${channelName}"`,
  [AR]: `انتقل إلى صفحة البث المباشر لقناة "${channelName}"`,
  [DE]: `Zur Online-Übertragungsseite des Senders "${channelName}" gehen`,
  [FR]: `Accéder à la page de diffusion en ligne de la chaîne "${channelName}"`,
  [IT]: `Vai alla pagina di trasmissione online del canale "${channelName}"`,
});
