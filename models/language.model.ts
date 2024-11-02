export enum ELanguage {
  UA = 'ua',
  EN = 'en',
  RU = 'ru',
  ES = 'es',
  AR = 'ar',
  DE = 'de',
  FR = 'fr',
  IT = 'it',
}

export const DEFAULT_LANG = ELanguage.EN;

export interface ILang {
  [ELanguage.UA]: string;
  [ELanguage.EN]: string;
  [ELanguage.RU]: string;
  [ELanguage.ES]: string;
  [ELanguage.AR]: string;
  [ELanguage.DE]: string;
  [ELanguage.FR]: string;
  [ELanguage.IT]: string;
}
