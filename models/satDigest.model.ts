import { getFormattedDateStrYearFirst } from '@/libs/utils/dates';
import { ELanguage } from './language.model';

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
};

export const TRANS_NEWS_LIST_FILTERS = {
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
};

export const TRANS_NEWS_LIST_IMAGES = {
  satLogo: {
    path: '/Images/satellites/',
    height: 50,
    width: 67,
    defaultImg: {
      src: '/Images/satellites/wrong_sat_64.png',
      height: 64,
      width: 64,
    },
    alt: {
      [ELanguage.UA]: `Логотип компанії супутника: `,
      [ELanguage.EN]: `Company logo of satellite: `,
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
  sat_slug: string | null;
  sat: number;
  country: string;
  satTitle: string;
  satLogo: string;
  satGrade: string | null;
  satPosition: string;
}

export interface IStateOption {
  readonly value: string | number;
  readonly label: string;
}

export const getDigestIntervalOptions = (
  lang: ELanguage
): readonly IStateOption[] => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();

  const yearArray = [];
  for (let i = 0; i < 5; i++) {
    const year = currentYear - i;
    yearArray.push({
      value: year,
      label: `${year} ${lang === ELanguage.UA ? 'рік' : 'year'}`,
    });
  }

  return [
    {
      value: 7,
      label: lang === ELanguage.UA ? 'Останні 7 днів' : 'Last 7 days',
    },
    {
      value: 30,
      label: lang === ELanguage.UA ? 'Останні 30 днів' : 'Last 30 days',
    },
    {
      value: 90,
      label: lang === ELanguage.UA ? 'Останні 90 днів' : 'Last 90 days',
    },
    {
      value: 180,
      label: lang === ELanguage.UA ? 'Останні півроку' : 'Last six months',
    },
    ...yearArray,
  ];
};
