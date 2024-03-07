import { ILang } from './ui.model';

interface IFooterMenu {
  title: ILang;
  href: string;
}

export const footerMenuList: IFooterMenu[] = [
  {
    title: {
      ua: 'Як встановити супутникову антену',
      en: 'How to install satellite antenna',
    },
    href: '/statja/samostoyatelnaya-ustanovka-sputnikovoi-antenni',
  },
  {
    title: {
      ua: 'Як визначити напрямок антени',
      en: 'How to determine the direction of the antenna',
    },
    href: '/statja/napravlenie-antenny-po-karte',
  },
  {
    title: {
      ua: 'Як налаштувати супутниковий приймач',
      en: 'How to set up satellite receiver',
    },
    href: '/statja/kak-sviazati-tuner-s-antennoi',
  },
  {
    title: { ua: 'Супутникове обладнання', en: 'Satellite equipment' },
    href: '/novosti-i-statji/satellite_equipments',
  },
  {
    title: {
      ua: 'Теле-канали без щомісячної плати',
      en: 'TV channels without a monthly fee',
    },
    href: '/spisok-kanalov-paketa/bez-abonplati',
  },
  {
    title: { ua: 'ТБ Онлайн', en: 'Online TV' },
    href: '/spisok-online-kanalov/vse-tv',
  },
  {
    title: { ua: 'Biss Ключі', en: 'Biss Keys' },
    href: '/statja/key-biss',
  },
];
