import React from 'react';
import styles from './SatNewsList.module.scss';
import DangerHtml from '../DangerHtml/DangerHtml';
import { getDate } from '@/libs/utils';
import { META_TRANS_NEWS_LIST } from '@/models/satDigest.model';
import {
  getDailyNews,
  getSatDigestNews,
  setGroupedNewsBySatMap,
} from '@/controllers/satDigest.controller';
import EmptyData from '../EmptyData/EmptyData';
import FillingValidImage from '../Images/FillingValidImage';

interface ISatNewsListProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

const SatNewsList = async ({
  searchParams: { sat, interval },
}: ISatNewsListProps) => {
  const newsIntervalResult = await getSatDigestNews(sat, Number(interval));

  if (newsIntervalResult instanceof Error)
    return <EmptyData description={newsIntervalResult.message} />;

  const newsArray = setGroupedNewsBySatMap(newsIntervalResult);

  return newsArray.map((news) => (
    <div className={styles.newsBlock} key={news[0]}>
      <h2 className={styles.groupTitle}>
        <FillingValidImage
          image={{
            ...META_TRANS_NEWS_LIST.images.satLogo,
            src: `${META_TRANS_NEWS_LIST.images.satLogo.path}${news[1].get([...news[1].keys()][0])?.[0].satLogo}`,
          }}
          defaultImage={META_TRANS_NEWS_LIST.images.satLogo.defaultImg}
          alternativeImgString={
            META_TRANS_NEWS_LIST.images.satLogo.alternativeStr
          }
          alt={`${META_TRANS_NEWS_LIST.images.satLogo.alt.ua}${news[0]}`}
        />
        <div>
          {META_TRANS_NEWS_LIST.h2start.ua}
          <span className={styles.groupTitleDate}>{news[0]}</span>
        </div>
      </h2>
      {[...news[1]].map((satNews) => (
        <>
          <h3 className={styles.groupSubTitle} key={satNews[0]}>
            {`${getDate(satNews[0])} ....`}
          </h3>
          <div className={styles.newsList}>
            <DangerHtml text={getDailyNews(satNews[1])} wrapperTagName="ul" />
          </div>
        </>
      ))}
    </div>
  ));
};
export default SatNewsList;
