import { StaticImageData } from 'next/image';
import { ELanguage, ILang } from './ui.model';
import { EUrlAdminParam } from './url.model';

import parseIcon from 'public/Images/accordion/html.png';
import satelliteIcon from 'public/Images/accordion/satellite32.png';
import usefulArticlesIcon from 'public/Images/accordion/icon_info_key.png';

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
      },
    },
    title: {
      [ELanguage.EN]: 'Articles',
      [ELanguage.UA]: 'Статті',
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
      },
    },
    title: {
      [ELanguage.UA]: 'Канали',
      [ELanguage.EN]: 'Channels',
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
      },
    },
    title: {
      [ELanguage.UA]: 'Парсинг',
      [ELanguage.EN]: 'Parsing',
    },
    titleHref: `/${EUrlAdminParam.BASE_PATH}/${EUrlAdminParam.PARSE}`,
  },
};
