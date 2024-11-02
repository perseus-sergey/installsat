import { ELanguage } from '../language.model';

const { UA, EN, RU, ES, AR, DE, FR, IT } = ELanguage;

export const LINKS = {
  homeLink: {
    title: {
      [UA]: 'Перейти до початкової сторінки',
      [EN]: 'Go to the home page',
      [RU]: 'Перейти на главную страницу',
      [ES]: 'Ir a la página de inicio',
      [AR]: 'الذهاب إلى الصفحة الرئيسية',
      [DE]: 'Zur Startseite gehen',
      [FR]: "Aller à la page d'accueil",
      [IT]: 'Vai alla pagina iniziale',
    },
    text: {
      [UA]: 'На головну',
      [EN]: 'Home',
      [RU]: 'Главная',
      [ES]: 'Inicio',
      [AR]: 'الصفحة الرئيسية',
      [DE]: 'Startseite',
      [FR]: 'Accueil',
      [IT]: 'Home',
    },
  },

  linkStartTitle: {
    [UA]: 'Перейти до сторінки',
    [EN]: 'Go to page',
    [RU]: 'Перейти на страницу',
    [ES]: 'Ir a la página',
    [AR]: 'انتقل إلى الصفحة',
    [DE]: 'Zur Seite gehen',
    [FR]: 'Aller à la page',
    [IT]: 'Vai alla pagina',
  },
};
