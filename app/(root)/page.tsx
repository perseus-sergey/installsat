import BreadCrumbs from '@/components/BreadCrumbs/BreadCrumbs';
import SatNews from '@/components/SatNews/SatNews';
import { executeQuery } from '@/libs/db/mysqldb';
import { TSatModel, satSql } from '@/models/sat.model';
import {
  TSatDigest,
  LAST_NEWS_INTERVAL,
  initNewsSql,
} from '@/models/satDigest.model';
import React from 'react';

const newsResult = await executeQuery<TSatDigest>(initNewsSql, [
  `${LAST_NEWS_INTERVAL}`,
]);
const satResult = await executeQuery<TSatModel>(satSql);

const groupedNewsByDateMap = (news: TSatDigest[]) =>
  news.reduce((acc, currObj) => {
    const strCurrDate = `${currObj.date}`;
    const date = acc.get(strCurrDate) || [];
    acc.set(strCurrDate, [...date, currObj]);

    return acc;
  }, new Map());

export type TGroupedNewsByDateMap = typeof groupedNewsByDateMap;

const satellites = satResult.reduce(
  (acc: TSatModel[][], curr) => {
    curr.grade > 0 ? acc[0].push(curr) : acc[1].push(curr);

    return acc;
  },
  [[], []]
);

export default function SatNewsPage() {
  return (
    <main className="main flex min-h-screen flex-col items-center justify-between p-24">
      <BreadCrumbs homeElement={'Home'} isCapitalizeLinks />
      <SatNews satellites={satellites} newsResult={newsResult} />)
    </main>
  );
}
