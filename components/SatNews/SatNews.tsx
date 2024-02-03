'use client';

import React, { useEffect, useState } from 'react';
// import styles from './SatNews.module.scss';
import { Title } from '../Title/Title';
import { META_TRANS_NEWS_LIST } from '@/models/meta.model';
import { TSatDigest } from '@/models/satDigest.model';
import { getDate, getFormattedDateStr } from '@/libs/utils';
import Link from 'next/link';
import DangerHtmlUl from '../DangerHtmlUl/DangerHtmlUl';
import { TSatModel } from '@/models/sat.model';
import FormDigestInterval from '../FormDigestInterval/FormDigestInterval';
import { Loader } from '../loaders/Loader';

const setGroupedNewsMap = (
  news: TSatDigest[]
): Map<string, Map<string, TSatDigest[]>> =>
  news.reduce((acc, currObj) => {
    const strCurrDate = `${currObj.date}`;
    const mapCurrDate = acc.get(strCurrDate) || new Map();
    const newsArrForCurrSat = mapCurrDate.get(currObj.satTitle) || [];
    mapCurrDate.set(currObj.satTitle, [...newsArrForCurrSat, currObj]);
    acc.set(strCurrDate, mapCurrDate);

    return acc;
  }, new Map());

const getDailyNews = (newsArray: TSatDigest[]) =>
  newsArray.reduce((acc, curr) => curr.text + acc, '');

interface ISatNewsProps {
  satellites: TSatModel[][];
  newsResult: TSatDigest[];
}

const SatNews = ({ satellites, newsResult }: ISatNewsProps) => {
  const [newsArray, setNewsResults] = useState<
    [string, Map<string, TSatDigest[]>][]
  >([]);

  useEffect(() => {
    setNewsResults(Array.from(setGroupedNewsMap(newsResult)));
  }, []);

  const intervalSubmitHandler = (data: TSatDigest[]) => {
    setNewsResults(Array.from(setGroupedNewsMap(data)));
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
        {newsArray.length > 0 ? (
          newsArray.map((news) => {
            return (
              <React.Fragment key={news[0]}>
                <h2
                  className="eTitle"
                  style={{ borderBottom: '2px groove #999999' }}
                >
                  <Link
                    href={`/sputnikovye-novosti/${getFormattedDateStr(news[0])}`}
                  >
                    Транспондерні новини за{' '}
                    <span style={{ color: '#EE0000' }}>{getDate(news[0])}</span>
                  </Link>
                </h2>
                {[...news[1]].map((satNews) => {
                  return (
                    <React.Fragment key={satNews[0]}>
                      <h3>{`${satNews[0]} ${satNews[1][0].satPosition}`}</h3>
                      <DangerHtmlUl text={getDailyNews(satNews[1])} />
                    </React.Fragment>
                  );
                })}
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
