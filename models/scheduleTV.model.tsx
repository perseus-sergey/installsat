import { getTodayYesterdayStr } from '@/libs/utils/dateLuxon';
import { ELanguage } from './language.model';
import { EUrlBaseParam } from './url/url.model';

export interface IScheduleTVModel {
  id: string;
  start: Date;
  end: Date;
  chan_id: string;
  title: string;
  prog_desc?: string;
}

export interface IVseTvParsModel {
  id: string;
  vsetv: string;
  title: string;
  cpu: string;
}
export interface IVseTvErrorChannel extends IVseTvParsModel {
  channelEditUrl: string;
  sourceChannelUrl: string;
  parseUrl: string;
  error: string;
}

export const DEFAULT_TIME_ZONE = 'Europe/Kiev';

const { UA, EN, RU, ES, AR, DE, FR, IT } = ELanguage;

export const SCHEDULE_META = {
  getTitle(chanTitle: string, dateStr: string) {
    const todayYesterday = getTodayYesterdayStr(dateStr) || '';

    return {
      [UA]: `Програма передач каналу «${chanTitle}» на ${todayYesterday && todayYesterday[UA]} ${dateStr}`,
      [EN]: `TV schedule of the channel «${chanTitle}» on ${todayYesterday && todayYesterday[EN]} ${dateStr}`,
      [RU]: `Программа канала «${chanTitle}» на ${todayYesterday && todayYesterday[RU]} ${dateStr}`,
      [ES]: `Programa del canal «${chanTitle}» el ${todayYesterday && todayYesterday[ES]} ${dateStr}`,
      [AR]: `جدول قناة «${chanTitle}» في ${todayYesterday && todayYesterday[AR]} ${dateStr}`,
      [DE]: `Programm des Kanals «${chanTitle}» am ${todayYesterday && todayYesterday[DE]} ${dateStr}`,
      [FR]: `Programme du canal «${chanTitle}» le ${todayYesterday && todayYesterday[FR]} ${dateStr}`,
      [IT]: `Programma del canale «${chanTitle}» il ${todayYesterday && todayYesterday[IT]} ${dateStr}`,
    };
  },
  getKeywords(chanTitle: string) {
    return {
      [UA]: `програма передач каналу ${chanTitle} телепрограма телебачення сьогодні завтра вчора на тиждень`,
      [EN]: `program of the channel ${chanTitle} television schedule today tomorrow yesterday this next week`,
      [RU]: `программа канала ${chanTitle} телепрограмма телевидение сегодня завтра вчера на неделю`,
      [ES]: `programa del canal ${chanTitle} televisión hoy mañana ayer para la semana`,
      [AR]: `برنامج قناة ${chanTitle} جدول التلفاز اليوم غدا أمس الأسبوع`,
      [DE]: `Programm des Kanals ${chanTitle} Fernsehprogramm heute morgen gestern für die Woche`,
      [FR]: `programme de la chaîne ${chanTitle} télévision aujourd'hui demain hier pour la semaine`,
      [IT]: `programma del canale ${chanTitle} TV oggi domani ieri per la settimana`,
    };
  },
  channelList: {
    metaH1: {
      [UA]: 'Програма передач телеканалів',
      [EN]: 'TV schedule of channels',
      [RU]: 'Программа телеканалов',
      [ES]: 'Programa de TV de los canales',
      [AR]: 'جدول قنوات التلفاز',
      [DE]: 'TV-Programm der Kanäle',
      [FR]: 'Programme TV des chaînes',
      [IT]: 'Programma TV dei canali',
    },
    metaDescription: {
      [UA]: 'Актуальна програма передач телевізійних каналів',
      [EN]: 'Actual TV channels schedule',
      [RU]: 'Актуальная программа передач телеканалов',
      [ES]: 'Programación actual de canales de TV',
      [AR]: 'جدول قنوات التلفاز الحالي',
      [DE]: 'Aktuelles TV-Programm der Kanäle',
      [FR]: 'Programme TV actuel des chaînes',
      [IT]: 'Programma attuale dei canali TV',
    },
    metaKeywords: {
      [UA]: 'Програма передач телеканалів розклад телепрограма телебачення сьогодні завтра вчора на тиждень',
      [EN]: 'The program of TV channels, the schedule, the TV program, today, tomorrow, yesterday, for a week',
      [RU]: 'Программа телеканалов, расписание, телепрограмма, телевидение, сегодня, завтра, вчера, на неделю',
      [ES]: 'Programación de canales de TV, el horario, el programa de TV, hoy, mañana, ayer, para la semana',
      [AR]: 'برنامج قنوات التلفاز، الجدول، برنامج التلفاز، اليوم، غدا، أمس، الأسبوع',
      [DE]: 'Das Programm der TV-Kanäle, der Zeitplan, das TV-Programm, heute, morgen, gestern, für die Woche',
      [FR]: "Le programme des chaînes de télévision, le calendrier, le programme de télévision, aujourd'hui, demain, hier, pour la semaine",
      [IT]: "Il programma dei canali TV, l'orario, il programma TV, oggi, domani, ieri, per la settimana",
    },
  },
  descriptionStart: {
    [UA]: 'Актуальна програма передач каналу',
    [EN]: 'Actual TV schedule of the channel',
    [RU]: 'Актуальная программа передач канала',
    [ES]: 'Programa de TV actual del canal',
    [AR]: 'الجدول التلفزيوني الحالي للقناة',
    [DE]: 'Aktueller TV-Plan des Kanals',
    [FR]: 'Programme TV actuel de la chaîne',
    [IT]: 'Programma TV attuale del canale',
  },
  tabsWeek: {
    tabsTitles: {
      [UA]: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Нд'],
      [EN]: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      [RU]: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
      [ES]: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
      [AR]: [
        'الإثنين',
        'الثلاثاء',
        'الأربعاء',
        'الخميس',
        'الجمعة',
        'السبت',
        'الأحد',
      ],
      [DE]: ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'],
      [FR]: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
      [IT]: ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'],
    },
  },
  tabsSource: {
    tabCaptionStart: {
      [UA]: 'Програма',
      [EN]: 'Schedule',
      [RU]: 'Программа',
      [ES]: 'Horario',
      [AR]: 'جدول',
      [DE]: 'Zeitplan',
      [FR]: 'Programme',
      [IT]: 'Programma',
    },
    ariaLabel: {
      [UA]: 'Вибрати джерело',
      [EN]: 'Choose source',
      [RU]: 'Выбрать источник',
      [ES]: 'Elegir fuente',
      [AR]: 'اختر المصدر',
      [DE]: 'Quelle wählen',
      [FR]: 'Choisir la source',
      [IT]: 'Scegli la fonte',
    },
  },
  h2TitleForDate(chanTitle: string, date: string) {
    return {
      [UA]: `Розклад передач каналу ✧${chanTitle}✧ на ${date}`,
      [EN]: `Schedule of the channel ✧${chanTitle}✧ on ${date}`,
      [RU]: `Расписание передач канала ✧${chanTitle}✧ на ${date}`,
      [ES]: `Horario del canal ✧${chanTitle}✧ el ${date}`,
      [AR]: `جدول برامج القناة ✧${chanTitle}✧ ليوم ${date}`,
      [DE]: `Programm des Kanals ✧${chanTitle}✧ am ${date}`,
      [FR]: `Programme de la chaîne ✧${chanTitle}✧ pour le ${date}`,
      [IT]: `Programma del canale ✧${chanTitle}✧ per il ${date}`,
    };
  },

  errorMessage: {
    scheduleNotAvailableForDate(chanTitle: string, date: string) {
      return {
        [UA]: `На жаль, розклад передач каналу ✧${chanTitle}✧ на ${date} на даний момент не доступний`,
        [EN]: `Unfortunately, the schedule of the channel ✧${chanTitle}✧ on ${date} is not available at the moment`,
        [RU]: `К сожалению, расписание канала ✧${chanTitle}✧ на ${date} в данный момент недоступно`,
        [ES]: `Desafortunadamente, el horario del canal ✧${chanTitle}✧ el ${date} no está disponible en este momento`,
        [AR]: `للأسف، جدول مواعيد قناة ✧${chanTitle}✧ ليوم ${date} غير متوفر حاليًا`,
        [DE]: `Leider ist der Sendeplan des Kanals ✧${chanTitle}✧ für den ${date} derzeit nicht verfügbar`,
        [FR]: `Malheureusement, l'horaire de la chaîne ✧${chanTitle}✧ pour le ${date} n'est pas disponible pour le moment`,
        [IT]: `Purtroppo, il programma del canale ✧${chanTitle}✧ per il ${date} non è disponibile al momento`,
      };
    },
  },
  scheduleShort: {
    descriptionMaxLength: 250,
    defaultHoursBeforeNow: 4,
    defaultRowsLimit: 15,
    exceptGenreIDs: [2, 6, 8, 14], // 'tematika-novosti' 'detskiye' 'tematika-muzikalnyie' 'tematika-fashion'
    exceptHoursBeforeNow: 2,
    exceptRowsLimit: 20,
    getH2(chanTitle: string) {
      return {
        [UA]: `Розклад передач каналу ✧${chanTitle}✧`,
        [EN]: `TV schedule for channel ✧${chanTitle}✧`,
        [RU]: `Расписание передач канала ✧${chanTitle}✧`,
        [ES]: `Horario de programas del canal ✧${chanTitle}✧`,
        [AR]: `جدول برامج قناة ✧${chanTitle}✧`,
        [DE]: `Sendungsplan für den Kanal ✧${chanTitle}✧`,
        [FR]: `Programme du canal ✧${chanTitle}✧`,
        [IT]: `Programma del canale ✧${chanTitle}✧`,
      };
    },
  },
};

export const BREAD_TV_SCHEDULE = {
  href: EUrlBaseParam.CHANNELS_TV_PROGRAM,
  title: {
    [UA]: 'Програма каналів',
    [EN]: 'Channel program',
    [RU]: 'Программа каналов',
    [ES]: 'Programación de canales',
    [AR]: 'برنامج القنوات',
    [DE]: 'Kanalprogramm',
    [FR]: 'Programme des chaînes',
    [IT]: 'Programma canali',
  },
};

export const BREAD_TV_SCHEDULE_LIST = {
  href: EUrlBaseParam.ONLINE_CHANNEL_LIST,
  title: {
    [UA]: 'Список онлайн каналів',
    [EN]: 'Online channel list',
    [RU]: 'Список онлайн-каналов',
    [ES]: 'Lista de canales en línea',
    [AR]: 'قائمة القنوات على الإنترنت',
    [DE]: 'Liste der Online-Kanäle',
    [FR]: 'Liste des chaînes en ligne',
    [IT]: 'Elenco dei canali online',
  },
};

export const getChannelScheduleTitle = (
  lang: ELanguage,
  date: string,
  channelName: string
) => {
  switch (lang) {
    case UA:
      return (
        <>
          {`Програма передач каналу "${channelName}" за `}
          <time dateTime={date}>{date}</time>
        </>
      );
    case EN:
      return (
        <>
          {`Channel "${channelName}" schedule for `}
          <time dateTime={date}>{date}</time>
        </>
      );
    case RU:
      return (
        <>
          {`Программа передач канала "${channelName}" на `}
          <time dateTime={date}>{date}</time>
        </>
      );
    case ES:
      return (
        <>
          {`Horario del canal "${channelName}" para `}
          <time dateTime={date}>{date}</time>
        </>
      );
    case AR:
      return (
        <>
          {`جدول قناة "${channelName}" ليوم `}
          <time dateTime={date}>{date}</time>
        </>
      );
    case DE:
      return (
        <>
          {`Programm des Kanals "${channelName}" für `}
          <time dateTime={date}>{date}</time>
        </>
      );
    case FR:
      return (
        <>
          {`Programme de la chaîne "${channelName}" pour `}
          <time dateTime={date}>{date}</time>
        </>
      );
    case IT:
      return (
        <>
          {`Programma del canale "${channelName}" per `}
          <time dateTime={date}>{date}</time>
        </>
      );
    default:
      return (
        <>
          {`Channel "${channelName}" schedule for `}
          <time dateTime={date}>{date}</time>
        </>
      );
  }
};

export const getTabLinkAriaL = (channelName: string, dateStr: string) => ({
  [UA]: `Дивитись розклад передач каналу "${channelName}" за ${dateStr}`,
  [EN]: `Watch channel schedule for "${channelName}" on ${dateStr}`,
  [RU]: `Смотреть расписание передач канала "${channelName}" на ${dateStr}`,
  [ES]: `Ver el horario del canal "${channelName}" para el ${dateStr}`,
  [AR]: `شاهد جدول القناة "${channelName}" بتاريخ ${dateStr}`,
  [DE]: `Programm des Senders "${channelName}" für den ${dateStr} ansehen`,
  [FR]: `Voir le programme de la chaîne "${channelName}" pour le ${dateStr}`,
  [IT]: `Guarda il palinsesto del canale "${channelName}" per il ${dateStr}`,
});

export const MONTH_BY_LANG = {
  [UA]: [
    'січня',
    'лютого',
    'березня',
    'квітня',
    'травня',
    'червня',
    'липня',
    'серпня',
    'вересня',
    'жовтня',
    'листопада',
    'грудня',
  ],
  [EN]: [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ],
  [RU]: [
    'января',
    'февраля',
    'марта',
    'апреля',
    'мая',
    'июня',
    'июля',
    'августа',
    'сентября',
    'октября',
    'ноября',
    'декабря',
  ],
  [ES]: [
    'enero',
    'febrero',
    'marzo',
    'abril',
    'mayo',
    'junio',
    'julio',
    'agosto',
    'septiembre',
    'octubre',
    'noviembre',
    'diciembre',
  ],
  [AR]: [
    'يناير',
    'فبراير',
    'مارس',
    'أبريل',
    'مايو',
    'يونيو',
    'يوليو',
    'أغسطس',
    'سبتمبر',
    'أكتوبر',
    'نوفمبر',
    'ديسمبر',
  ],
  [DE]: [
    'Januar',
    'Februar',
    'März',
    'April',
    'Mai',
    'Juni',
    'Juli',
    'August',
    'September',
    'Oktober',
    'November',
    'Dezember',
  ],
  [FR]: [
    'janvier',
    'février',
    'mars',
    'avril',
    'mai',
    'juin',
    'juillet',
    'août',
    'septembre',
    'octobre',
    'novembre',
    'décembre',
  ],
  [IT]: [
    'gennaio',
    'febbraio',
    'marzo',
    'aprile',
    'maggio',
    'giugno',
    'luglio',
    'agosto',
    'settembre',
    'ottobre',
    'novembre',
    'dicembre',
  ],
};
