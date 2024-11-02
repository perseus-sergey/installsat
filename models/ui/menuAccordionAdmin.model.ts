import { StaticImageData } from 'next/image';

import parseIcon from 'public/Images/accordion/html.png';
import satelliteIcon from 'public/Images/accordion/satellite32.png';
import usefulArticlesIcon from 'public/Images/accordion/icon_info_key.png';
import { ELanguage, ILang } from '../language.model';
import { EUrlAdminParam } from '../url/urlAdmin.model';

interface ILink {
  title: string;
  href: string;
}

interface IImage {
  src: StaticImageData;
  alt: ILang;
}

interface IMenuType {
  name: string;
  titleHref?: string;
  img: IImage;
  title: ILang;
  links?: ILink[];
}

interface IMenuAccordionAdmin {
  [key: string]: IMenuType;
}

export const MENU_ACCORDION_ADMIN: IMenuAccordionAdmin = {
  ARTICLES: {
    name: 'ARTICLES',
    img: {
      src: usefulArticlesIcon,
      alt: {
        [ELanguage.EN]: 'Articles',
        [ELanguage.UA]: 'Статті',
        [ELanguage.RU]: 'Статьи',
        [ELanguage.ES]: 'Artículos',
        [ELanguage.AR]: 'مقالات',
        [ELanguage.DE]: 'Artikel',
        [ELanguage.FR]: 'Articles',
        [ELanguage.IT]: 'Articles',
      },
    },
    title: {
      [ELanguage.EN]: 'Articles',
      [ELanguage.UA]: 'Статті',
      [ELanguage.RU]: 'Статьи',
      [ELanguage.ES]: 'Artículos',
      [ELanguage.AR]: 'مقالات',
      [ELanguage.DE]: 'Artikel',
      [ELanguage.FR]: 'Articles',
      [ELanguage.IT]: 'Articles',
    },
    links: [
      {
        title: 'Add new',
        href: `/${EUrlAdminParam.BASE_PATH}/${EUrlAdminParam.ARTICLES_EDIT}/add`,
      },
      {
        title: 'Edit',
        href: `/${EUrlAdminParam.BASE_PATH}/${EUrlAdminParam.ARTICLES_EDIT}/edit`,
      },
    ],
  },

  CHANNELS: {
    name: 'CHANNELS',
    img: {
      src: satelliteIcon,
      alt: {
        [ELanguage.UA]: 'Канали на супутниках',
        [ELanguage.EN]: 'Channels on satellites',
        [ELanguage.RU]: 'Каналы на спутниках',
        [ELanguage.ES]: 'Canales en satélites',
        [ELanguage.AR]: 'قنوات على القمر ',
        [ELanguage.DE]: 'Satellitenkanäle',
        [ELanguage.FR]: 'Canaux sur les satellites',
        [ELanguage.IT]: 'Canaux sur les satellites',
      },
    },
    title: {
      [ELanguage.UA]: 'Канали',
      [ELanguage.EN]: 'Channels',
      [ELanguage.RU]: 'Каналы',
      [ELanguage.ES]: 'Canales',
      [ELanguage.AR]: 'قنوات',
      [ELanguage.DE]: 'Kanäle',
      [ELanguage.FR]: 'Canaux',
      [ELanguage.IT]: 'Canaux',
    },
    links: [
      {
        title: 'Add new',
        href: `/${EUrlAdminParam.BASE_PATH}/${EUrlAdminParam.CHANNELS_EDIT}/add`,
      },
      {
        title: 'Edit',
        href: `/${EUrlAdminParam.BASE_PATH}/${EUrlAdminParam.CHANNELS_EDIT}/edit`,
      },
    ],
  },

  PARSING: {
    name: 'PARSING',
    img: {
      src: parseIcon,
      alt: {
        [ELanguage.UA]: 'Парсинг',
        [ELanguage.EN]: 'Parsing',
        [ELanguage.RU]: 'Парсинг',
        [ELanguage.ES]: 'Parsado',
        [ELanguage.AR]: 'تحليل',
        [ELanguage.DE]: 'Parsen',
        [ELanguage.FR]: 'Parsing',
        [ELanguage.IT]: 'Parsing',
      },
    },
    title: {
      [ELanguage.UA]: 'Парсинг',
      [ELanguage.EN]: 'Parsing',
      [ELanguage.RU]: 'Парсинг',
      [ELanguage.ES]: 'Parsado',
      [ELanguage.AR]: 'تحليل',
      [ELanguage.DE]: 'Parsen',
      [ELanguage.FR]: 'Parsing',
      [ELanguage.IT]: 'Parsing',
    },
    titleHref: `/${EUrlAdminParam.BASE_PATH}/${EUrlAdminParam.PARSE}`,
  },
};
