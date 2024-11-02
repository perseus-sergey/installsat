import { ELanguage } from '../language.model';

const { UA, EN, RU, ES, AR, DE, FR, IT } = ELanguage;

export const LOGO = {
  link: {
    title: {
      [UA]: 'Перейти до перегляду стартової сторінки сайту Installsat',
      [EN]: 'Go to view the start page of the Installsat website',
      [RU]: 'Перейти к просмотру стартовой страницы сайта Installsat',
      [ES]: 'Ir a ver la página de inicio del sitio web de Installsat',
      [AR]: 'الذهاب لعرض الصفحة الرئيسية لموقع Installsat',
      [DE]: 'Zur Startseite der Installsat-Website gehen',
      [FR]: 'Aller voir la page d’accueil du site Installsat',
      [IT]: 'Vai a vedere la pagina iniziale del sito Installsat',
    },
    siteLogo: {
      alt: {
        [UA]: 'Installsat TV Логотип',
        [EN]: 'Installsat TV Logo',
        [RU]: 'Логотип Installsat TV',
        [ES]: 'Logotipo de Installsat TV',
        [AR]: 'شعار Installsat TV',
        [DE]: 'Installsat TV Logo',
        [FR]: 'Logo Installsat TV',
        [IT]: 'Logo Installsat TV',
      },
    },
  },
};

export const OPEN_SIDE_BAR_BTN = {
  sideBarIcon: {
    alt: {
      [UA]: 'Іконка кнопки відкриття прихованого меню',
      [EN]: 'Open hidden menu button icon',
      [RU]: 'Иконка кнопки открытия скрытого меню',
      [ES]: 'Icono del botón para abrir el menú oculto',
      [AR]: 'رمز زر فتح القائمة المخفية',
      [DE]: 'Symbol der Schaltfläche zum Öffnen des versteckten Menüs',
      [FR]: 'Icône du bouton pour ouvrir le menu caché',
      [IT]: 'Icona del pulsante per aprire il menu nascosto',
    },
    ariaLabel: {
      [UA]: 'Відкрити бокове меню',
      [EN]: 'Open side menu',
      [RU]: 'Открыть боковое меню',
      [ES]: 'Abrir el menú lateral',
      [AR]: 'فتح القائمة الجانبية',
      [DE]: 'Seitenmenü öffnen',
      [FR]: 'Ouvrir le menu latéral',
      [IT]: 'Apri il menu laterale',
    },
  },
  sideBarCloseIcon: {
    alt: {
      [UA]: 'Іконка закриття бокового меню',
      [EN]: 'Side menu close icon',
      [RU]: 'Иконка закрытия бокового меню',
      [ES]: 'Icono de cierre del menú lateral',
      [AR]: 'رمز إغلاق القائمة الجانبية',
      [DE]: 'Symbol zum Schließen des Seitenmenüs',
      [FR]: 'Icône de fermeture du menu latéral',
      [IT]: 'Icona di chiusura del menu laterale',
    },
    ariaLabel: {
      [UA]: 'Закрити бокове меню',
      [EN]: 'Close the side menu',
      [RU]: 'Закрыть боковое меню',
      [ES]: 'Cerrar el menú lateral',
      [AR]: 'إغلاق القائمة الجانبية',
      [DE]: 'Seitenmenü schließen',
      [FR]: 'Fermer le menu latéral',
      [IT]: 'Chiudi il menu laterale',
    },
  },
};

type LanguageData = {
  title: string;
  alt: string;
  ariaLabel: string;
  imgSrc: string;
};

export const LANGUAGE_SELECT: Record<ELanguage, LanguageData> = {
  [EN]: {
    title: 'EN',
    alt: 'English',
    ariaLabel: 'Switch to English',
    imgSrc: '/Images/english_flag_24.png',
  },
  [UA]: {
    title: 'UA',
    alt: 'Українська',
    ariaLabel: 'Перемкнути на Українську',
    imgSrc: '/Images/ukraine_flag_24.png',
  },
  [RU]: {
    title: 'RU',
    alt: 'Русский',
    ariaLabel: 'Переключиться на Русский',
    imgSrc: '/Images/russian_flag_24.png',
  },
  [ES]: {
    title: 'ES',
    alt: 'Español',
    ariaLabel: 'Cambiar a Español',
    imgSrc: '/Images/spanish_flag_24.png',
  },
  [AR]: {
    title: 'AR',
    alt: 'عربي',
    ariaLabel: 'تبديل إلى العربية',
    imgSrc: '/Images/arabic_flag_24.png',
  },
  [DE]: {
    title: 'DE',
    alt: 'Deutsch',
    ariaLabel: 'Wechseln zu Deutsch',
    imgSrc: '/Images/german_flag_24.png',
  },
  [FR]: {
    title: 'FR',
    alt: 'Français',
    ariaLabel: 'Passer au Français',
    imgSrc: '/Images/french_flag_24.png',
  },
  [IT]: {
    title: 'IT',
    alt: 'Italiano',
    ariaLabel: 'Passa a Italiano',
    imgSrc: '/Images/italian_flag_24.png',
  },
};
