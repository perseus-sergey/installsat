import { TGroupedNews } from '@/components/SatNews/SatNews';
import { poolExecute } from '@/libs/db/mysqldb';
import {
  IGroupedSatelliteOption,
  ISatelliteOption,
  ISatModel,
} from '@/models/tblSat.model';
import {
  LAST_NEWS_INTERVAL,
  TRANS_NEWS_LIST_FILTERS,
  TSatDigest,
} from '@/models/satDigest.model';
import { EDBTableTitles } from '@/models/dbTblNames.model';
import { decode } from 'html-entities';
import { getFormattedDateStrYearFirst } from '@/libs/utils/dates';
import { cache } from 'react';
import { DEFAULT_LANG, ELanguage } from '@/models/language.model';

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
      D.sat_slug,
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

const getGroupedSatelliteOptions = (
  [eastSats, westSats]: ISatModel[][],
  isDefaultValue = true,
  lang: ELanguage,
  isChannelCount = false
): IGroupedSatelliteOption[] => {
  const { westDirectionLabel, eastDirectionLabel, defaultLabel } =
    TRANS_NEWS_LIST_FILTERS.select.satSelect;

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

interface IFlySatParams {
  title: string;
  position: string;
  grade: string;
  id: number;
  slug: string;
  logo: string;
  all_count: number;
  free_count: number;
}
export const getFlySatParams = cache(async (satSlug: string) => {
  const res = await poolExecute<IFlySatParams[]>(
    `
  SELECT title, position, id, slug, logo, all_count, free_count, grade
  FROM ${FLY_SATELLITES}
  WHERE slug = ?
  `,
    [satSlug]
  );

  return res instanceof Error || res.length === 0 ? null : res[0];
});

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
    D.sat_slug,
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
