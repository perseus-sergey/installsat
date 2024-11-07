import { ELanguage } from '../language.model';
import { EUrlBaseParam } from '../url/url.model';

const { UA, EN, RU, ES, AR, DE, FR, IT } = ELanguage;

export const META_PACKAGE_CHANNEL_LIST = {
  getH1(packageName: string, searchQuery: string) {
    return {
      [UA]: `Список каналів телебачення «${packageName}»${searchQuery && ` назва яких містить «${searchQuery}»`}`,
      [EN]: `List of channels «${packageName}» TV${searchQuery && ` the name of which contains «${searchQuery}»`}`,
      [RU]: `Список каналов телевидения «${packageName}»${searchQuery && ` название которых содержит «${searchQuery}»`}`,
      [ES]: `Lista de canales de televisión «${packageName}»${searchQuery && ` cuyo nombre contiene «${searchQuery}»`}`,
      [AR]: `قائمة قنوات التلفزيون «${packageName}»${searchQuery && ` التي يحتوي اسمها على «${searchQuery}»`}`,
      [DE]: `Liste der Kanäle «${packageName}» TV${searchQuery && ` deren Namen «${searchQuery}» enthält`}`,
      [FR]: `Liste des chaînes «${packageName}» TV${searchQuery && ` dont le nom contient «${searchQuery}»`}`,
      [IT]: `Elenco dei canali «${packageName}» TV${searchQuery && ` il cui nome contiene «${searchQuery}»`}`,
    };
  },
  metaTitle: {
    [UA]: 'Список каналів',
    [EN]: 'List of channels',
    [RU]: 'Список каналов',
    [ES]: 'Lista de canales',
    [AR]: 'قائمة القنوات',
    [DE]: 'Liste der Kanäle',
    [FR]: 'Liste des chaînes',
    [IT]: 'Elenco dei canali',
  },
  metaKeywords: {
    [UA]: 'телебачення, трансляція каналів, високоякісне телебачення, цифрове, компанія, провайдер, пакет, телевізійні антени',
    [EN]: 'television, channel streaming, high-quality television, digital, company, provider, package, TV antennas',
    [RU]: 'телевидение, трансляция каналов, высококачественное телевидение, цифровое, компания, провайдер, пакет, телевизионные антенны',
    [ES]: 'televisión, transmisión de canales, televisión de alta calidad, digital, empresa, proveedor, paquete, antenas de televisión',
    [AR]: 'التلفزيون ، بث القنوات ، التلفزيون عالي الجودة ، رقمي ، شركة ، مزود ، حزمة ، هوائيات التلفزيون',
    [DE]: 'Fernsehen, Kanalübertragung, hochwertiges Fernsehen, digital, Unternehmen, Anbieter, Paket, TV-Antennen',
    [FR]: 'télévision, diffusion de chaînes, télévision haute qualité, numérique, entreprise, fournisseur, paquet, antennes de télévision',
    [IT]: 'televisione, streaming di canali, televisione di alta qualità, digitale, azienda, fornitore, pacchetto, antenne TV',
  },
};

export const PACKAGE_CHANNEL_LIST_IMAGES = {
  h1Image: {
    path: '/Images/packages/',
    height: 128,
    width: 128,
    defaultImage: {
      src: '/Images/packages/package_placeholder.png',
      height: 128,
      width: 128,
    },
    alt: {
      [UA]: `Логотип компанії`,
      [EN]: `Company logo`,
      [RU]: `Логотип компании`,
      [ES]: `Logotipo de la empresa`,
      [AR]: `شعار الشركة`,
      [DE]: `Unternehmenslogo`,
      [FR]: `Logo de l'entreprise`,
      [IT]: `Logo dell'azienda`,
    },
  },
  subCatImage: {
    path: '/Images/packages/',
    defaultImgSrc: '/Images/packages/sub_package_placeholder_82.png',
    height: 82,
    width: 82,
    altPre: {
      [UA]: 'Іконка пакету каналів:',
      [EN]: 'Icon of package channels:',
      [RU]: 'Иконка пакета каналов:',
      [ES]: 'Ícono del paquete de canales:',
      [AR]: 'أيقونة حزمة القنوات:',
      [DE]: 'Symbol des Kanalpakets:',
      [FR]: 'Icône du paquet de chaînes:',
      [IT]: 'Icona del pacchetto di canali:',
    },
  },
};

export const PACKAGE_CHANNEL_LIST_DATA = {
  linkChannel: {
    ariaLabel: {
      [UA]: 'Деталі каналу',
      [EN]: 'Channel details',
      [RU]: 'Детали канала',
      [ES]: 'Detalles del canal',
      [AR]: 'تفاصيل القناة',
      [DE]: 'Kanal Details',
      [FR]: 'Détails de la chaîne',
      [IT]: 'Dettagli del canale',
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
      [IT]: 'Ricerca rapida',
    },
    anchorLink: {
      ariaLabel: {
        [UA]: 'Прокрутити сторінку до списку каналів пакету:',
        [EN]: 'Scroll the page to package channels list:',
        [RU]: 'Прокрутить страницу к списку каналов пакета:',
        [ES]: 'Desplazarse a la lista de canales del paquete:',
        [AR]: 'قم بالتمرير إلى قائمة قنوات الحزمة:',
        [DE]: 'Scrollen Sie zur Liste der Paketkanäle:',
        [FR]: `Faites défiler la page jusqu'à la liste des chaînes du paquet:`,
        [IT]: `Scorri la pagina fino all'elenco dei canali del pacchetto:`,
      },
    },
  },
  getPriceString(price: number) {
    return {
      [UA]: `Вартість пакету ${price} грн/міс`,
      [EN]: `Package price ${price} UAH/month`,
      [RU]: `Цена пакета ${price} грн./мес`,
      [ES]: `Precio del paquete ${price} UAH/mes`,
      [AR]: `سعر الحزمة ${price} UAH/month`,
      [DE]: `Paketpreis ${price} UAH/month`,
      [FR]: `Prix du paquet ${price} UAH/month`,
      [IT]: `Prezzo del pacchetto ${price} UAH/month`,
    };
  },
  similarLinks: {
    title: {
      [UA]: 'Корисні посилання:',
      [EN]: 'Useful links:',
      [RU]: 'Полезные ссылки:',
      [ES]: 'Enlaces útiles:',
      [AR]: 'روابط مفيدة:',
      [DE]: 'Nützliche Links:',
      [FR]: 'Liens utiles:',
      [IT]: 'Link utili:',
    },
    beforeLinkText: {
      [UA]: 'Пакет каналів',
      [EN]: 'Channel package',
      [RU]: 'Пакет каналов',
      [ES]: 'Paquete de canales',
      [AR]: 'حزمة القنوات',
      [DE]: 'Kanalpaket',
      [FR]: 'Paquet de chaînes',
      [IT]: 'Pacchetto canali',
    },
  },
};

export const META_PACKAGES = {
  metaH1: {
    [UA]: 'Пакети каналів цифрового супутникового та ефірного телебачення',
    [EN]: 'Digital satellite and television packages',
    [RU]: 'Пакеты цифрового спутникового и эфирного телевидения',
    [ES]: 'Paquetes de canales de televisión digital por satélite',
    [AR]: 'حزم القنوات الرقمية للتلفزيون عبر الأقمار الصناعية',
    [DE]: 'Pakete für digitale Satelliten- und Fernsehsender',
    [FR]: 'Forfaits de chaînes de télévision numérique par satellite',
    [IT]: 'Pacchetti di canali televisivi digitali via satellite',
  },
  metaTitle: {
    [UA]: 'Пакети каналів',
    [EN]: 'TV channel packages',
    [RU]: 'Пакеты телеканалов',
    [ES]: 'Paquetes de canales de televisión',
    [AR]: 'حزم قنوات التلفزيون',
    [DE]: 'TV-Kanalpakete',
    [FR]: 'Forfaits de chaînes de télévision',
    [IT]: 'Pacchetti di canali TV',
  },
  metaDescription: {
    [UA]: 'Пакети каналів цифрового супутникового та ефірного телебачення',
    [EN]: 'Digital satellite and television packages',
    [RU]: 'Пакеты цифрового спутникового и эфирного телевидения',
    [ES]: 'Paquetes de canales de televisión digital por satélite',
    [AR]: 'حزم القنوات الرقمية للتلفزيون عبر الأقمار الصناعية',
    [DE]: 'Pakete für digitale Satelliten- und Fernsehsender',
    [FR]: 'Forfaits de chaînes de télévision numérique par satellite',
    [IT]: 'Pacchetti di canali televisivi digitali via satellite',
  },
  metaKeywords: {
    [UA]: 'канали пакета без абонплати, віасат, viasat, xtra tv, t2, ua тв, ефірні',
    [EN]: 'package channels without subscription, viasat, viasat, xtra tv, t2, ua tv, television',
    [RU]: 'каналы пакета без подписки, виасат, xtra tv, t2, ua тв, эфирные',
    [ES]: 'canales de paquetes sin suscripción, viasat, xtra tv, t2, ua tv, televisión',
    [AR]: 'قنوات الحزمة بدون اشتراك، فياسات، xtra tv، t2، ua tv، تلفزيون',
    [DE]: 'Pakete ohne Abonnement, viasat, xtra tv, t2, ua tv, Fernsehen',
    [FR]: 'chaînes de paquets sans abonnement, viasat, xtra tv, t2, ua tv, télévision',
    [IT]: 'canali pacchetti senza abbonamento, viasat, xtra tv, t2, ua tv, televisione',
  },
};

export const PACKAGES_IMAGES = {
  packageImage: {
    path: '/Images/packages/',
    width: 100,
    height: 86,
    altPre: {
      [UA]: `Логотип до пакету:`,
      [EN]: `Logo for package:`,
      [RU]: `Логотип для пакета:`,
      [ES]: `Logotipo del paquete:`,
      [AR]: `شعار الحزمة:`,
      [DE]: `Logo für das Paket:`,
      [FR]: `Logo pour le paquet:`,
      [IT]: `Logo per il pacchetto:`,
    },

    defaultImg: {
      src: '/Images/channelsOptimized/zastavka.jpg',
      height: 100,
      width: 100,
    },
    alternativeStr: { title: '🎞', fontSize: '6rem' },
  },
};

export const BREAD_PACKAGE_CHANNEL_LIST = {
  href: EUrlBaseParam.PACKAGE_CHANNEL_LIST,
  title: {
    [UA]: 'Список пакетів',
    [EN]: 'List of packages',
    [RU]: 'Список пакетов',
    [ES]: 'Lista de paquetes',
    [AR]: 'قائمة الحزم',
    [DE]: 'Paketliste',
    [FR]: 'Liste des forfaits',
    [IT]: 'Elenco dei pacchetti',
  },
};

export const getSimilarPackagesTitle = (title: string) => ({
  [UA]: `Перейти до списку каналів пакету "${title}"`,
  [EN]: `Go to the channel list of the "${title}" package`,
  [RU]: `Перейти к списку каналов пакета "${title}"`,
  [ES]: `Ir a la lista de canales del paquete "${title}"`,
  [AR]: `انتقل إلى قائمة قنوات الحزمة "${title}"`,
  [DE]: `Zur Kanalliste des Pakets "${title}" gehen`,
  [FR]: `Aller à la liste des chaînes du forfait "${title}"`,
  [IT]: `Vai alla lista dei canali del pacchetto "${title}"`,
});

export const getChanDetailLinkAriaLabel = (chanTitle: string) => ({
  [UA]: `Перейти до перегляду детальних параметрів каналу "${chanTitle}"`,
  [EN]: `Go to view details of the channel "${chanTitle}"`,
  [RU]: `Перейти к просмотру деталей канала "${chanTitle}"`,
  [ES]: `Ir a ver los detalles del canal "${chanTitle}"`,
  [AR]: `انتقل إلى عرض تفاصيل القناة "${chanTitle}"`,
  [DE]: `Gehe zu den Details des Kanals "${chanTitle}"`,
  [FR]: `Aller voir les détails de la chaîne "${chanTitle}"`,
  [IT]: `Vai a vedere i dettagli del canale "${chanTitle}"`,
});
