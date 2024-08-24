export interface ISatModel {
  id: number;
  parent: number;
  title: string;
  cpu: string;
  description: string;
  position: string;
  grade: number;
  map_img: string;
  logo: string;
  view: number;
  fill: number;
  all_count: number;
  free_count: number;
}

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
