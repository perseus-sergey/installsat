import Link from 'next/link';
import styles from '../SatNewsList/SatNewsList.module.scss';
import React from 'react';
import DangerHtmlUl from '../ui/DangerHtml/DangerHtml';
import {
  getDailyNews,
  setGroupedNewsByDateMap,
} from '@/controllers/satDigest.controller';
import EmptyData from '../errors/EmptyData/EmptyData';
import { EUrlBaseParam } from '@/models/url.model';
import { META_TRANS_NEWS_SINGLE } from '@/models/satDigest.model';
import { ELanguage } from '@/models/ui.model';
import { getDateInISO } from '@/libs/utils/dates';
import { decode } from 'html-entities';

const DateNewsList = async ({ lang }: { lang: ELanguage }) => {
  const newsArray = await setGroupedNewsByDateMap();

  if (newsArray instanceof Error)
    return <EmptyData lang={lang} description={newsArray.message} />;

  return newsArray.map((news) => {
    const dateInISO = getDateInISO(news[0]);

    return (
      <div className={styles.newsBlock} key={news[0]}>
        <h2 className={`${styles.groupTitle} ${styles.alignCenter}`}>
          <Link
            href={`/${lang}/${EUrlBaseParam.TRANSPONDER_NEWS}/${dateInISO}`}
          >
            {META_TRANS_NEWS_SINGLE.metaH1start[lang]}
            <span className={styles.groupTitleDate}> {dateInISO}</span>
          </Link>
        </h2>
        {[...news[1]].map((satNews) => {
          return (
            <React.Fragment key={satNews[0]}>
              <h3 className={styles.groupSubTitle}>
                {decode(`${satNews[0]} ${satNews[1][0].satPosition}`)}
              </h3>
              <div className={styles.newsList}>
                <DangerHtmlUl
                  text={getDailyNews(satNews[1])}
                  wrapperTagName="ul"
                />
              </div>
            </React.Fragment>
          );
        })}
      </div>
    );
  });
};
export default DateNewsList;
