import { ILang } from './ui.model';
import { EUrlBaseParam } from './url.model';

interface IFooterMenu {
  title: ILang;
  href: string;
}

export const COPYRIGHT_SECTION = {
  title: {
    ua: `Copyright © 2009 - ${new Date().getFullYear()} Copyright in
    Installsat. В разі копіюванні контенту, посилання на сайт є обов'язковим.`,
    en: `Copyright © 2009 - ${new Date().getFullYear()} Copyright in
    Installsat. The link to the site is required when copying content.`,
  },
};

export const MENU_SEPARATOR = '▪';

export const footerMenuList: IFooterMenu[] = [
  {
    title: {
      ua: 'Як встановити супутникову антену',
      en: 'How to install satellite antenna',
    },
    href: `/${EUrlBaseParam.ARTICLE}/samostoyatelnaya-ustanovka-sputnikovoi-antenni`,
  },
  {
    title: {
      ua: 'Як визначити напрямок антени',
      en: 'How to determine the direction of the antenna',
    },
    href: `/${EUrlBaseParam.ARTICLE}/napravlenie-antenny-po-karte`,
  },
  {
    title: {
      ua: 'Як налаштувати супутниковий приймач',
      en: 'How to set up satellite receiver',
    },
    href: `/${EUrlBaseParam.ARTICLE}/kak-sviazati-tuner-s-antennoi`,
  },
  {
    title: { ua: 'Супутникове обладнання', en: 'Satellite equipment' },
    href: `${EUrlBaseParam.PRODUCT_CATEGORIES}`,
    // href: '/novosti-i-statji/satellite_equipments',
  },
  {
    title: {
      ua: 'Теле-канали без щомісячної плати',
      en: 'TV channels without a monthly fee',
    },
    href: `${EUrlBaseParam.PACKAGE_CHANNEL_LIST}/bez-abonplati`,
  },
  {
    title: { ua: 'ТБ Онлайн', en: 'Online TV' },
    href: `${EUrlBaseParam.ONLINE_CHANNEL_LIST}`,
    // href: `/spisok-online-kanalov/vse-tv`,
  },
  {
    title: { ua: 'Biss Ключі', en: 'Biss Keys' },
    href: `/${EUrlBaseParam.ARTICLE}/key-biss`,
  },
];
