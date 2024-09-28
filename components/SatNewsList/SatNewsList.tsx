import styles from './SatNewsList.module.scss';
import DangerHtml from '../ui/DangerHtml/DangerHtml';
import {
  META_TRANS_NEWS_LIST,
  TRANS_NEWS_LIST_IMAGES,
} from '@/models/satDigest.model';
import {
  getDailyNews,
  getSatDigestNews,
  setGroupedNewsBySatMap,
} from '@/controllers/satDigest.controller';
import EmptyData from '../errors/EmptyData/EmptyData';
import FillingValidImage from '../ui/Images/FillingValidImage';
import { ELanguage, TSearchParams } from '@/models/ui.model';
import {
  validSearchParam,
  validSearchParamArray,
} from '@/libs/utils/validSearchParam';
import { EUrlSearchParam } from '@/models/url.model';
import { TitleH2Digest } from '../ui/Titles/TitleH2Digest';
import { TitleH3Digest } from '../ui/Titles/TitleH3Digest';
import { DateLink, SatLink } from '../DateNewsList/DateNewsList';
import GoUpLink from '../ui/GoUpLink/GoUpLink';

interface ISatNewsListProps {
  searchParams: TSearchParams;
  lang: ELanguage;
}

const SatNewsList = async ({ searchParams, lang }: ISatNewsListProps) => {
  const sats = validSearchParamArray(EUrlSearchParam.SAT, searchParams);
  const interval = validSearchParam(EUrlSearchParam.INTERVAL, searchParams);
  const newsIntervalResult = await getSatDigestNews({
    satellites: sats,
    interval: Number(interval),
    lang,
  });

  if (newsIntervalResult instanceof Error) return <EmptyData lang={lang} />;

  const newsArray = setGroupedNewsBySatMap(newsIntervalResult);

  return newsArray.map((news) => {
    const { satLogo } = TRANS_NEWS_LIST_IMAGES;
    const satSlug = news[1].get([...news[1].keys()][0])?.[0].sat_slug || '';

    return (
      <div key={news[0]}>
        <TitleH2Digest className="!justify-between">
          <FillingValidImage
            image={{
              ...satLogo,
              src: `${satLogo.path}${news[1].get([...news[1].keys()][0])?.[0].satLogo}`,
            }}
            defaultImage={satLogo.defaultImg}
            alt={`${satLogo.alt[lang]}${news[0]}`}
          />

          <div className="flex flex-wrap gap-2">
            {META_TRANS_NEWS_LIST.h2start[lang]}
            <SatLink
              className="text-rose-500 underline"
              lang={lang}
              satTitle={news[0]}
              satSlug={satSlug}
            />
          </div>

          <GoUpLink lang={lang} />
        </TitleH2Digest>
        {[...news[1]].map((satNews) => {
          return (
            <>
              <TitleH3Digest key={satNews[0]}>
                <DateLink
                  lang={lang}
                  dateStr={satNews[0]}
                  className="underline"
                />{' '}
                ....
              </TitleH3Digest>
              <div className={`${styles.newsList} sm:text-xl`}>
                <DangerHtml
                  text={getDailyNews(satNews[1])}
                  wrapperTagName="ul"
                />
              </div>
            </>
          );
        })}
      </div>
    );
  });
};
export default SatNewsList;
