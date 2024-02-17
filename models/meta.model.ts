import { getDate } from '@/libs/utils';

export const META_TRANS_NEWS_LIST = {
  getH1(interval: number) {
    let addStr = '';
    if (interval > 180) addStr = `${interval} рік`;
    else {
      const currDate = new Date();
      let startDate = new Date();
      startDate.setDate(currDate.getDate() - interval);
      addStr = `останні ${interval} днів`;
      // addStr = `останні ${interval} днів (з ${getFormattedDateStr(startDate)} по ${getFormattedDateStr(currDate)})`;
    }

    return `Транспондерні новини популярних супутників за ${addStr}`;
  },
  getTitle() {
    return 'Транспондері новини. Супутникові новини.';
  },
  getKeywords() {
    return `новини супутникового телебачення станом на ${new Date().toLocaleDateString('en-GB')}, супутникові транспондери частоти канали пакета без абонплати ефірні`;
  },
  getDescription() {
    return 'Транспондерні новини популярних супутників за обраний період часу';
  },
};

export const META_TRANS_NEWS_SINGLE = {
  getH1(date: string, lang?: string) {
    return `Транспондерні новини за ${getDate(date, lang)}`;
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
