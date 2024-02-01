import { getFormattedDateStr } from '@/libs/utils';
import { LAST_NEWS_INTERVAL } from './satDigest.model';

export const getDate = (date: string, lang?: string) => {
  return new Date(date).toLocaleDateString(lang, {
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

    return `Транспондерные новости популярных спутников с ${getFormattedDateStr(currDate)} по ${getFormattedDateStr(startDate)}`;
  },
  getTitle() {
    return 'Транспондерные новости. Спутниковые новости.';
  },
  getKeywords() {
    return `новости спутникового телевидения на ${new Date().toLocaleDateString('en-GB')}, спутниковые транспондеры частоты каналы пакета без абонплаты эфирные`;
  },
  getDescription() {
    return `${this.getH1().slice(0, 190)} ${new Date().getFullYear()}`;
  },
};

export const META_TRANS_NEWS_SINGLE = {
  getH1() {
    return 'Транспондерные новости популярных спутников';
  },
  getTitle(date: string, lang?: string) {
    return `Installsat - транспондерные новости за ${getDate(date, lang)}`;
  },
  getKeywords(date: string, lang?: string) {
    return `транспондерные спутниковые новости ${getDate(date, lang)}`;
  },
  getDescription(date: string, lang?: string) {
    return `Спутниковые новости за ${getDate(date, lang)}`;
  },
};
