import { getFormattedDateStr } from '@/libs/utils/utils';
import { ELanguage, LANGUAGE } from './ui.model';

// =================================================================
// Need to change to 30
// =================================================================
export const LAST_NEWS_INTERVAL = 90;

export const META_TRANS_NEWS_LIST = {
  getH1(interval: number) {
    let addStr;
    if (interval > 180)
      addStr = {
        [ELanguage.UA]: `за ${interval} рік`,
        [ELanguage.EN]: `for ${interval} year`,
      };
    else {
      const currDate = new Date();
      const startDate = new Date();
      startDate.setDate(currDate.getDate() - interval);
      addStr = {
        [ELanguage.UA]: `з ${getFormattedDateStr(startDate)} по ${getFormattedDateStr()}`,
        [ELanguage.EN]: `from ${getFormattedDateStr(startDate)} to ${getFormattedDateStr()}`,
      };
      // addStr = {
      //   [ELanguage.UA]: `останні ${interval} днів`,
      //   [ELanguage.EN]: `last ${interval} days`,
      // };
    }

    return {
      [ELanguage.UA]: `Транспондерні новини популярних супутників ${addStr[LANGUAGE]}`,
      [ELanguage.EN]: `Transponder news of popular satellites ${addStr[LANGUAGE]}`,
    };
  },
  metaTitle: {
    [ELanguage.UA]: 'Транспондері новини. Супутникові новини.',
    [ELanguage.EN]: 'Transponder news. Satellite news.',
  },
  metaKeywords: {
    [ELanguage.UA]: `новини супутникового телебачення станом супутникові транспондери частоти канали пакета без абонплати ефірні`,
    [ELanguage.EN]: `news of satellite television, satellite transponders, satellite channels, free TV`,
  },
  metaDescription: {
    [ELanguage.EN]:
      'Transponder news of popular satellites for the selected time period',
    [ELanguage.UA]:
      'Транспондерні новини популярних супутників за обраний період часу',
  },
  h2start: {
    [ELanguage.EN]: 'News of the satellite ',
    [ELanguage.UA]: 'Новини супутника ',
  },
  fieldsetTitle: {
    [ELanguage.UA]: 'Виберіть супутники та проміжок часу',
    [ELanguage.EN]: 'Select satellites and time slot',
  },
  select: {
    satSelect: {
      title: {
        [ELanguage.UA]: 'Виберіть супутники',
        [ELanguage.EN]: 'Select satellites',
      },
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
    timeIntervalSelect: {
      title: {
        [ELanguage.UA]: 'Виберіть проміжок часу',
        [ELanguage.EN]: 'Choose a time frame',
      },
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
      height: 50,
      width: 67,
      defaultImg: {
        src: '/Images/satellites/wrong_sat_64.png',
        height: 64,
        width: 64,
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
  metaH1start: {
    [ELanguage.UA]: 'Транспондерні новини за',
    [ELanguage.EN]: 'Transponder news for',
  },
  metaTitleStart: {
    [ELanguage.UA]: `Installsat - транспондерні новини за`,
    [ELanguage.EN]: `Installsat - Transponder news for`,
  },
  metaKeywordsStart: {
    [ELanguage.UA]: `транспондерні супутникові новини`,
    [ELanguage.EN]: `transponder satellite news`,
  },
  metaDescriptionStart: {
    [ELanguage.UA]: `Супутникові новини за`,
    [ELanguage.EN]: `Satellite news for`,
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
