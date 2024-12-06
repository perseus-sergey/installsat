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

const { UA, EN, RU, ES, AR, DE, FR, IT } = ELanguage;

export const langSuffixUaEmpty = {
  [UA]: '',
  [EN]: '_en',
  [RU]: '_ru',
  [ES]: '_es',
  [AR]: '_ar',
  [DE]: '_de',
  [FR]: '_fr',
  [IT]: '_it',
};

export const langSuffix = { ...langSuffixUaEmpty, [UA]: '_ua' };

export const DEFAULT_LANG = EN;

export interface ILang {
  [UA]: string;
  [EN]: string;
  [RU]: string;
  [ES]: string;
  [AR]: string;
  [DE]: string;
  [FR]: string;
  [IT]: string;
}

export const languageMap: { [key in ELanguage]: string } = {
  [ELanguage.UA]: 'uk',
  [ELanguage.EN]: 'en',
  [ELanguage.RU]: 'ru',
  [ELanguage.ES]: 'es',
  [ELanguage.AR]: 'ar',
  [ELanguage.DE]: 'de',
  [ELanguage.FR]: 'fr',
  [ELanguage.IT]: 'it',
};
