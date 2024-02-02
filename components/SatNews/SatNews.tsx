'use client';

import React, { useEffect, useState } from 'react';
// import styles from './SatNews.module.scss';
import { Title } from '../Title/Title';
import { META_TRANS_NEWS_LIST, getDate } from '@/models/meta.model';
import { IChannel } from '@/models/channel.model';
import { TSatDigest } from '@/models/satDigest.model';
import { getFormattedDateStr } from '@/libs/utils';
import Link from 'next/link';
import DangerHtmlUl from '../DangerHtmlUl/DangerHtmlUl';
import { TSatModel } from '@/models/sat.model';
import FormDigestInterval from '../FormDigestInterval/FormDigestInterval';
import { Loader } from '../loaders/Loader';

const groupedNewsByDateMap = (news: TSatDigest[]) =>
  news.reduce((acc, currObj) => {
    const strCurrDate = `${currObj.date}`;
    const date = acc.get(strCurrDate) || [];
    acc.set(strCurrDate, [...date, currObj]);

    return acc;
  }, new Map());

const dailyNews = (newsArray: IChannel[]) =>
  newsArray.reduce((acc, curr) => curr.text + acc, '');

interface ISatNewsProps {
  satellites: TSatModel[][];
  newsResult: TSatDigest[];
}

const SatNews = ({ satellites, newsResult }: ISatNewsProps) => {
  const [newsResults, setNewsResults] = useState<TSatDigest[]>([]);

  useEffect(() => {
    setNewsResults(newsResult);
  }, []);

  const intervalSubmitHandler = (data: TSatDigest[]) => {
    setNewsResults(data);
  };

  return (
    <>
      <Title name={META_TRANS_NEWS_LIST.getH1()} />
      <section>
        <FormDigestInterval
          satellites={satellites}
          intervalSubmitHandler={intervalSubmitHandler}
          newsResults={newsResults}
        />
      </section>
      <article>
        {newsResults.length > 0 && newsResults[0].satTitle !== '' ? (
          [...groupedNewsByDateMap(newsResults)].map((news) => {
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
                <DangerHtmlUl text={dailyNews(news[1])} />
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
