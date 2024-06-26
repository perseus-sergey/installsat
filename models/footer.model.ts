import { ELanguage, ILang } from './ui.model';
import { EUrlBaseParam } from './url.model';

interface IFooterMenu {
  title: ILang;
  href: string;
}

export const COPYRIGHT_SECTION = {
  title: {
    [ELanguage.UA]: `Copyright © 2009 - ${new Date().getFullYear()} Copyright in
    Installsat. В разі копіюванні контенту, посилання на сайт є обов'язковим.`,
    [ELanguage.EN]: `Copyright © 2009 - ${new Date().getFullYear()} Copyright in
    Installsat. The link to the site is required when copying content.`,
  },
};

export const MENU_SEPARATOR = '▪';

export const footerMenuList: IFooterMenu[] = [
  {
    title: {
      [ELanguage.UA]: 'Як встановити супутникову антену',
      [ELanguage.EN]: 'How to install satellite antenna',
    },
    href: `/${EUrlBaseParam.ARTICLE}/samostoyatelnaya-ustanovka-sputnikovoi-antenni`,
  },
  {
    title: {
      [ELanguage.UA]: 'Як визначити напрямок антени',
      [ELanguage.EN]: 'How to determine the direction of the antenna',
    },
    href: `/${EUrlBaseParam.SAT_FINDER}`,
  },
  {
    title: {
      [ELanguage.UA]: 'Як налаштувати супутниковий приймач',
      [ELanguage.EN]: 'How to set up satellite receiver',
    },
    href: `/${EUrlBaseParam.ARTICLE}/kak-sviazati-tuner-s-antennoi`,
  },
  // {
  //   title: {
  //     [ELanguage.UA]: 'Супутникове обладнання',
  //     [ELanguage.EN]: 'Satellite equipment',
  //   },
  //   href: `/${EUrlBaseParam.PRODUCT_CATEGORIES}`,
  //   // href: '/novosti-i-statji/satellite_equipments',
  // },
  {
    title: {
      [ELanguage.UA]: 'Теле-канали без щомісячної плати',
      [ELanguage.EN]: 'TV channels without a monthly fee',
    },
    href: `/${EUrlBaseParam.SAT_CHANNEL_LIST}`,
  },
  {
    title: { [ELanguage.UA]: 'ТБ Онлайн', [ELanguage.EN]: 'Online TV' },
    href: `/${EUrlBaseParam.ONLINE_CHANNEL_LIST}`,
  },
  {
    title: { [ELanguage.UA]: 'Biss Ключі', [ELanguage.EN]: 'Biss Keys' },
    href: `/${EUrlBaseParam.ARTICLE}/key-biss`,
  },
];
