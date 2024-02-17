import React from 'react';
import styles from './SatNewsList.module.scss';
import DangerHtmlUl from '../DangerHtmlUl/DangerHtmlUl';
import { getDate } from '@/libs/utils';
import {
  LAST_NEWS_INTERVAL,
  TSatDigest,
  makeDigestSql,
} from '@/models/satDigest.model';
import { TGroupedNews } from '../SatNews/SatNews';
import Image from 'next/image';
import { executeQuery } from '@/libs/db/mysqldb';

interface ISatNewsListProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

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

export const getDailyNews = (newsArray: TSatDigest[]) =>
  newsArray.reduce((acc, curr) => curr.text + acc, '');

const SatNewsList = async ({ searchParams }: ISatNewsListProps) => {
  const selectSats = searchParams.sat as string[];
  const timeInterval = searchParams.interval || LAST_NEWS_INTERVAL;
  let orderBy = '';
  let inSatList = '';
  let tblName = 'tbl_digest';
  let where = '';

  if (timeInterval) {
    orderBy = 'ORDER BY satGrade, satTitle, d.date DESC';
    if (+timeInterval > 180) {
      if (+timeInterval !== new Date().getFullYear())
        tblName = `tbl_digest_${timeInterval}`;
    } else {
      where = `WHERE date >= CURDATE() - INTERVAL ${timeInterval} DAY`;
    }
  }
  if (selectSats && selectSats[0]) {
    const selectedSats =
      typeof selectSats === 'string' ? selectSats : selectSats.join('","');
    inSatList = `AND sat.grade IN ("${selectedSats}")`;
  }

  const newsSql = makeDigestSql(tblName, where, inSatList, orderBy);
  const newsIntervalResult = await executeQuery<TSatDigest>(newsSql, []);

  const newsArray = setGroupedNewsBySatMap(newsIntervalResult);

  return newsArray.map((news) => {
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
  });
};
export default SatNewsList;
