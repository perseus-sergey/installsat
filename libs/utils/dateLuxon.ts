import { ELanguage } from '@/models/language.model';
import { DateTime } from 'luxon';

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
    };
  } else if (diffDays === 1) {
    return {
      [ELanguage.UA]: 'завтра',
      [ELanguage.EN]: 'tomorrow',
    };
  } else if (diffDays === -1) {
    return {
      [ELanguage.UA]: 'вчора',
      [ELanguage.EN]: 'yesterday',
    };
  } else {
    return null;
  }
};

export const getFormattedDate = (date: Date, format: string): string =>
  DateTime.fromJSDate(date).toFormat(format);
