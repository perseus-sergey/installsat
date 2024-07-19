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
import { TitleH2Digest } from '../ui/Titles/TitleH2Digest';
import { TitleH3Digest } from '../ui/Titles/TitleH3Digest';

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
    lang,
  });

  if (newsIntervalResult instanceof Error)
    return <EmptyData lang={lang} description={newsIntervalResult.message} />;

  const newsArray = setGroupedNewsBySatMap(newsIntervalResult);

  return newsArray.map((news) => {
    const { satLogo } = META_TRANS_NEWS_LIST.images;

    return (
      <div key={news[0]}>
        <TitleH2Digest>
          <FillingValidImage
            image={{
              ...satLogo,
              src: `${satLogo.path}${news[1].get([...news[1].keys()][0])?.[0].satLogo}`,
            }}
            defaultImage={satLogo.defaultImg}
            alternativeImgString={satLogo.alternativeStr}
            alt={`${satLogo.alt[lang]}${news[0]}`}
          />
          <div className="flex flex-wrap gap-2 justify-center">
            {META_TRANS_NEWS_LIST.h2start[lang]}
            <span className="text-rose-500">{news[0]}</span>
          </div>
        </TitleH2Digest>
        {[...news[1]].map((satNews) => (
          <>
            <TitleH3Digest key={satNews[0]}>
              {`${getDateInISO(satNews[0])} ....`}
            </TitleH3Digest>
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
