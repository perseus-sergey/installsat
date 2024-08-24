import { TGroupedNews } from '@/components/SatNews/SatNews';
import { poolExecute } from '@/libs/db/mysqldb';
import {
  IGroupedSatelliteOption,
  ISatelliteOption,
  ISatModel,
} from '@/models/tblSat.model';
import {
  LAST_NEWS_INTERVAL,
  META_TRANS_NEWS_LIST,
  TSatDigest,
} from '@/models/satDigest.model';
import { DEFAULT_LANG, EDBTableTitles, ELanguage } from '@/models/ui.model';
import { decode } from 'html-entities';
import { getFormattedDateStrYearFirst } from '@/libs/utils/dates';

const { FLY_SATELLITES, TRANS_NEWS } = EDBTableTitles;

export const getSatDigestNews = async ({
  satellites = undefined,
  interval = LAST_NEWS_INTERVAL,
  lang = DEFAULT_LANG,
}: {
  satellites?: string | string[] | undefined;
  interval?: number;
  lang?: ELanguage;
}): Promise<Error | TSatDigest[]> => {
  const timeInterval = interval || LAST_NEWS_INTERVAL;
  const currentYear = new Date().getFullYear();
  let tblDigest = TRANS_NEWS as string;

  const where =
    timeInterval > 180
      ? ''
      : `WHERE date >= CURDATE() - INTERVAL ${timeInterval} DAY`;

  let inSatList = '';

  if (timeInterval > 180 && timeInterval < currentYear)
    tblDigest += `_${timeInterval}`;

  if (satellites && satellites[0]) {
    const selectedSats =
      typeof satellites === 'string' ? satellites : satellites.join('","');
    inSatList = `${timeInterval > 180 ? 'WHERE' : 'AND'} S.grade IN ("${selectedSats}")`;
  }

  const sql = `
    SELECT 
      D.id,
      D.date,
      ${lang === ELanguage.UA ? 'D.text' : 'D.text_en AS text'},
      D.sat_name  AS satTitle,
      D.sat_position AS satPosition,
      D.sat_grade AS satGrade,
      S.logo AS satLogo
    FROM ${tblDigest} AS D
    LEFT JOIN ${FLY_SATELLITES} AS S ON D.sat_slug = S.slug
    ${where}
    ${inSatList}
    ORDER BY D.date DESC, satGrade, satTitle
  `;
  const res = await poolExecute<TSatDigest[]>(sql);

  return res instanceof Error
    ? res
    : res.map((r) => ({
        ...r,
        date: getFormattedDateStrYearFirst(r.date),
      }));
};

// export const getSatDigestNews = async ({
//   satellites = undefined,
//   timeInterval = 0,
//   lang = DEFAULT_LANG,
// }: {
//   satellites?: string | string[] | undefined;
//   timeInterval?: number;
//   lang?: ELanguage;
// }): Promise<Error | TSatDigest[]> => {
//   const currentYear = new Date().getFullYear();
//   let orderBy = 'ORDER BY d.date DESC, satGrade, satTitle';
//   let tblName = 'tbl_digest';
//   let where = `WHERE date >= CURDATE() - INTERVAL ${LAST_NEWS_INTERVAL} DAY`;
//   let inSatList = '';

//   if (timeInterval) {
//     orderBy = 'ORDER BY satGrade, satTitle, d.date DESC';
//     if (timeInterval > 180) {
//       where = '';
//       if (timeInterval < currentYear) tblName += `_${timeInterval}`;
//     } else {
//       where = `WHERE date >= CURDATE() - INTERVAL ${timeInterval} DAY`;
//     }
//   }

//   if (satellites && satellites[0]) {
//     const selectedSats =
//       typeof satellites === 'string' ? satellites : satellites.join('","');
//     inSatList = `${timeInterval > 180 ? 'WHERE' : 'AND'} sat.grade IN ("${selectedSats}")`;
//   }

//   const sql = `
//     SELECT d.id, d.date, ${lang === ELanguage.UA ? 'd.text' : 'd.text_en AS text'}, d.sat_name, d.sat_position,
//     sat.parent AS satParent,
//     sat.title AS satTitle,
//     sat.logo AS satLogo,
//     sat.grade AS satGrade,
//     sat.position AS satPosition
//     FROM ${tblName} AS d
//     LEFT JOIN tbl_chan_sat AS sat ON d.sat = sat.id
//     ${where}
//     ${inSatList}
//     ${orderBy}
//   `;
//   const res = await poolExecute<TSatDigest[]>(sql);

//   return res instanceof Error
//     ? res
//     : res.map((r) => ({
//         ...r,
//         date: getFormattedDateStrYearFirst(r.date),
//         satTitle: r.satTitle || r.sat_name || 'Unknown Satellite',
//         satPosition: r.satPosition || r.sat_position || '',
//       }));
// };

const getGroupedSatelliteOptions = (
  [eastSats, westSats]: ISatModel[][],
  isDefaultValue = true,
  lang: ELanguage,
  isChannelCount = false
): IGroupedSatelliteOption[] => {
  const { westDirectionLabel, eastDirectionLabel, defaultLabel } =
    META_TRANS_NEWS_LIST.select.satSelect;

  const mapToOption = (sats: ISatModel[]): ISatelliteOption[] =>
    sats.map((sat) => ({
      value: sat.grade,
      label: decode(
        `${sat.position} ..... ${sat.title}${isChannelCount ? ` [${sat.free_count}/${sat.all_count}]` : ''}`
      ),
    }));

  const options: IGroupedSatelliteOption[] = [
    {
      label: westDirectionLabel[lang],
      options: mapToOption(westSats),
    },
    {
      label: eastDirectionLabel[lang],
      options: mapToOption(eastSats),
    },
  ];

  if (isDefaultValue) {
    options.unshift({
      label: defaultLabel[lang],
      options: [{ value: '', label: defaultLabel[lang] }],
    });
  }

  return options;
};

export const splitSatellitesByDirection = (satellites: ISatModel[]) =>
  satellites.reduce(
    (acc: ISatModel[][], curr) => {
      curr.grade > 0 ? acc[0].push(curr) : acc[1].push(curr);

      return acc;
    },
    [[], []]
  );

export const getSatsForForm = async (
  isDefaultValue = true,
  lang: ELanguage,
  isChannelCount = false
) => {
  const satResult = await poolExecute<ISatModel[]>(`
  SELECT title, position, id, slug AS cpu, logo, all_count, free_count, grade
  FROM ${FLY_SATELLITES}
  ${isChannelCount ? 'WHERE all_count > 0' : ''}
  ORDER BY grade
`);

  return satResult instanceof Error
    ? satResult
    : getGroupedSatelliteOptions(
        splitSatellitesByDirection(satResult),
        isDefaultValue,
        lang,
        isChannelCount
      );
};

// export const getSatsForForm = async (
//   isDefaultValue = true,
//   lang: ELanguage
// ) => {
//   const satResult = await poolExecute<ISatModel[]>(`
//   SELECT title, id, position, grade
//   FROM tbl_chan_sat
//   WHERE title != ''
//   ORDER BY grade
// `);

//   return satResult instanceof Error
//     ? satResult
//     : getGroupedSatelliteOptions(
//         splitSatellitesByDirection(satResult),
//         isDefaultValue,
//         lang
//       );
// };

export const getTransNewsForSingleDay = async (
  date: string,
  lang = DEFAULT_LANG
): Promise<[string, TSatDigest[]][] | null> => {
  const sql = `
  SELECT 
    D.id,
    D.date,
    ${lang === ELanguage.UA ? 'D.text' : 'D.text_en AS text'},
    D.sat_name  AS satTitle,
    D.sat_position AS satPosition,
    D.sat_grade AS satGrade,
    S.logo AS satLogo
	FROM ${TRANS_NEWS} AS D
  LEFT JOIN ${FLY_SATELLITES} AS S ON D.sat_slug = S.slug
	WHERE date = ?
	ORDER BY satGrade, satTitle
`;
  const newsResult = await poolExecute<TSatDigest[]>(sql, [
    new Date(date).toLocaleDateString('en-CA'),
  ]);

  if (newsResult instanceof Error) return null;

  return Array.from(
    newsResult.reduce((acc, item) => {
      const satTitle = `${item.satTitle} ${item.satPosition}`;

      const mapCurrSat = acc.get(satTitle) || [];
      acc.set(satTitle, [...mapCurrSat, item]);

      return acc;
    }, new Map())
  );
};

export const setGroupedNewsByDateMap = async (
  lang = DEFAULT_LANG
): Promise<TGroupedNews | Error> => {
  const newsResult = await getSatDigestNews({ lang });

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
