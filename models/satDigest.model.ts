export const LAST_NEWS_INTERVAL = 370;

export interface ISatDigest {
  id: number;
  date: Date;
  update: number;
  text: string;
  sat: number;
  sat_name: string;
  country: string;
  satParent: string;
  satTitle: string;
  satLogo: string;
  satGrade: string;
  satPosition: string;
}

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

export const digestIntervals = [
  { value: '7', text: 'Последние 7 дней' },
  { value: '30', text: 'Последние 30 дней' },
  { value: '90', text: 'Последние 90 дней' },
  { value: '180', text: 'Последние полгода' },
  { value: '2020', text: '2020 год' },
  { value: '2019', text: '2019 год' },
  { value: '2018', text: '2018 год' },
  { value: '2017', text: '2017 год' },
  { value: '2016', text: '2016 год' },
  { value: '2015', text: '2015 год' },
];
