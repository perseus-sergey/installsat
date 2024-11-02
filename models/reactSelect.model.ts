import { ELanguage } from './language.model';

export interface ISatelliteOption {
  value: number | string;
  label: string;
  isFixed?: boolean;
  isDisabled?: boolean;
}

export interface IGroupedSatelliteOption {
  options: ISatelliteOption[];
  label?: string;
}

export enum ESelectType {
  SELECT_SATS = 'selectSats',
  SELECT_LANG = 'selectLang',
  SELECT_TIME_INTERVAL = 'timeInterval',
}

const { UA, EN, RU, ES, AR, DE, FR, IT } = ELanguage;

export const LANGUAGE_SELECTOR_CAPTION = {
  [UA]: 'Виберіть мову каналу',
  [EN]: 'Select channel language',
  [RU]: 'Выберите язык канала',
  [ES]: 'Seleccione el idioma del canal',
  [AR]: 'اختر لغة القناة',
  [DE]: 'Wählen Sie die Sprache des Kanals',
  [FR]: 'Sélectionnez la langue de la chaîne',
  [IT]: 'Seleziona la lingua del canale',
};

export const SAT_SELECTOR_CAPTION = {
  [UA]: 'Виберіть супутники',
  [EN]: 'Select satellites',
  [RU]: 'Выберите спутники',
  [ES]: 'Selecciona satélites',
  [AR]: 'اختر الأقمار الصناعية',
  [DE]: 'Wählen Sie Satelliten aus',
  [FR]: 'Sélectionnez des satellites',
  [IT]: 'Seleziona satelliti',
};

export const INTERVAL_SELECTOR_CAPTION = {
  [UA]: 'Виберіть проміжок часу',
  [EN]: 'Choose a time frame',
  [RU]: 'Выберите временной интервал',
  [ES]: 'Elija un intervalo de tiempo',
  [AR]: 'اختر فترة زمنية',
  [DE]: 'Wählen Sie einen Zeitraum',
  [FR]: 'Choisissez une période',
  [IT]: 'Scegli un intervallo di tempo',
};
