import { DateTime } from 'luxon';

import { ELanguage } from '@/models/language.model';

const getUserTimeZone = () => Intl.DateTimeFormat().resolvedOptions().timeZone;

export const getDateInISO = (dateStr: string) =>
  DateTime.fromISO(dateStr, {
    zone: getUserTimeZone(),
  }).toISODate();

export const getTodayYesterdayStr = (
  dateStr: string
): Record<ELanguage, string> | null => {
  if (!dateStr) return null;

  const currentDate = DateTime.now().startOf('day');
  const targetDate = DateTime.fromISO(dateStr).startOf('day');

  const diffDays = targetDate.diff(currentDate, 'days').days;

  if (diffDays === 0) {
    return {
      [ELanguage.UA]: 'сьогодні',
      [ELanguage.EN]: 'today',
      [ELanguage.RU]: 'сегодня',
      [ELanguage.ES]: 'hoy',
      [ELanguage.AR]: 'اليوم',
      [ELanguage.DE]: 'heute',
      [ELanguage.FR]: `aujourd'hui`,
      [ELanguage.IT]: 'oggi',
    };
  } else if (diffDays === 1) {
    return {
      [ELanguage.UA]: 'завтра',
      [ELanguage.EN]: 'tomorrow',
      [ELanguage.RU]: 'завтра',
      [ELanguage.ES]: 'mañana',
      [ELanguage.AR]: 'غدًا',
      [ELanguage.DE]: 'morgen',
      [ELanguage.FR]: 'demain',
      [ELanguage.IT]: 'domani',
    };
  } else if (diffDays === -1) {
    return {
      [ELanguage.UA]: 'вчора',
      [ELanguage.EN]: 'yesterday',
      [ELanguage.RU]: 'вчера',
      [ELanguage.ES]: 'ayer',
      [ELanguage.AR]: 'أمس',
      [ELanguage.DE]: 'gestern',
      [ELanguage.FR]: 'hier',
      [ELanguage.IT]: 'ieri',
    };
  } else {
    return null;
  }
};

export const getFormattedDate = (date: Date, format: string): string =>
  DateTime.fromJSDate(date).toFormat(format);
