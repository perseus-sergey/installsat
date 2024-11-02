import SeoSVG from '@/components/ui/icons-svg/SeoSVG';
import { ELanguage } from '../language.model';
import React from 'react';

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
  icon: React.ReactNode;
};

export const LANGUAGE_SELECT: Record<ELanguage, LanguageData> = {
  [EN]: {
    title: 'EN',
    alt: 'English',
    ariaLabel: 'Switch to English',
    imgSrc: '/Images/english_flag_24.png',
    icon: (
      <SeoSVG strokeWidth={0.2} viewBox="0 0 36 36">
        <path
          fill="#00247D"
          d="M0 9.059V13h5.628zM4.664 31H13v-5.837zM23 25.164V31h8.335zM0 23v3.941L5.63 23zM31.337 5H23v5.837zM36 26.942V23h-5.631zM36 13V9.059L30.371 13zM13 5H4.664L13 10.837z"
        />
        <path
          fill="#CF1B2B"
          d="m25.14 23l9.712 6.801a4 4 0 0 0 .99-1.749L28.627 23zM13 23h-2.141l-9.711 6.8c.521.53 1.189.909 1.938 1.085L13 23.943zm10-10h2.141l9.711-6.8a4 4 0 0 0-1.937-1.085L23 12.057zm-12.141 0L1.148 6.2a4 4 0 0 0-.991 1.749L7.372 13z"
        />
        <path
          fill="#EEE"
          d="M36 21H21v10h2v-5.836L31.335 31H32a4 4 0 0 0 2.852-1.199L25.14 23h3.487l7.215 5.052c.093-.337.158-.686.158-1.052v-.058L30.369 23H36zM0 21v2h5.63L0 26.941V27c0 1.091.439 2.078 1.148 2.8l9.711-6.8H13v.943l-9.914 6.941c.294.07.598.116.914.116h.664L13 25.163V31h2V21zM36 9a3.98 3.98 0 0 0-1.148-2.8L25.141 13H23v-.943l9.915-6.942A4 4 0 0 0 32 5h-.663L23 10.837V5h-2v10h15v-2h-5.629L36 9.059zM13 5v5.837L4.664 5H4a4 4 0 0 0-2.852 1.2l9.711 6.8H7.372L.157 7.949A4 4 0 0 0 0 9v.059L5.628 13H0v2h15V5z"
        />
        <path fill="#CF1B2B" d="M21 15V5h-6v10H0v6h15v10h6V21h15v-6z" />
      </SeoSVG>
    ),
  },
  [UA]: {
    title: 'UA',
    alt: 'Українська',
    ariaLabel: 'Перемкнути на Українську',
    imgSrc: '/Images/ukraine_flag_24.png',
    icon: (
      <SeoSVG strokeWidth={0.2} viewBox="0 0 64 64">
        <path
          fill="#1b75bb"
          d="M54 10H10C3.373 10 0 14.925 0 21v11h64V21c0-6.075-3.373-11-10-11"
        />
        <path
          fill="#f9cb38"
          d="M0 43c0 6.075 3.373 11 10 11h44c6.627 0 10-4.925 10-11V32H0z"
        />
      </SeoSVG>
    ),
  },
  [RU]: {
    title: 'RU',
    alt: 'Русский',
    ariaLabel: 'Переключиться на Русский',
    imgSrc: '/Images/russian_flag_24.png',
    icon: (
      <SeoSVG strokeWidth={0.2} viewBox="0 0 36 36">
        <path fill="#CE2028" d="M36 27a4 4 0 0 1-4 4H4a4 4 0 0 1-4-4v-4h36z" />
        <path fill="#22408C" d="M0 13h36v10H0z" />
        <path fill="#EEE" d="M32 5H4a4 4 0 0 0-4 4v4h36V9a4 4 0 0 0-4-4" />
      </SeoSVG>
    ),
  },
  [ES]: {
    title: 'ES',
    alt: 'Español',
    ariaLabel: 'Cambiar a Español',
    imgSrc: '/Images/spanish_flag_24.png',
    icon: (
      <SeoSVG strokeWidth={0.2} viewBox="0 0 36 36">
        <path
          fill="#C60A1D"
          d="M36 27a4 4 0 0 1-4 4H4a4 4 0 0 1-4-4V9a4 4 0 0 1 4-4h28a4 4 0 0 1 4 4z"
        />
        <path fill="#FFC400" d="M0 12h36v12H0z" />
        <path fill="#EA596E" d="M9 17v3a3 3 0 1 0 6 0v-3z" />
        <path fill="#F4A2B2" d="M12 16h3v3h-3z" />
        <path fill="#DD2E44" d="M9 16h3v3H9z" />
        <ellipse cx="12" cy="14.5" fill="#EA596E" rx="3" ry="1.5" />
        <ellipse cx="12" cy="13.75" fill="#FFAC33" rx="3" ry=".75" />
        <path fill="#99AAB5" d="M7 16h1v7H7zm9 0h1v7h-1z" />
        <path
          fill="#66757F"
          d="M6 22h3v1H6zm9 0h3v1h-3zm-8-7h1v1H7zm9 0h1v1h-1z"
        />
      </SeoSVG>
    ),
  },
  [AR]: {
    title: 'AR',
    alt: 'عربي',
    ariaLabel: 'تبديل إلى العربية',
    imgSrc: '/Images/arabic_flag_24.png',
    icon: (
      <SeoSVG strokeWidth={0.2} viewBox="0 0 64 64">
        <path fill="#e6e7e8" d="M14 26h50v13H14z" />
        <path fill="#25333a" d="M14 54h40c6.627 0 10-4.925 10-11v-4H14z" />
        <path fill="#137a08" d="M54 10H14v16h50v-5c0-6.075-3.373-11-10-11" />
        <path
          fill="#ec1c24"
          d="M14 39V10h-4C3.373 10 0 14.925 0 21v22c0 6.075 3.373 11 10 11h4z"
        />
      </SeoSVG>
    ),
  },
  [DE]: {
    title: 'DE',
    alt: 'Deutsch',
    ariaLabel: 'Wechseln zu Deutsch',
    imgSrc: '/Images/german_flag_24.png',
    icon: (
      <SeoSVG strokeWidth={0.2} viewBox="0 0 36 36">
        <path fill="#FFCD05" d="M0 27a4 4 0 0 0 4 4h28a4 4 0 0 0 4-4v-4H0z" />
        <path fill="#ED1F24" d="M0 14h36v9H0z" />
        <path fill="#141414" d="M32 5H4a4 4 0 0 0-4 4v5h36V9a4 4 0 0 0-4-4" />
      </SeoSVG>
    ),
  },
  [FR]: {
    title: 'FR',
    alt: 'Français',
    ariaLabel: 'Passer au Français',
    imgSrc: '/Images/french_flag_24.png',
    icon: (
      <SeoSVG strokeWidth={0.2} viewBox="0 0 64 64">
        <path fill="#e6e7e8" d="M22 10h20v44H22z" />
        <path
          fill="#1b75bb"
          d="M10 10C3.373 10 0 14.925 0 21v22c0 6.075 3.373 11 10 11h12V10z"
        />
        <path
          fill="#ec1c24"
          d="M52 10H42v44h12c6.627 0 10-4.925 10-11V21c0-6.076-.042-11-12-11"
        />
      </SeoSVG>
    ),
  },
  [IT]: {
    title: 'IT',
    alt: 'Italiano',
    ariaLabel: 'Passa a Italiano',
    imgSrc: '/Images/italian_flag_24.png',
    icon: (
      <SeoSVG strokeWidth={0.2} viewBox="0 0 64 64">
        <path fill="#e6e7e8" d="M22 10h20v44H22z" />
        <path
          fill="#29b473"
          d="M10 10C3.373 10 0 14.925 0 21v22c0 6.075 3.373 11 10 11h12V10z"
        />
        <path
          fill="#ec1c24"
          d="M54 10H42v44h12c6.627 0 10-4.925 10-11V21c0-6.075-3.373-11-10-11"
        />
      </SeoSVG>
    ),
  },
};
