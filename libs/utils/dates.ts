import { ELanguage } from '@/models/ui.model';
import { DateTime } from 'luxon';

export const getDate = (date: string | Date = new Date(), lang?: string) => {
  const currDate = date instanceof Date ? date : new Date(date);
  if (currDate.toString() === 'Invalid Date') return '';

  return currDate.toLocaleDateString(lang, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const getFormattedDateStr = (
  date: string | Date = new Date(),
  isYearFirst = true
) => {
  const currDate = date instanceof Date ? date : new Date(date);
  if (currDate.toString() === 'Invalid Date') return '';

  const year = currDate.getFullYear();
  const month = String(currDate.getMonth() + 1).padStart(2, '0');
  const day = String(currDate.getDate()).padStart(2, '0');

  return isYearFirst ? `${year}-${month}-${day}` : `${day}-${month}-${year}`;
};

export const getFormattedDateStrYearFirst = (
  date: string | Date = new Date()
) => {
  const currDate = date instanceof Date ? date : new Date(date);

  return currDate.toString() === 'Invalid Date'
    ? ''
    : currDate.toISOString().slice(0, 10);
};

export const getStartOfWeekDate = (date: Date) => {
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1);

  return new Date(date.setDate(diff));
};

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

export const getDayOfMonthStr = (dateStr: string, lang: ELanguage) => {
  const dateObj = new Date(dateStr);

  const months =
    lang === ELanguage.UA
      ? [
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
        ]
      : [
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
        ];

  const day = dateObj.getDate();
  const monthIndex = dateObj.getMonth();

  const result = ELanguage.UA
    ? `${day} ${months[monthIndex]}`
    : `${months[monthIndex]} ${day}`;

  return result;
};
