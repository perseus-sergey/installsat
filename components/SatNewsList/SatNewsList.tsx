import React from 'react';
import styles from './SatNewsList.module.scss';
import DangerHtmlUl from '../DangerHtml/DangerHtml';
import { getDate } from '@/libs/utils';
import {
  LAST_NEWS_INTERVAL,
  META_TRANS_NEWS_LIST,
  TSatDigest,
} from '@/models/satDigest.model';
import { executeQuery } from '@/libs/db/mysqldb';
import {
  getDailyNews,
  makeDigestSql,
  setGroupedNewsBySatMap,
} from '@/controllers/satDigest.controller';
import EmptyData from '../EmptyData/EmptyData';
import FillingValidImage from '../Images/FillingValidImage';

interface ISatNewsListProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

// const getSatLogoName = (map: Map<string, TSatDigest[]>): string => {
//   const m = map.get([...map.keys()][0]);
//   if (!m) return 'wrong_sat.png';

//   return m[0].satLogo || 'wrong_sat.png';
// };

const SatNewsList = async ({
  searchParams: { sat, interval },
}: ISatNewsListProps) => {
  const selectSats = sat as string[];
  const timeInterval = interval || LAST_NEWS_INTERVAL;
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

  if (newsIntervalResult instanceof Error)
    return <EmptyData description={newsIntervalResult.message} />;

  const newsArray = setGroupedNewsBySatMap(newsIntervalResult);

  return newsArray.map((news) => {
    return (
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
export default SatNewsList;
