'use client';

import React, { useEffect, useState } from 'react';
import styles from './SatNews.module.scss';
import { Title } from '../Title/Title';
import { META_TRANS_NEWS_LIST } from '@/models/meta.model';
import { TSatDigest } from '@/models/satDigest.model';
import { getDate, getFormattedDateStr } from '@/libs/utils';
import Link from 'next/link';
import DangerHtmlUl from '../DangerHtmlUl/DangerHtmlUl';
import { TSatModel } from '@/models/sat.model';
import FormDigestInterval from '../FormDigestInterval/FormDigestInterval';
import { Loader } from '../loaders/Loader';
import Image from 'next/image';

type TGroupedNews = [string, Map<string, TSatDigest[]>][];

const getSatLogoName = (map: Map<string, TSatDigest[]>): string => {
  const m = map.get([...map.keys()][0]);
  if (!m) return 'wrong_sat.png';

  return m[0].satLogo || 'wrong_sat.png';
};

const setGroupedNewsBySatMap = (news: TSatDigest[]): TGroupedNews =>
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

const setGroupedNewsByDateMap = (news: TSatDigest[]): TGroupedNews =>
  Array.from(
    news.reduce((acc, currObj) => {
      const strCurrDate = `Date ${currObj.date}`;
      const mapCurrDate = acc.get(strCurrDate) || new Map();
      const newsArrForCurrSat = mapCurrDate.get(currObj.satTitle) || [];
      mapCurrDate.set(currObj.satTitle, [...newsArrForCurrSat, currObj]);
      acc.set(strCurrDate, mapCurrDate);

      return acc;
    }, new Map())
  );

const getDailyNews = (newsArray: TSatDigest[]) =>
  newsArray.reduce((acc, curr) => curr.text + acc, '');

interface ISatNewsProps {
  satellites: TSatModel[][];
  newsResult: TSatDigest[];
}

const SatNews = ({ satellites, newsResult }: ISatNewsProps) => {
  const [newsArray, setNewsArray] = useState<TGroupedNews>([]);

  useEffect(() => {
    setNewsArray(setGroupedNewsByDateMap(newsResult));
  }, []);

  const intervalSubmitHandler = (data: TSatDigest[]) => {
    setNewsArray(setGroupedNewsBySatMap(data));
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
        {newsArray.length ? (
          /^Date/.test(newsArray[0][0]) ? (
            newsArray.map((news) => {
              return (
                <div className={styles.newsBlock} key={news[0]}>
                  <h2 className={`${styles.groupTitle} ${styles.alignCenter}`}>
                    <Link
                      href={`/sputnikovye-novosti/${getFormattedDateStr(news[0])}`}
                    >
                      Транспондерні новини за{' '}
                      <span className={styles.groupTitleDate}>
                        {getDate(news[0])}
                      </span>
                    </Link>
                  </h2>
                  {[...news[1]].map((satNews) => {
                    return (
                      <React.Fragment key={satNews[0]}>
                        <h3 className={styles.groupSubTitle}>
                          {`${satNews[0]} ${satNews[1][0].satPosition}`}
                        </h3>
                        <div className={styles.newsList}>
                          <DangerHtmlUl text={getDailyNews(satNews[1])} />
                        </div>
                      </React.Fragment>
                    );
                  })}
                </div>
              );
            })
          ) : (
            newsArray.map((news) => {
              return (
                <div className={styles.newsBlock} key={news[0]}>
                  <h2 className={styles.groupTitle}>
                    <Image
                      className={styles.satImg}
                      src={`/images/satellites/${getSatLogoName(news[1])}`}
                      alt={`логотип супутника ${news[0]}`}
                      width={67}
                      height={50}
                      // width={132}
                      // height={99}
                    />
                    <div>
                      Новини супутника{' '}
                      <span className={styles.groupTitleDate}>{news[0]}</span>
                    </div>
                  </h2>
                  {[...news[1]].map((satNews) => {
                    return (
                      <React.Fragment key={satNews[0]}>
                        <h3 className={styles.groupSubTitle}>
                          {`${getDate(satNews[0])} ....`}
                        </h3>
                        <div className={styles.newsList}>
                          <DangerHtmlUl text={getDailyNews(satNews[1])} />
                        </div>
                      </React.Fragment>
                    );
                  })}
                </div>
              );
            })
          )
        ) : (
          <h3 className={styles.loader}>
            <Loader /> Sorry, there is no data on set parameters
          </h3>
        )}
      </article>
    </>
  );
};

export default SatNews;
