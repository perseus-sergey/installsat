import styles from './SatNewsList.module.scss';
import DangerHtml from '../ui/DangerHtml/DangerHtml';
import { META_TRANS_NEWS_LIST } from '@/models/satDigest.model';
import {
  getDailyNews,
  getSatDigestNews,
  setGroupedNewsBySatMap,
} from '@/controllers/satDigest.controller';
import EmptyData from '../errors/EmptyData/EmptyData';
import FillingValidImage from '../ui/Images/FillingValidImage';
import { ELanguage, TSearchParams } from '@/models/ui.model';
import { getDateInISO } from '@/libs/utils/dates';
import {
  validSearchParam,
  validSearchParamArray,
} from '@/libs/utils/validSearchParam';
import { EUrlSearchParam } from '@/models/url.model';

interface ISatNewsListProps {
  searchParams: TSearchParams;
  lang: ELanguage;
}

const SatNewsList = async ({ searchParams, lang }: ISatNewsListProps) => {
  const sats = validSearchParamArray(EUrlSearchParam.SAT, searchParams);
  const interval = validSearchParam(EUrlSearchParam.INTERVAL, searchParams);
  const newsIntervalResult = await getSatDigestNews({
    satellites: sats,
    timeInterval: Number(interval),
  });

  if (newsIntervalResult instanceof Error)
    return <EmptyData lang={lang} description={newsIntervalResult.message} />;

  const newsArray = setGroupedNewsBySatMap(newsIntervalResult);

  return newsArray.map((news) => {
    const { satLogo } = META_TRANS_NEWS_LIST.images;

    return (
      <div className={styles.newsBlock} key={news[0]}>
        <h2 className={styles.groupTitle}>
          <FillingValidImage
            image={{
              ...satLogo,
              src: `${satLogo.path}${news[1].get([...news[1].keys()][0])?.[0].satLogo}`,
            }}
            defaultImage={satLogo.defaultImg}
            alternativeImgString={satLogo.alternativeStr}
            alt={`${satLogo.alt[lang]}${news[0]}`}
          />
          <div>
            {META_TRANS_NEWS_LIST.h2start[lang]}
            <span className={styles.groupTitleDate}>{news[0]}</span>
          </div>
        </h2>
        {[...news[1]].map((satNews) => (
          <>
            <h3 className={styles.groupSubTitle} key={satNews[0]}>
              {`${getDateInISO(satNews[0])} ....`}
            </h3>
            <div className={styles.newsList}>
              <DangerHtml text={getDailyNews(satNews[1])} wrapperTagName="ul" />
            </div>
          </>
        ))}
      </div>
    );
  });
};
export default SatNewsList;
