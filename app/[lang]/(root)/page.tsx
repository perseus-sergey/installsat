import { Suspense } from 'react';

import ArticleWrapper from '@/components/article/ArticleWrapper';
import FormDigestInterval from '@/components/FormDigestInterval/FormDigestInterval';
import SatNews from '@/components/SatNews/SatNews';
import { Title } from '@/components/ui/Titles/Title';
import { getELangKey } from '@/libs/utils/getLanguage';
import {
  LAST_NEWS_INTERVAL,
  META_TRANS_NEWS_LIST,
} from '@/models/satDigest.model';
import { EUrlBaseParam } from '@/models/url/url.model';
import { EUrlSearchParam, TSearchParams } from '@/models/url/urlSearch.model';
import ArticleKeenCarousel from '@/components/ArticleKeenCarousel';

interface IProps {
  searchParams: TSearchParams;
  params: { [key in EUrlBaseParam]: string };
}

export const revalidate = 21600; // 3600 * 6 invalidate cache every 6 hours

export const dynamicParams = false;

export default async ({ searchParams, params }: IProps) => {
  const lang = getELangKey(params[EUrlBaseParam.LANG]);

  const searchInterval = searchParams[EUrlSearchParam.INTERVAL];
  const intervalDays =
    typeof searchInterval === 'string' && searchInterval
      ? +searchInterval
      : LAST_NEWS_INTERVAL;

  return (
    <>
      <ArticleWrapper lang={lang}>
        <div className="h-[200px] sm:h-[400px]">
          <Suspense>
            <ArticleKeenCarousel lang={lang} sleepTime={5000} />
          </Suspense>
        </div>

        <Title>{META_TRANS_NEWS_LIST.getH1(intervalDays)[lang]}</Title>

        <nav>
          <Suspense>
            <FormDigestInterval lang={lang} />
          </Suspense>
        </nav>

        <Suspense>
          <SatNews searchParams={searchParams} lang={lang} />
        </Suspense>
      </ArticleWrapper>
    </>
  );
};
