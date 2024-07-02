import { getFormattedDateStrYearFirst } from '@/libs/utils/dates';
import { ELanguage } from './ui.model';

export const LAST_NEWS_INTERVAL = 30;

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
        [ELanguage.UA]: `з ${getFormattedDateStrYearFirst(startDate)} по ${getFormattedDateStrYearFirst()}`,
        [ELanguage.EN]: `from ${getFormattedDateStrYearFirst(startDate)} to ${getFormattedDateStrYearFirst()}`,
      };
      // addStr = {
      //   [ELanguage.UA]: `останні ${interval} днів`,
      //   [ELanguage.EN]: `last ${interval} days`,
      // };
    }

    return {
      [ELanguage.UA]: `Транспондерні новини популярних супутників ${addStr[ELanguage.UA]}`,
      [ELanguage.EN]: `Transponder news of popular satellites ${addStr[ELanguage.EN]}`,
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
  resetButton: {
    title: {
      [ELanguage.EN]: 'Reset filters',
      [ELanguage.UA]: 'Скинути фільтри',
    },
    ariaLabel: {
      [ELanguage.EN]: 'Reset all filters',
      [ELanguage.UA]: 'Скинути всі фільтри',
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

export interface TSatDigest {
  id: number;
  date: Date | string;
  update: number;
  text: string;
  sat: number;
  sat_name: string;
  country: string;
  satParent: string;
  satTitle: string;
  satLogo: string;
  satGrade: string;
  satPosition: string;
  sat_position: string;
}

export interface IStateOption {
  readonly value: number;
  readonly label: string;
}

export const digestIntervalOptions: readonly IStateOption[] = [
  { value: 7, label: 'Останні 7 днів' },
  { value: 30, label: 'Останні 30 днів' },
  { value: 90, label: 'Останні 90 днів' },
  { value: 180, label: 'Останні півроку' },
  { value: 2023, label: '2023 рік' },
  { value: 2022, label: '2022 рік' },
  { value: 2021, label: '2021 рік' },
  { value: 2020, label: '2020 рік' },
];
