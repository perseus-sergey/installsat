import { getTodayYesterdayStr } from '@/libs/utils/dates';
import { ELanguage } from './ui.model';

export const SCHEDULE_META = {
  h1Start: {
    [ELanguage.UA]: 'Програма передач',
    [ELanguage.EN]: 'TV schedule',
  },
  getTitle(chanTitle: string, dateStr: string) {
    const todayYesterday = getTodayYesterdayStr(dateStr) || '';

    return {
      [ELanguage.UA]: `Програма передач каналу «${chanTitle}» на ${todayYesterday && todayYesterday[ELanguage.UA]} ${dateStr}`,
      [ELanguage.EN]: `TV schedule of the channel «${chanTitle}» on ${todayYesterday && todayYesterday[ELanguage.EN]} ${dateStr}`,
    };
  },
  getKeywords(chanTitle: string) {
    return {
      [ELanguage.UA]: `програма передач каналу ${chanTitle} телепрограма телебачення сьогодні завтра вчора на тиждень`,
      [ELanguage.EN]: `program of the channel ${chanTitle} television schedule today tomorrow yesterday this next week`,
    };
  },
  channelList: {
    metaH1: {
      [ELanguage.UA]: 'Програма передач телеканалів',
      [ELanguage.EN]: 'TV schedule of channels',
    },
    metaDescription: {
      [ELanguage.UA]: 'Актуальна програма передач телевізійних каналів',
      [ELanguage.EN]: 'Actual TV channels schedule',
    },
    metaKeywords: {
      [ELanguage.UA]:
        'Програма передач телеканалів розклад телепрограма телебачення сьогодні завтра вчора на тиждень',
      [ELanguage.EN]:
        'The program of TV channels, the schedule, the TV program, today, tomorrow, yesterday, for a week',
    },
  },
  descriptionStart: {
    [ELanguage.UA]: 'Актуальна програма передач каналу',
    [ELanguage.EN]: 'Actual TV schedule of the channel',
  },
  tabsWeek: {
    tabsTitles: {
      [ELanguage.UA]: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Нд'],
      [ELanguage.EN]: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    },
  },
  tabsSource: {
    tabCaptionStart: {
      [ELanguage.UA]: 'Програма',
      [ELanguage.EN]: 'Schedule',
    },
    ariaLabel: {
      [ELanguage.UA]: 'Вибрати джерело',
      [ELanguage.EN]: 'Choose source',
    },
  },
  h2TitleForDate(chanTitle: string, date: string) {
    return {
      [ELanguage.UA]: `Розклад передач каналу ✧${chanTitle}✧ на ${date}`,
      [ELanguage.EN]: `Schedule of the channel ✧${chanTitle}✧ on ${date}`,
    };
  },
  errorMessage: {
    scheduleNotAvailableForDate(chanTitle: string, date: string) {
      return {
        [ELanguage.UA]: `На жаль, розклад передач каналу ✧${chanTitle}✧ на ${date} на даний момент не доступний`,
        [ELanguage.EN]: `Unfortunately, the schedule of the channel ✧${chanTitle}✧ on ${date} is not available at the moment`,
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
    h2Start: {
      [ELanguage.UA]: 'Розклад передач каналу',
      [ELanguage.EN]: 'Schedule of the channel',
    },
  },
};

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
