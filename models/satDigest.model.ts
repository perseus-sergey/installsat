export const LAST_NEWS_INTERVAL = 30;

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
  fieldsetTitle: {
    ua: 'Виберіть супутники та проміжок часу',
    en: 'Select satellites and time slot',
  },
};

export const META_TRANS_NEWS_SINGLE = {
  getH1() {
    // return `Транспондерні новини за ${dateStr}`;
    return {
      ua: 'Транспондерні новини за ',
      en: 'Transponder news for ',
    };
  },
  getTitle(dateStr: string) {
    return `Installsat - транспондерні новини за ${dateStr}`;
  },
  getKeywords(dateStr: string) {
    return `транспондерні супутникові новини ${dateStr}`;
  },
  getDescription(dateStr: string) {
    return `Супутникові новини за ${dateStr}`;
  },
};

export const rawSatDigest = {
  id: -1,
  date: new Date('1970-01-01'),
  update: -1,
  text: '',
  sat: -1,
  sat_name: '',
  country: '',
  satParent: '',
  satTitle: '',
  satLogo: '',
  satGrade: '',
  satPosition: '',
};

export type TSatDigest = typeof rawSatDigest;

export interface StateOption {
  readonly value: number;
  readonly label: string;
}

export const digestIntervals: readonly StateOption[] = [
  { value: 7, label: 'Останні 7 днів' },
  { value: 30, label: 'Останні 30 днів' },
  { value: 90, label: 'Останні 90 днів' },
  { value: 180, label: 'Останні півроку' },
  { value: 2023, label: '2023 рік' },
  { value: 2022, label: '2022 рік' },
  { value: 2021, label: '2021 рік' },
  { value: 2020, label: '2020 рік' },
];
