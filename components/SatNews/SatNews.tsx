// 'use client';

import { TSatDigest } from '@/models/satDigest.model';
// import { TSatModel } from '@/models/sat.model';
import SatNewsList from '../SatNewsList/SatNewsList';
import DateNewsList from '../DateNewsList/DateNewsList';

export type TGroupedNews = [string, Map<string, TSatDigest[]>][];

// const getSatLogoName = (map: Map<string, TSatDigest[]>): string => {
//   const m = map.get([...map.keys()][0]);
//   if (!m) return 'wrong_sat.png';

//   return m[0].satLogo || 'wrong_sat.png';
// };

// const setGroupedNewsBySatMap = (news: TSatDigest[]): TGroupedNews =>
//   Array.from(
//     news.reduce((acc, currObj) => {
//       const strCurrDate = `${currObj.date}`;
//       const satTitle = `${currObj.satTitle} ${currObj.satPosition}`;

//       const mapCurrSat = acc.get(satTitle) || new Map();
//       const newsArrForCurrDate = mapCurrSat.get(strCurrDate) || [];
//       mapCurrSat.set(strCurrDate, [...newsArrForCurrDate, currObj]);
//       acc.set(satTitle, mapCurrSat);

//       return acc;
//     }, new Map())
//   );

// const setGroupedNewsByDateMap = (news: TSatDigest[]): TGroupedNews =>
//   Array.from(
//     news.reduce((acc, currObj) => {
//       const strCurrDate = `Date ${currObj.date}`;
//       const mapCurrDate = acc.get(strCurrDate) || new Map();
//       const newsArrForCurrSat = mapCurrDate.get(currObj.satTitle) || [];
//       mapCurrDate.set(currObj.satTitle, [...newsArrForCurrSat, currObj]);
//       acc.set(strCurrDate, mapCurrDate);

//       return acc;
//     }, new Map())
//   );

// const getDailyNews = (newsArray: TSatDigest[]) =>
//   newsArray.reduce((acc, curr) => curr.text + acc, '');

interface ISatNewsProps {
  urlParams: { [key: string]: string | string[] | undefined };
  // satellites: TSatModel[][];
  // newsResult: TSatDigest[];
}

const SatNews = ({ urlParams }: ISatNewsProps) => (
  <article>
    {urlParams && Object.keys(urlParams).length ? (
      <SatNewsList urlParams={urlParams} />
    ) : (
      <DateNewsList />
    )}
  </article>
);

export default SatNews;
