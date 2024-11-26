import { getFormattedDateStrYearFirst } from '@/libs/utils/dates';
import { ELanguage } from './language.model';

const { UA, EN, RU, ES, AR, DE, FR, IT } = ELanguage;

export const LAST_NEWS_INTERVAL = 14;
export const META_TRANS_NEWS_LIST = {
  getH1(interval: number) {
    let addStr;
    if (interval > 180)
      addStr = {
        [UA]: `за ${interval} рік`,
        [EN]: `for ${interval} year`,
        [RU]: `за ${interval} год`,
        [ES]: `por ${interval} año`,
        [AR]: `لمدة ${interval} سنة`,
        [DE]: `für ${interval} Jahr`,
        [FR]: `pour ${interval} an`,
        [IT]: `per ${interval} anno`,
      };
    else {
      const currDate = new Date();
      const startDate = new Date();
      startDate.setDate(currDate.getDate() - interval);
      addStr = {
        [UA]: `з ${getFormattedDateStrYearFirst(startDate, UA)} по ${getFormattedDateStrYearFirst('', UA)}`,
        [EN]: `from ${getFormattedDateStrYearFirst(startDate, EN)} to ${getFormattedDateStrYearFirst('', EN)}`,
        [RU]: `с ${getFormattedDateStrYearFirst(startDate, RU)} по ${getFormattedDateStrYearFirst('', RU)}`,
        [ES]: `desde ${getFormattedDateStrYearFirst(startDate, ES)} hasta ${getFormattedDateStrYearFirst('', ES)}`,
        [AR]: `من ${getFormattedDateStrYearFirst(startDate, AR)} إلى ${getFormattedDateStrYearFirst('', AR)}`,
        [DE]: `von ${getFormattedDateStrYearFirst(startDate, DE)} bis ${getFormattedDateStrYearFirst('', DE)}`,
        [FR]: `de ${getFormattedDateStrYearFirst(startDate, FR)} à ${getFormattedDateStrYearFirst('', FR)}`,
        [IT]: `da ${getFormattedDateStrYearFirst(startDate, IT)} a ${getFormattedDateStrYearFirst('', IT)}`,
      };
    }

    return {
      [UA]: `Транспондерні новини ${addStr[UA]}`,
      [EN]: `Transponder news ${addStr[EN]}`,
      [RU]: `Транспондерные новости ${addStr[RU]}`,
      [ES]: `Noticias de transpondedores ${addStr[ES]}`,
      [AR]: `أخبار الترانسندر للأقمار الصناعية الشهيرة ${addStr[AR]}`,
      [DE]: `Transpondernachrichten beliebter Satelliten ${addStr[DE]}`,
      [FR]: `Actualités des transpondeurs ${addStr[FR]}`,
      [IT]: `Notizie sui transponder ${addStr[IT]}`,
    };
  },
  metaTitle: {
    [UA]: 'Транспондері новини. Супутникові новини.',
    [EN]: 'Transponder news. Satellite news.',
    [RU]: 'Транспондерные новости. Новости спутников.',
    [ES]: 'Noticias de transpondedores. Noticias de satélites.',
    [AR]: 'أخبار الترانسندر. أخبار الأقمار الصناعية.',
    [DE]: 'Transpondernachrichten. Satellitennachrichten.',
    [FR]: 'Actualités des transpondeurs. Actualités des satellites.',
    [IT]: 'Notizie sui transponder. Notizie sui satelliti.',
  },
  metaKeywords: {
    [UA]: `новини супутникового телебачення станом супутникові транспондери частоти канали пакета без абонплати ефірні`,
    [EN]: `news of satellite television, satellite transponders, satellite channels, free TV`,
    [RU]: `новости спутникового телевидения, спутниковые транспондеры, спутниковые каналы, бесплатное ТВ`,
    [ES]: `noticias de televisión por satélite, transpondedores de satélites, canales de satélites, TV gratis`,
    [AR]: `أخبار التلفزيون عبر الأقمار الصناعية، ترانسندر الأقمار الصناعية، قنوات الأقمار الصناعية، التلفاز المجاني`,
    [DE]: `Nachrichten des Satellitenfernsehens, Satellitentransponder, Satellitenkanäle, kostenloses Fernsehen`,
    [FR]: `actualités de la télévision par satellite, transpondeurs de satellites, chaînes de satellites, télévision gratuite`,
    [IT]: `notizie sulla televisione satellitare, trasponder satellitari, canali satellitari, TV gratuita`,
  },
  metaDescription: {
    [EN]: 'Transponder news of popular satellites for the selected time period',
    [UA]: 'Транспондерні новини популярних супутників за обраний період часу',
    [RU]: 'Транспондерные новости популярных спутников за выбранный период времени',
    [ES]: 'Noticias de transpondedores de satélites populares para el período de tiempo seleccionado',
    [AR]: 'أخبار ترانسندر الأقمار الصناعية الشهيرة لفترة الوقت المحددة',
    [DE]: 'Transpondernachrichten beliebter Satelliten für den ausgewählten Zeitraum',
    [FR]: 'Actualités des transpondeurs de satellites populaires pour la période sélectionnée',
    [IT]: 'Notizie sui transponder dei satelliti popolari per il periodo di tempo selezionato',
  },
  h2start: {
    [EN]: 'News of the satellite ',
    [UA]: 'Новини супутника ',
    [RU]: 'Новости спутника ',
    [ES]: 'Noticias del satélite ',
    [AR]: 'أخبار القمر الصناعي ',
    [DE]: 'Nachrichten des Satelliten ',
    [FR]: 'Actualités du satellite ',
    [IT]: 'Notizie del satellite ',
  },
};

export const TRANS_NEWS_LIST_FILTERS = {
  fieldsetTitle: {
    [UA]: 'Виберіть супутники та проміжок часу',
    [EN]: 'Select satellites and time slot',
    [RU]: 'Выберите спутники и временной интервал',
    [ES]: 'Seleccione satélites y franja horaria',
    [AR]: 'حدد الأقمار الصناعية والفترة الزمنية',
    [DE]: 'Wählen Sie Satelliten und Zeitrahmen',
    [FR]: 'Sélectionnez des satellites et une plage horaire',
    [IT]: 'Seleziona satelliti e intervallo di tempo',
  },
  select: {
    satSelect: {
      title: {
        [UA]: 'Виберіть супутники',
        [EN]: 'Select satellites',
        [RU]: 'Выберите спутники',
        [ES]: 'Seleccione satélites',
        [AR]: 'اختر الأقمار الصناعية',
        [DE]: 'Wählen Sie Satelliten',
        [FR]: 'Sélectionnez des satellites',
        [IT]: 'Seleziona satelliti',
      },
      defaultLabel: {
        [EN]: '--= All Satellites =--',
        [UA]: '--= Всі Супутники =--',
        [RU]: '--= Все Спутники =--',
        [ES]: '--= Todos los satélites =--',
        [AR]: '--= جميع الأقمار الصناعية =--',
        [DE]: '--= Alle Satelliten =--',
        [FR]: '--= Tous les satellites =--',
        [IT]: '--= Tutti i satelliti =--',
      },
      westDirectionLabel: {
        [EN]: 'West direction',
        [UA]: 'Західний напрямок',
        [RU]: 'Западное направление',
        [ES]: 'Dirección oeste',
        [AR]: 'الاتجاه الغربي',
        [DE]: 'Westliche Richtung',
        [FR]: 'Direction ouest',
        [IT]: 'Direzione ovest',
      },
      eastDirectionLabel: {
        [EN]: 'East direction',
        [UA]: 'Східний напрямок',
        [RU]: 'Восточное направление',
        [ES]: 'Dirección este',
        [AR]: 'الاتجاه الشرقي',
        [DE]: 'Östliche Richtung',
        [FR]: 'Direction est',
        [IT]: 'Direzione est',
      },
    },
  },

  resetButton: {
    title: {
      [EN]: 'Reset filters',
      [UA]: 'Скинути фільтри',
      [RU]: 'Сбросить фильтры',
      [ES]: 'Restablecer filtros',
      [AR]: 'إعادة تعيين الفلاتر',
      [DE]: 'Filter zurücksetzen',
      [FR]: 'Réinitialiser les filtres',
      [IT]: 'Ripristina i filtri',
    },
    ariaLabel: {
      [EN]: 'Reset all filters',
      [UA]: 'Скинути всі фільтри',
      [RU]: 'Сбросить все фильтры',
      [ES]: 'Restablecer todos los filtros',
      [AR]: 'إعادة تعيين جميع الفلاتر',
      [DE]: 'Alle Filter zurücksetzen',
      [FR]: 'Réinitialiser tous les filtres',
      [IT]: 'Ripristina tutti i filtri',
    },
  },
};

export const TRANS_NEWS_LIST_IMAGES = {
  satLogo: {
    path: '/Images/satellites/',
    height: 50,
    width: 67,
    defaultImg: {
      src: '/Images/satellites/wrong_sat_64.png',
      height: 64,
      width: 64,
    },
    alt: {
      [UA]: `Логотип компанії супутника: `,
      [EN]: `Company logo of satellite: `,
      [RU]: `Логотип компании спутника: `,
      [ES]: `Logotipo de la empresa de satélite: `,
      [AR]: `شعار شركة القمر الصناعي: `,
      [DE]: `Firmenlogo des Satelliten: `,
      [FR]: `Logo de l'entreprise de satellite: `,
      [IT]: `Logo dell'azienda satellitare: `,
    },
  },
};
export const META_TRANS_NEWS_SINGLE = {
  metaH1start: {
    [UA]: 'Транспондерні новини за',
    [EN]: 'Transponder news for',
    [RU]: 'Транспондерные новости за',
    [ES]: 'Noticias del transpondedor para',
    [AR]: 'أخبار الترانسوندير لـ',
    [DE]: 'Transponder-Nachrichten für',
    [FR]: 'Nouvelles du transpondeur pour',
    [IT]: 'Notizie del transponder per',
  },
  metaTitleStart: {
    [UA]: `Installsat - транспондерні новини за`,
    [EN]: `Installsat - Transponder news for`,
    [RU]: `Installsat - Транспондерные новости за`,
    [ES]: `Installsat - Noticias del transpondedor para`,
    [AR]: `Installsat - أخبار الترانسوندير لـ`,
    [DE]: `Installsat - Transponder-Nachrichten für`,
    [FR]: `Installsat - Nouvelles du transpondeur pour`,
    [IT]: `Installsat - Notizie del transponder per`,
  },
  metaKeywordsStart: {
    [UA]: `транспондерні супутникові новини`,
    [EN]: `transponder satellite news`,
    [RU]: `транспондерные спутниковые новости`,
    [ES]: `noticias de satélite del transpondedor`,
    [AR]: `أخبار الأقمار الصناعية للترانسوندير`,
    [DE]: `Transponder-Satelliten-Nachrichten`,
    [FR]: `actualités satellites du transpondeur`,
    [IT]: `notizie satellitari del transponder`,
  },
  metaDescriptionStart: {
    [UA]: `Супутникові новини за`,
    [EN]: `Satellite news for`,
    [RU]: `Спутниковые новости за`,
    [ES]: `Noticias de satélites para`,
    [AR]: `أخبار الأقمار الصناعية لـ`,
    [DE]: `Satelliten Nachrichten für`,
    [FR]: `Actualités satellites pour`,
    [IT]: `Notizie satellitari per`,
  },
};

export interface TSatDigest {
  id: number;
  date: Date | string;
  update: number;
  text: string;
  sat_slug: string | null;
  sat: number;
  country: string;
  satTitle: string;
  satLogo: string;
  satGrade: string | null;
  satPosition: string;
}

export interface IStateOption {
  readonly value: string | number;
  readonly label: string;
}

export const getDigestIntervalOptions = (
  lang: ELanguage
): readonly IStateOption[] => {
  const currentYear = new Date().getFullYear();

  // Масив з мовними варіантами для інтервалів
  const intervalLabels = {
    [UA]: [
      'Останні 7 днів',
      'Останні 30 днів',
      'Останні 90 днів',
      'Останні півроку',
    ],
    [RU]: [
      'Последние 7 дней',
      'Последние 30 дней',
      'Последние 90 дней',
      'Последние полгода',
    ],
    [ES]: [
      'Últimos 7 días',
      'Últimos 30 días',
      'Últimos 90 días',
      'Últimos seis meses',
    ],
    [AR]: ['آخر 7 أيام', 'آخر 30 يومًا', 'آخر 90 يومًا', 'آخر ستة أشهر'],
    [DE]: [
      'Letzte 7 Tage',
      'Letzte 30 Tage',
      'Letzte 90 Tage',
      'Letzte sechs Monate',
    ],
    [FR]: [
      'Derniers 7 jours',
      'Derniers 30 jours',
      'Derniers 90 jours',
      'Derniers six mois',
    ],
    [IT]: [
      'Ultimi 7 giorni',
      'Ultimi 30 giorni',
      'Ultimi 90 giorni',
      'Ultimi sei mesi',
    ],
    [EN]: ['Last 7 days', 'Last 30 days', 'Last 90 days', 'Last six months'],
  };

  // Функція для формування мітки з року
  const getYearLabel = (year: number): string => {
    const yearLabel = {
      [UA]: 'рік',
      [RU]: 'год',
      [ES]: 'año',
      [AR]: 'سنة',
      [DE]: 'Jahr',
      [FR]: 'an',
      [IT]: 'anno',
      [EN]: 'year',
    };

    return `${year} ${yearLabel[lang] || yearLabel[EN]}`;
  };

  // Формуємо масив з років
  const yearArray = Array.from({ length: 5 }, (_, i) => {
    const year = currentYear - i;

    return {
      value: year,
      label: getYearLabel(year),
    };
  });

  // Формуємо масив з інтервалів
  const intervals = [7, 30, 90, 180].map((value, index) => ({
    value,
    label: intervalLabels[lang][index] || intervalLabels[EN][index],
  }));

  return [...intervals, ...yearArray];
};

export const getDateLinkTitle = (dateStr: string) => ({
  [UA]: `Дивитись всі транспондерні новини за ${dateStr}`,
  [EN]: `View all transponder news for ${dateStr}`,
  [RU]: `Посмотреть все транспондерные новости за ${dateStr}`,
  [ES]: `Ver todas las noticias de transpondedores para ${dateStr}`,
  [AR]: `عرض جميع أخبار الترانسبوندر لـ ${dateStr}`,
  [DE]: `Alle Transpondernachrichten für ${dateStr} ansehen`,
  [FR]: `Voir toutes les nouvelles des transpondeurs pour ${dateStr}`,
  [IT]: `Vedi tutte le notizie sui transponder per ${dateStr}`,
});

export const getSatLinkTitle = (satTitle: string) => ({
  [UA]: `Дивитись всі канали з супутника ${satTitle}`,
  [EN]: `View all channels from the satellite ${satTitle}`,
  [RU]: `Смотреть все каналы с спутника ${satTitle}`,
  [ES]: `Ver todos los canales del satélite ${satTitle}`,
  [AR]: `عرض جميع القنوات من القمر الصناعي ${satTitle}`,
  [DE]: `Alle Kanäle vom Satelliten ${satTitle} anzeigen`,
  [FR]: `Voir toutes les chaînes du satellite ${satTitle}`,
  [IT]: `Vedi tutti i canali dal satellite ${satTitle}`,
});

export const EMPTY_DATA_DESCRIPTION = {
  [UA]: 'Немає новин за вказаний період',
  [EN]: 'No news for the specified period',
  [RU]: 'Нет новостей за указанный период',
  [ES]: 'No hay noticias para el período especificado',
  [AR]: 'لا توجد أخبار للفترة المحددة',
  [DE]: 'Keine Nachrichten für den angegebenen Zeitraum',
  [FR]: 'Aucune nouvelle pour la période spécifiée',
  [IT]: 'Nessuna notizia per il periodo specificato',
};
