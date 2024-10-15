import { ELanguage } from '@/models/language.model';
import { getValidDate } from './dates';

export const getDate = (date: string | Date = new Date(), lang?: string) => {
  const currDate = getValidDate(date);

  return !currDate
    ? ''
    : currDate.toLocaleDateString(lang, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
};

export const getStartOfWeekDate = (date: Date) => {
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1);

  return new Date(date.setDate(diff));
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
}; // 29 липня
