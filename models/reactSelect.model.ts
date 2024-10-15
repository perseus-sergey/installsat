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
