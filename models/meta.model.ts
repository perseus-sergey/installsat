import { getFormattedDateStr } from '@/libs/utils';
import { LAST_NEWS_INTERVAL } from './satDigest.model';

export const getDate = (date: string | Date, lang?: string) => {
  const currDate = date instanceof Date ? date : new Date(date);

  return currDate.toLocaleDateString(lang, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const META_TRANS_NEWS_LIST = {
  getH1() {
    const currDate = new Date();
    let startDate = new Date();
    startDate.setDate(currDate.getDate() - LAST_NEWS_INTERVAL);

    return `Транспондерні новини популярних супутників з ${getFormattedDateStr(currDate)} по ${getFormattedDateStr(startDate)}`;
  },
  getTitle() {
    return 'Транспондері новини. Супутникові новини.';
  },
  getKeywords() {
    return `новини супутникового телебачення станом на ${new Date().toLocaleDateString('en-GB')}, супутникові транспондери частоти канали пакета без абонплати ефірні`;
  },
  getDescription() {
    return `${this.getH1().slice(0, 190)} ${new Date().getFullYear()}`;
  },
};

export const META_TRANS_NEWS_SINGLE = {
  getH1() {
    return 'Транспондерні новини популярних супутників';
  },
  getTitle(date: string, lang?: string) {
    return `Installsat - транспондерні новини за ${getDate(date, lang)}`;
  },
  getKeywords(date: string, lang?: string) {
    return `транспондерні супутникові новини ${getDate(date, lang)}`;
  },
  getDescription(date: string, lang?: string) {
    return `Супутникові новини за ${getDate(date, lang)}`;
  },
};
