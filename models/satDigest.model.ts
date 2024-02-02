export const LAST_NEWS_INTERVAL = 370;

export const newsSql = `
SELECT d.id, d.date, d.text,
sat.parent AS satParent,
sat.title AS satTitle,
sat.logo AS satLogo,
sat.grade AS satGrade,
sat.position AS satPosition
FROM tbl_digest AS d
LEFT JOIN tbl_chan_sat AS sat ON d.sat = sat.id
WHERE d.date >= CURDATE() - INTERVAL ? DAY
ORDER BY d.date DESC, satGrade, satTitle
`;

export const rawSatDigest = {
  id: -1,
  date: new Date('1970-01-01'),
  update: -1,
  text: '',
  sat: -1,
  sat_name: '',
  country: '',
  satParent: '',
  satTitle: '',
  satLogo: '',
  satGrade: '',
  satPosition: '',
};

export type TSatDigest = typeof rawSatDigest;

export interface StateOption {
  readonly value: number;
  readonly label: string;
}

export const digestIntervals: readonly StateOption[] = [
  { value: 7, label: 'Останні 7 днів' },
  { value: 30, label: 'Останні 30 днів' },
  { value: 90, label: 'Останні 90 днів' },
  { value: 180, label: 'Останні півроку' },
  { value: 2020, label: '2020 рік' },
  { value: 2019, label: '2019 рік' },
  { value: 2018, label: '2018 рік' },
  { value: 2017, label: '2017 рік' },
  { value: 2016, label: '2016 рік' },
  { value: 2015, label: '2015 рік' },
];
