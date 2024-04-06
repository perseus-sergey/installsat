import { ELanguage, LANGUAGE } from './ui.model';

export const LAST_NEWS_INTERVAL = 30;

export const META_TRANS_NEWS_LIST = {
  getH1(interval: number) {
    let addStr;
    if (interval > 180)
      addStr = {
        [ELanguage.UA]: `${interval} рік`,
        [ELanguage.EN]: `${interval} year`,
      };
    else {
      const currDate = new Date();
      let startDate = new Date();
      startDate.setDate(currDate.getDate() - interval);
      addStr = {
        [ELanguage.UA]: `останні ${interval} днів`,
        [ELanguage.EN]: `last ${interval} days`,
      };
    }

    return {
      [ELanguage.UA]: `Транспондерні новини популярних супутників за ${addStr[LANGUAGE]}`,
      [ELanguage.EN]: `Transponder news of popular satellites for ${addStr[LANGUAGE]}`,
    };
  },
  getTitle() {
    return {
      [ELanguage.UA]: 'Транспондері новини. Супутникові новини.',
      [ELanguage.EN]: 'Transponder news. Satellite news.',
    };
  },
  getKeywords() {
    return {
      [ELanguage.EN]: `satellite television news as of ${new Date().toLocaleDateString('en-GB')}, satellite frequency transponders, channels of the package without a subscription fee, broadcast'`,
      [ELanguage.UA]: `новини супутникового телебачення станом на ${new Date().toLocaleDateString('en-GB')}, супутникові транспондери частоти канали пакета без абонплати ефірні`,
    };
  },
  getDescription() {
    return {
      [ELanguage.EN]:
        'Transponder news of popular satellites for the selected time period',
      [ELanguage.UA]:
        'Транспондерні новини популярних супутників за обраний період часу',
    };
  },
  h2start: {
    [ELanguage.EN]: 'News of the satellite ',
    [ELanguage.UA]: 'Новини супутника ',
  },
  fieldsetTitle: {
    [ELanguage.UA]: 'Виберіть супутники та проміжок часу',
    [ELanguage.EN]: 'Select satellites and time slot',
  },
  satSelect: {
    defaultLabel: {
      [ELanguage.EN]: '--= All Satellites =--',
      [ELanguage.UA]: '--= Всі Супутники =--',
    },
    westDirectionLabel: {
      [ELanguage.EN]: 'West direction',
      [ELanguage.UA]: 'Західний напрямок',
    },
    eastDirectionLabel: {
      [ELanguage.EN]: 'East direction',
      [ELanguage.UA]: 'Східний напрямок',
    },
  },
  submitButton: {
    title: {
      [ELanguage.UA]: 'Підтвердити',
      [ELanguage.EN]: 'Confirm',
    },
    ariaLabel: {
      [ELanguage.UA]: 'Підтвердити зміни',
      [ELanguage.EN]: 'Confirm changes',
    },
  },
  images: {
    satLogo: {
      path: '/Images/satellites/',
      height: '50px',
      width: '67px',
      defaultImg: {
        src: '/Images/satellites/wrong_sat_64.png',
        height: '64px',
        width: '64px',
      },
      alternativeStr: { title: '🌏', fontSize: '4rem' },
      alt: {
        [ELanguage.UA]: `Логотип супутника `,
        [ELanguage.EN]: `Satellite logo `,
      },
    },
  },
};

export const META_TRANS_NEWS_SINGLE = {
  getH1() {
    return {
      [ELanguage.UA]: 'Транспондерні новини за ',
      [ELanguage.EN]: 'Transponder news for ',
    };
  },
  getTitle(dateStr: string) {
    return {
      [ELanguage.UA]: `Installsat - транспондерні новини за ${dateStr}`,
      [ELanguage.EN]: `Installsat - Transponder news for ${dateStr}`,
    };
  },
  getKeywords(dateStr: string) {
    return {
      [ELanguage.UA]: `транспондерні супутникові новини ${dateStr}`,
      [ELanguage.EN]: `transponder satellite news ${dateStr}`,
    };
  },
  getDescription(dateStr: string) {
    return {
      [ELanguage.UA]: `Супутникові новини за ${dateStr}`,
      [ELanguage.EN]: `Satellite news for ${dateStr}`,
    };
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

export interface IStateOption {
  readonly value: number;
  readonly label: string;
}

export const digestIntervals: readonly IStateOption[] = [
  { value: 7, label: 'Останні 7 днів' },
  { value: 30, label: 'Останні 30 днів' },
  { value: 90, label: 'Останні 90 днів' },
  { value: 180, label: 'Останні півроку' },
  { value: 2023, label: '2023 рік' },
  { value: 2022, label: '2022 рік' },
  { value: 2021, label: '2021 рік' },
  { value: 2020, label: '2020 рік' },
];
