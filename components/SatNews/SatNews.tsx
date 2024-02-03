'use client';

import React, { useEffect, useState } from 'react';
// import styles from './SatNews.module.scss';
import { Title } from '../Title/Title';
import { META_TRANS_NEWS_LIST, getDate } from '@/models/meta.model';
import { TSatDigest } from '@/models/satDigest.model';
import { getFormattedDateStr } from '@/libs/utils';
import Link from 'next/link';
import DangerHtmlUl from '../DangerHtmlUl/DangerHtmlUl';
import { TSatModel } from '@/models/sat.model';
import FormDigestInterval from '../FormDigestInterval/FormDigestInterval';
import { Loader } from '../loaders/Loader';

const setGroupedNewsByDateMap = (
  news: TSatDigest[]
): Map<string, TSatDigest[]> =>
  news.reduce((acc, currObj) => {
    const strCurrDate = `${currObj.date}`;
    const date = acc.get(strCurrDate) || [];
    acc.set(strCurrDate, [...date, currObj]);

    return acc;
  }, new Map());

// const setGroupedNewsBySatMap = (news: TSatDigest[]) =>
//   news.reduce((acc, currObj) => {
//     const strCurrDate = `${currObj.date}`;
//     const date = acc.get(strCurrDate) || [];
//     acc.set(strCurrDate, [...date, currObj]);

//     return acc;
//   }, new Map());

const getDailyNews = (newsArray: TSatDigest[]) =>
  newsArray.reduce((acc, curr) => curr.text + acc, '');

interface ISatNewsProps {
  satellites: TSatModel[][];
  newsResult: TSatDigest[];
}

const SatNews = ({ satellites, newsResult }: ISatNewsProps) => {
  const [newsArray, setNewsResults] = useState<[string, TSatDigest[]][]>([]);

  useEffect(() => {
    const map = setGroupedNewsByDateMap(newsResult);
    console.log('🚀 ~ useEffect ~ map:', map);
    setNewsResults(Array.from(map));
  }, []);

  const intervalSubmitHandler = (data: TSatDigest[]) => {
    setNewsResults(Array.from(setGroupedNewsByDateMap(data)));
  };

  return (
    <>
      <Title name={META_TRANS_NEWS_LIST.getH1()} />
      <section>
        <FormDigestInterval
          satellites={satellites}
          intervalSubmitHandler={intervalSubmitHandler}
          newsResults={newsResult}
        />
      </section>
      <article>
        {newsArray.length > 0 && newsArray[0][1][0].satTitle !== '' ? (
          newsArray.map((news) => {
            return (
              <React.Fragment key={news[0]}>
                <h2
                  className="eTitle"
                  style={{ borderBottom: '2px groove #999999' }}
                >
                  <Link
                    href={`/sputnikovye-novosti/${getFormattedDateStr(news[1][0].date)}`}
                  >
                    Транспондерні новини за{' '}
                    <span style={{ color: '#EE0000' }}>
                      {getDate(news[1][0].date)}
                    </span>
                  </Link>
                </h2>
                <DangerHtmlUl text={getDailyNews(news[1])} />
              </React.Fragment>
            );
          })
        ) : (
          <h3
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              color: 'red',
              fontWeight: 'bold',
            }}
          >
            <Loader /> Sorry, there is no data on set parameters
          </h3>
        )}
      </article>
    </>
  );
};

export default SatNews;
