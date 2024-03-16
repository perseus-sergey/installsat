import Link from 'next/link';
import styles from '../SatNewsList/SatNewsList.module.scss';
import { getDate, getFormattedDateStr } from '@/libs/utils';
import React from 'react';
import DangerHtmlUl from '../DangerHtml/DangerHtml';
import { getDailyNews } from '../SatNewsList/SatNewsList';
import { setGroupedNewsByDateMap } from '@/controllers/satDigest.controller';
import EmptyData from '../EmptyData/EmptyData';
import { EUrlBaseParam } from '@/models/url.model';
import { DATE_NEWS_LIST_TITLE } from '@/models/satDigest.model';

const DateNewsList = async () => {
  const newsArray = await setGroupedNewsByDateMap();

  if (newsArray instanceof Error)
    return <EmptyData description={newsArray.message} />;

  return newsArray.map((news) => {
    return (
      <div className={styles.newsBlock} key={news[0]}>
        <h2 className={`${styles.groupTitle} ${styles.alignCenter}`}>
          <Link
            href={`/${EUrlBaseParam.TRANSPONDER_NEWS}/${getFormattedDateStr(news[0])}`}
          >
            {DATE_NEWS_LIST_TITLE.ua}
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
                <DangerHtmlUl text={getDailyNews(satNews[1])} tagName="ul" />
              </div>
            </React.Fragment>
          );
        })}
      </div>
    );
  });
};
export default DateNewsList;
