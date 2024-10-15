export enum ELanguage {
  UA = 'ua',
  EN = 'en',
}

export const DEFAULT_LANG = ELanguage.EN;

export interface ILang {
  [ELanguage.UA]: string;
  [ELanguage.EN]: string;
}
