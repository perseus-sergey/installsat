import { TGroupedNews } from '@/components/SatNews/SatNews';
import { executeQuery } from '@/libs/db/mysqldb';
import { IGroupedSatelliteOption, TSatModel } from '@/models/tblSat.model';
import { LAST_NEWS_INTERVAL, TSatDigest } from '@/models/satDigest.model';

export const singleDaySql = `
SELECT d.date, d.text, d.id,
	sat.parent AS satPar,
	sat.title AS satTitle,
	sat.logo AS satLogo,
	sat.grade AS satGrade,
	sat.position AS satPosition
	FROM tbl_digest AS d
	LEFT JOIN tbl_chan_sat AS sat ON d.sat = sat.id
	WHERE date = ?
	ORDER BY satGrade, satTitle
`;

export const makeDigestSql = (
  tblName: string,
  where: string,
  inSatList: string,
  orderBy: string
) => `
  SELECT d.id, d.date, d.text,
  sat.parent AS satParent,
  sat.title AS satTitle,
  sat.logo AS satLogo,
  sat.grade AS satGrade,
  sat.position AS satPosition
  FROM ${tblName} AS d
  LEFT JOIN tbl_chan_sat AS sat ON d.sat = sat.id
  ${where}
  ${inSatList}
  ${orderBy}
`;

export const satSql = `
  SELECT title, id, position, grade
  FROM tbl_chan_sat
  WHERE title!=''
  ORDER BY grade
`;

export const initNewsSql = makeDigestSql(
  'tbl_digest',
  'WHERE d.date >= CURDATE() - INTERVAL ? DAY',
  '',
  'ORDER BY d.date DESC, satGrade, satTitle'
);

export const getSatsForForm = async () => {
  const satResult = await executeQuery<TSatModel>(satSql);

  if (satResult instanceof Error) return satResult;

  return satResult.reduce(
    (acc: TSatModel[][], curr) => {
      curr.grade > 0 ? acc[0].push(curr) : acc[1].push(curr);

      return acc;
    },
    [[], []]
  );
};

export const getTransNewsForSingleDay = async (
  date: string,
  singleDaySql: string
): Promise<[string, TSatDigest[]][] | Error> => {
  const newsResult = await executeQuery<TSatDigest>(singleDaySql, [date]);

  if (newsResult instanceof Error) return newsResult;

  return Array.from(
    newsResult.reduce((acc, currObj) => {
      const satTitle = `${currObj.satTitle} ${currObj.satPosition}`;
      const mapCurrSat = acc.get(satTitle) || [];
      acc.set(satTitle, [...mapCurrSat, currObj]);

      return acc;
    }, new Map())
  );
};

export const setGroupedNewsByDateMap = async (): Promise<
  TGroupedNews | Error
> => {
  const newsResult = await executeQuery<TSatDigest>(initNewsSql, [
    `${LAST_NEWS_INTERVAL}`,
  ]);

  if (newsResult instanceof Error) return newsResult;

  return Array.from(
    newsResult.reduce((acc, currObj) => {
      const strCurrDate = `${currObj.date}`;
      const mapCurrDate = acc.get(strCurrDate) || new Map();
      const newsArrForCurrSat = mapCurrDate.get(currObj.satTitle) || [];
      mapCurrDate.set(currObj.satTitle, [...newsArrForCurrSat, currObj]);
      acc.set(strCurrDate, mapCurrDate);

      return acc;
    }, new Map())
  );
};

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
