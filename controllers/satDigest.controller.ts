import { TGroupedNews } from '@/components/SatNews/SatNews';
import { executeQuery } from '@/libs/db/mysqldb';
import { TSatModel, satSql } from '@/models/sat.model';
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

export const initNewsSql = makeDigestSql(
  'tbl_digest',
  'WHERE d.date >= CURDATE() - INTERVAL ? DAY',
  '',
  'ORDER BY d.date DESC, satGrade, satTitle'
);

export const getSatsForForm = async () => {
  const satResult = await executeQuery<TSatModel>(satSql);

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
): Promise<[string, TSatDigest[]][]> => {
  const newsResult = await executeQuery<TSatDigest>(singleDaySql, [date]);

  return Array.from(
    newsResult.reduce((acc, currObj) => {
      const satTitle = `${currObj.satTitle} ${currObj.satPosition}`;
      const mapCurrSat = acc.get(satTitle) || [];
      acc.set(satTitle, [...mapCurrSat, currObj]);

      return acc;
    }, new Map())
  );
};

export const setGroupedNewsByDateMap = async (): Promise<TGroupedNews> => {
  const newsResult = await executeQuery<TSatDigest>(initNewsSql, [
    `${LAST_NEWS_INTERVAL}`,
  ]);

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
