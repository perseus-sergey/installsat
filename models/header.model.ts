import { ELanguage } from './ui.model';

export const TOGGLE_SIDEBAR_BUTTON_TITLE = '☰';

export const LOGO = {
  link: {
    title: {
      [ELanguage.UA]:
        'Перейти до перегляду стартової сторінки сайту Installsat',
      [ELanguage.EN]: 'Go to view the start page of the Installsat website',
    },
    siteLogo: {
      src: '/Images/InstallsatOrigBlue_200.png',
      width: 200,
      height: 85,
      alt: {
        [ELanguage.EN]: 'Installsat TV Logo',
        [ELanguage.UA]: 'Installsat TV Логотип',
      },
    },
  },
};
