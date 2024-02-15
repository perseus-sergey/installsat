import Link from 'next/link';
import styles from './DateNewsList.module.scss';
import { EUrlPath } from '@/models/url.model';
import { getDate, getFormattedDateStr } from '@/libs/utils';
import React from 'react';
import DangerHtmlUl from '../DangerHtmlUl/DangerHtmlUl';
import { getDailyNews } from '../SatNewsList/SatNewsList';
import {
  LAST_NEWS_INTERVAL,
  TSatDigest,
  initNewsSql,
} from '@/models/satDigest.model';
import { TGroupedNews } from '../SatNews/SatNews';
import { executeQuery } from '@/libs/db/mysqldb';

const setGroupedNewsByDateMap = async (): Promise<TGroupedNews> => {
  const newsResult = await executeQuery<TSatDigest>(initNewsSql, [
    `${LAST_NEWS_INTERVAL}`,
  ]);

  return Array.from(
    newsResult.reduce((acc, currObj) => {
      const strCurrDate = `Date ${currObj.date}`;
      const mapCurrDate = acc.get(strCurrDate) || new Map();
      const newsArrForCurrSat = mapCurrDate.get(currObj.satTitle) || [];
      mapCurrDate.set(currObj.satTitle, [...newsArrForCurrSat, currObj]);
      acc.set(strCurrDate, mapCurrDate);

      return acc;
    }, new Map())
  );
};

const DateNewsList = async () => {
  const newsArray = await setGroupedNewsByDateMap();

  return newsArray.map((news) => {
    return (
      <div className={styles.newsBlock} key={news[0]}>
        <h2 className={`${styles.groupTitle} ${styles.alignCenter}`}>
          <Link
            href={`/${EUrlPath.TRANSPONDER_NEWS}/${getFormattedDateStr(news[0])}`}
          >
            Транспондерні новини за{' '}
            <span className={styles.groupTitleDate}>{getDate(news[0])}</span>
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
  });
};
export default DateNewsList;
