import { ELanguage } from './ui.model';
import { EUrlBaseParam } from './url.model';

export const TOGGLE_SIDEBAR_BUTTON_TITLE = '☰';

export const LOGO = {
  link: {
    href: EUrlBaseParam.BASE_PATH,
    title: {
      [ELanguage.EN]: 'To Home Page',
      [ELanguage.UA]: 'На головну сторінку',
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
