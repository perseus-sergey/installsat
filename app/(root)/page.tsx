import FormDigestInterval from '@/components/FormDigestInterval1/FormDigestInterval';
import SatNews from '@/components/SatNews/SatNews';
import { Title } from '@/components/Title/Title';
// import { executeQuery } from '@/libs/db/mysqldb';
import { META_TRANS_NEWS_LIST } from '@/models/meta.model';
// import { TSatModel, satSql } from '@/models/sat.model';
import {
  // TSatDigest,
  LAST_NEWS_INTERVAL,
  // initNewsSql,
} from '@/models/satDigest.model';
import { EUrlParam } from '@/models/url.model';
import { Suspense } from 'react';

interface IProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

// const newsResult = await executeQuery<TSatDigest>(initNewsSql, [
//   `${LAST_NEWS_INTERVAL}`,
// ]);
// const satResult = await executeQuery<TSatModel>(satSql);

// // const groupedNewsByDateMap = (news: TSatDigest[]) =>
// //   news.reduce((acc, currObj) => {
// //     const strCurrDate = `${currObj.date}`;
// //     const date = acc.get(strCurrDate) || [];
// //     acc.set(strCurrDate, [...date, currObj]);

// //     return acc;
// //   }, new Map());

// // export type TGroupedNewsByDateMap = typeof groupedNewsByDateMap;

// const satellites = satResult.reduce(
//   (acc: TSatModel[][], curr) => {
//     curr.grade > 0 ? acc[0].push(curr) : acc[1].push(curr);

//     return acc;
//   },
//   [[], []]
// );

export default function SatNewsPage({ searchParams }: IProps) {
  const searchInterval = searchParams[EUrlParam.SEARCH_PARAM_INTERVAL];
  const intervalDays =
    typeof searchInterval === 'string' && searchInterval
      ? +searchInterval
      : LAST_NEWS_INTERVAL;

  return (
    <>
      <Title>{META_TRANS_NEWS_LIST.getH1(intervalDays)}</Title>
      <nav>
        <Suspense>
          <FormDigestInterval searchParams={searchParams} />
        </Suspense>
      </nav>
      <Suspense>
        <SatNews searchParams={searchParams} />
      </Suspense>
    </>
  );
}
