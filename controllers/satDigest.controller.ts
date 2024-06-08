import { TGroupedNews } from '@/components/SatNews/SatNews';
import { executeQuery } from '@/libs/db/mysqldb';
import {
  IGroupedSatelliteOption,
  ISatelliteOption,
  TSatModel,
} from '@/models/tblSat.model';
import {
  LAST_NEWS_INTERVAL,
  META_TRANS_NEWS_LIST,
  TSatDigest,
} from '@/models/satDigest.model';
import { LANGUAGE } from '@/models/ui.model';

export const getSatDigestNews = async ({
  satellites = undefined,
  timeInterval = 0,
}: {
  satellites?: string | string[] | undefined;
  timeInterval?: number;
}): Promise<Error | TSatDigest[]> => {
  let orderBy = 'ORDER BY d.date DESC, satGrade, satTitle';
  let tblName = 'tbl_digest';
  let where = `WHERE date >= CURDATE() - INTERVAL ${LAST_NEWS_INTERVAL} DAY`;
  let inSatList = '';

  if (timeInterval) {
    orderBy = 'ORDER BY satGrade, satTitle, d.date DESC';
    if (timeInterval > 180) {
      where = '';
      if (timeInterval !== new Date().getFullYear())
        tblName += `_${timeInterval}`;
    } else {
      where = `WHERE date >= CURDATE() - INTERVAL ${timeInterval} DAY`;
    }
  }

  if (satellites && satellites[0]) {
    const selectedSats =
      typeof satellites === 'string' ? satellites : satellites.join('","');
    inSatList = `${timeInterval > 180 ? 'WHERE' : 'AND'} sat.grade IN ("${selectedSats}")`;
  }

  const sql = `
    SELECT d.id, d.date, d.text, d.sat_name, d.sat_position,
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
  const res = await executeQuery<TSatDigest>(sql);

  return res instanceof Error
    ? res
    : res.map((r) => ({
        ...r,
        date: (r.date as Date).toLocaleDateString('en-CA', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
        }),
        satTitle: r.satTitle || r.sat_name || 'Unknown Satellite',
        satPosition: r.satPosition || r.sat_position || '',
      }));
};

export const getGroupedSatelliteOptions = (
  [eastSats, westSats]: TSatModel[][],
  isDefaultValue = true
): IGroupedSatelliteOption[] => {
  const language = LANGUAGE;
  const { westDirectionLabel, eastDirectionLabel, defaultLabel } =
    META_TRANS_NEWS_LIST.select.satSelect;

  const mapToOption = (sats: TSatModel[]): ISatelliteOption[] =>
    sats.map((sat) => ({
      value: sat.grade,
      label: `${sat.position} ..... ${sat.title}`,
    }));

  const options: IGroupedSatelliteOption[] = [
    {
      label: westDirectionLabel[language],
      options: mapToOption(westSats),
    },
    {
      label: eastDirectionLabel[language],
      options: mapToOption(eastSats),
    },
  ];

  if (isDefaultValue) {
    options.unshift({
      label: defaultLabel[language],
      options: [{ value: '', label: defaultLabel[language] }],
    });
  }

  return options;
};

export const splitSatellitesByDirection = (satellites: TSatModel[]) =>
  satellites.reduce(
    (acc: TSatModel[][], curr) => {
      curr.grade > 0 ? acc[0].push(curr) : acc[1].push(curr);

      return acc;
    },
    [[], []]
  );

export const getSatsForForm = async (isDefaultValue = true) => {
  const satResult = await executeQuery<TSatModel>(`
  SELECT title, id, position, grade
  FROM tbl_chan_sat
  WHERE title!=''
  ORDER BY grade
`);

  return satResult instanceof Error
    ? satResult
    : getGroupedSatelliteOptions(
        splitSatellitesByDirection(satResult),
        isDefaultValue
      );
};

export const getTransNewsForSingleDay = async (
  date: string
): Promise<[string, TSatDigest[]][] | null> => {
  const sql = `
  SELECT 
    d.date, 
    d.text, 
    d.id,
    d.sat_name, 
    d.sat_position,
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
  const newsResult = await executeQuery<TSatDigest>(sql, [
    new Date(date).toLocaleDateString('en-CA'),
  ]);

  if (newsResult instanceof Error) return null;

  return Array.from(
    newsResult.reduce((acc, item) => {
      const satName = item.satTitle || item.sat_name || 'Unknown Satellite';
      const position = item.sat_position || item.sat_position || '';
      const satTitle = `${satName} ${position}`;

      const mapCurrSat = acc.get(satTitle) || [];
      acc.set(satTitle, [...mapCurrSat, item]);

      return acc;
    }, new Map())
  );
};

export const setGroupedNewsByDateMap = async (): Promise<
  TGroupedNews | Error
> => {
  const newsResult = await getSatDigestNews({});

  if (newsResult instanceof Error) return newsResult;

  return Array.from(
    newsResult.reduce((acc, currObj) => {
      const strCurrDate = currObj.date;
      const mapCurrDate = acc.get(strCurrDate) || new Map();
      const newsArrForCurrSat = mapCurrDate.get(currObj.satTitle) || [];
      mapCurrDate.set(currObj.satTitle, [...newsArrForCurrSat, currObj]);
      acc.set(strCurrDate, mapCurrDate);

      return acc;
    }, new Map())
  );
};

export const setGroupedNewsBySatMap = (news: TSatDigest[]): TGroupedNews =>
  Array.from(
    news.reduce((acc, currObj) => {
      const strCurrDate = `${currObj.date}`;
      const satTitle = `${currObj.satTitle} ${currObj.satPosition}`;

      const mapCurrSat = acc.get(satTitle) || new Map();
      const newsArrForCurrDate = mapCurrSat.get(strCurrDate) || [];
      mapCurrSat.set(strCurrDate, [...newsArrForCurrDate, currObj]);
      acc.set(satTitle, mapCurrSat);

      return acc;
    }, new Map())
  );

export const getDailyNews = (newsArray: TSatDigest[]) =>
  newsArray.reduce((acc, curr) => curr.text + acc, '');
