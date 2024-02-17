export const satSql = `
SELECT title, id, position, grade
FROM tbl_chan_sat
WHERE title!=''
ORDER BY grade
`;

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
  readonly value: number | string;
  readonly label: string;
  readonly isFixed?: boolean;
  readonly isDisabled?: boolean;
}

export interface IGroupedSatelliteOption {
  readonly label: string;
  readonly options: readonly ISatelliteOption[];
}

export const getGroupedSatelliteOptions = ([
  eastSats,
  westSats,
]: TSatModel[][]): readonly IGroupedSatelliteOption[] => [
  {
    label: '--= Всі Супутники =--',
    options: [
      {
        value: '',
        label: '--= Всі Супутники =--',
      },
    ],
  },
  {
    label: 'Західний напрямок',
    options: westSats.map((sat) => ({
      value: sat.grade,
      label: `${sat.position} ..... ${sat.title}`,
    })),
  },
  {
    label: 'Східний напрямок',
    options: eastSats.map((sat) => ({
      value: sat.grade,
      label: `${sat.position} ..... ${sat.title}`,
    })),
  },
];
