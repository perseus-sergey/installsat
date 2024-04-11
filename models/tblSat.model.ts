export const initSat = {
  id: -1,
  parent: -1,
  title: '',
  cpu: '',
  description: '',
  position: '',
  grade: -1,
  map_img: '',
  logo: '',
  view: -1,
  fill: -1,
};

export type TSatModel = typeof initSat;

export interface ISatelliteOption {
  value: number | string;
  label: string;
  isFixed?: boolean;
  isDisabled?: boolean;
}

export interface IGroupedSatelliteOption {
  label: string;
  options: ISatelliteOption[];
}

// export interface ISatelliteOption {
//   readonly value: number | string;
//   readonly label: string;
//   readonly isFixed?: boolean;
//   readonly isDisabled?: boolean;
// }

// export interface IGroupedSatelliteOption {
//   readonly label: string;
//   readonly options: readonly ISatelliteOption[];
// }
