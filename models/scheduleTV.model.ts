import { getTodayYesterdayStr } from '@/libs/utils/dates';
import { ELanguage, LANGUAGE } from './ui.model';

export const SCHEDULE_META = {
  h1Start: {
    [ELanguage.UA]: 'Програма передач',
    [ELanguage.EN]: 'TV schedule',
  },
  getTitle(chanTitle: string, dateStr: string) {
    const todayYesterday = getTodayYesterdayStr(dateStr) || '';

    return {
      [ELanguage.UA]: `Програма передач каналу «${chanTitle}» на ${todayYesterday && todayYesterday[LANGUAGE]} ${dateStr}`,
      [ELanguage.EN]: `TV schedule of the channel «${chanTitle}» on ${todayYesterday && todayYesterday[LANGUAGE]} ${dateStr}`,
    };
  },
  getKeywords(chanTitle: string) {
    return {
      [ELanguage.UA]: `програма передач каналу ${chanTitle} телепрограма телебачення сьогодні завтра вчора на тиждень`,
      [ELanguage.EN]: `program of the channel ${chanTitle} television schedule today tomorrow yesterday this next week`,
    };
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
