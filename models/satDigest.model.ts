export const LAST_NEWS_INTERVAL = 30;

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

export const DATE_NEWS_LIST_TITLE = {
  ua: 'Транспондерні новини за ',
  en: 'Transponder news for ',
};

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
