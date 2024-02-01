import SatNews from '@/components/SatNews/SatNews';
import { executeQuery } from '@/libs/db/mysqldb';
import { ISat, satSql } from '@/models/sat.model';
import {
  ISatDigest,
  LAST_NEWS_INTERVAL,
  TSatDigest,
  newsSql,
} from '@/models/satDigest.model';
import React from 'react';

const newsResult = await executeQuery<ISatDigest>(newsSql, [
  `${LAST_NEWS_INTERVAL}`,
]);
const satResult = await executeQuery<ISat>(satSql);

const groupedNewsByDateMap = (news: TSatDigest[]) =>
  news.reduce((acc, currObj) => {
    const strCurrDate = `${currObj.date}`;
    const date = acc.get(strCurrDate) || [];
    acc.set(strCurrDate, [...date, currObj]);

    return acc;
  }, new Map());

export type TGroupedNewsByDateMap = typeof groupedNewsByDateMap;

const satellites = satResult.reduce(
  (acc: ISat[][], curr) => {
    curr.grade > 0 ? acc[0].push(curr) : acc[1].push(curr);

    return acc;
  },
  [[], []]
);

export default function SatNewsPage() {
  return <SatNews satellites={satellites} newsResult={newsResult} />;
}
