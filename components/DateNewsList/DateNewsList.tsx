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
import { TitleH2Digest } from '../ui/Titles/TitleH2Digest';
import { TitleH3Digest } from '../ui/Titles/TitleH3Digest';

const DateNewsList = async ({ lang }: { lang: ELanguage }) => {
  const newsArray = await setGroupedNewsByDateMap();

  if (newsArray instanceof Error)
    return <EmptyData lang={lang} description={newsArray.message} />;

  return newsArray.map((news) => {
    const dateInISO = getDateInISO(news[0]);

    return (
      <div key={news[0]}>
        <TitleH2Digest className="text-center justify-center">
          <Link
            href={`/${lang}/${EUrlBaseParam.TRANSPONDER_NEWS}/${dateInISO}`}
          >
            {META_TRANS_NEWS_SINGLE.metaH1start[lang]}
            <span className="text-rose-500"> {dateInISO}</span>
          </Link>
        </TitleH2Digest>
        {[...news[1]].map((satNews) => {
          return (
            <React.Fragment key={satNews[0]}>
              <TitleH3Digest>
                {decode(`${satNews[0]} ${satNews[1][0].satPosition}`)}
              </TitleH3Digest>
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
