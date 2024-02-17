import Link from 'next/link';
import styles from '../SatNewsList/SatNewsList.module.scss';
import { EUrlParam } from '@/models/url.model';
import { getDate, getFormattedDateStr } from '@/libs/utils';
import React from 'react';
import DangerHtmlUl from '../DangerHtmlUl/DangerHtmlUl';
import { getDailyNews } from '../SatNewsList/SatNewsList';
import { setGroupedNewsByDateMap } from '@/controllers/satDigest.controller';

const DateNewsList = async () => {
  const newsArray = await setGroupedNewsByDateMap();

  return newsArray.map((news) => {
    return (
      <div className={styles.newsBlock} key={news[0]}>
        <h2 className={`${styles.groupTitle} ${styles.alignCenter}`}>
          <Link
            href={`/${EUrlParam.TRANSPONDER_NEWS}/${getFormattedDateStr(news[0])}`}
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
