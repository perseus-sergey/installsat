import styles from '../SatNewsList/SatNewsList.module.scss';
import React from 'react';
import DangerHtml from '../ui/DangerHtml/DangerHtml';
import {
  getDailyNews,
  setGroupedNewsByDateMap,
} from '@/controllers/satDigest.controller';
import EmptyData from '../errors/EmptyData/EmptyData';
import {
  EUrlBaseParam,
  EUrlSearchParam,
  MAIN_URL,
  URL_SEARCH_PARAM_VALUE_FALSE,
} from '@/models/url.model';
import { META_TRANS_NEWS_SINGLE } from '@/models/satDigest.model';
import { ELanguage } from '@/models/ui.model';
import { getDateInISO } from '@/libs/utils/dates';
import { decode } from 'html-entities';
import { TitleH2Digest } from '../ui/Titles/TitleH2Digest';
import { TitleH3Digest } from '../ui/Titles/TitleH3Digest';
import { createURLWithParams } from '@/libs/utils/utils';
import SeoLink from '../ui/SeoLink/SeoLink';

const BASE_URL = process.env.BASE_URL || MAIN_URL;

const DateNewsList = async ({ lang }: { lang: ELanguage }) => {
  const newsArray = await setGroupedNewsByDateMap(lang);

  if (newsArray instanceof Error) return <EmptyData lang={lang} />;

  return newsArray.map((news) => {
    return (
      <div key={news[0]}>
        <TitleH2Digest className="text-center justify-center">
          {META_TRANS_NEWS_SINGLE.metaH1start[lang]}
          <DateLink
            lang={lang}
            dateStr={news[0]}
            className="text-rose-500 underline"
          />
        </TitleH2Digest>
        {[...news[1]].map((satNews) => {
          const satTitle = decode(`${satNews[0]} ${satNews[1][0].satPosition}`);

          return (
            <React.Fragment key={satNews[0]}>
              <TitleH3Digest>
                <SatLink
                  className="underline"
                  lang={lang}
                  satTitle={satTitle}
                  satSlug={satNews[1][0].sat_slug}
                />
              </TitleH3Digest>
              <div className={`${styles.newsList} sm:text-xl`}>
                <DangerHtml
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

interface DateLinkProps extends React.HTMLAttributes<HTMLElement> {
  lang: ELanguage;
  dateStr: string;
}

export const DateLink = ({
  lang,
  dateStr,
  className,
  ...attributes
}: DateLinkProps) => {
  const dateInISO =
    getDateInISO(dateStr) || new Date(dateStr).toLocaleDateString('en-CA');

  return (
    <SeoLink
      title={`${lang === ELanguage.UA ? 'Дивитись всі тпранспондерні новини за ' : 'See all transponder news for '} ${dateInISO}`}
      href={`/${lang}/${EUrlBaseParam.TRANSPONDER_NEWS}/${dateInISO}`}
      className={className}
      {...attributes}
    >
      <time dateTime={dateInISO}> {dateInISO}</time>
    </SeoLink>
  );
};

interface SatLinkProps extends React.HTMLAttributes<HTMLElement> {
  lang: ELanguage;
  satSlug: string | null;
  satTitle: string;
}

export const SatLink = ({
  lang,
  satSlug,
  satTitle,
  className,
  ...attributes
}: SatLinkProps) => {
  const satelliteHref = createURLWithParams(
    `${BASE_URL}/${lang}/${EUrlBaseParam.SAT_CHANNEL_LIST}${satSlug ? `/${satSlug}` : ''}`,
    {
      [EUrlSearchParam.CHANNEL_NOT_ENCRYPTED]: URL_SEARCH_PARAM_VALUE_FALSE,
    }
  ).href;

  return (
    <SeoLink
      title={`${lang === ELanguage.UA ? 'Дивитись всі канали з супутника ' : 'See list of all channels from satellite '} ${satTitle}`}
      href={satelliteHref}
      className={className}
      {...attributes}
    >
      {satTitle}
    </SeoLink>
  );
};

export default DateNewsList;
