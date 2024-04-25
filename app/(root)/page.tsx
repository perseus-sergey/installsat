import FormDigestInterval from '@/components/FormDigestInterval/FormDigestInterval';
import SatNews from '@/components/SatNews/SatNews';
import { Title } from '@/components/ui/Title/Title';
import {
  LAST_NEWS_INTERVAL,
  META_TRANS_NEWS_LIST,
} from '@/models/satDigest.model';
import { LANGUAGE, TSearchParams } from '@/models/ui.model';
import { EUrlSearchParam } from '@/models/url.model';
import { Suspense } from 'react';
import { Metadata } from 'next';
import { DEFAULT_META_DATA } from '@/models/ui.model';
import { getFormattedDateStr } from '@/libs/utils/utils';

const BASE_URL = process.env.BASE_URL || '';

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: META_TRANS_NEWS_LIST.getTitle()[LANGUAGE],
  description: META_TRANS_NEWS_LIST.getDescription()[LANGUAGE],
  keywords: META_TRANS_NEWS_LIST.getKeywords()[LANGUAGE],
  openGraph: {
    ...DEFAULT_META_DATA.openGraph,
    title: META_TRANS_NEWS_LIST.getTitle()[LANGUAGE],
    description: META_TRANS_NEWS_LIST.getDescription()[LANGUAGE],
    url: BASE_URL,
    publishedTime: getFormattedDateStr(new Date()),
  },
};

interface IProps {
  searchParams: TSearchParams;
}

export default function Page({ searchParams }: IProps) {
  const searchInterval = searchParams[EUrlSearchParam.INTERVAL];
  const intervalDays =
    typeof searchInterval === 'string' && searchInterval
      ? +searchInterval
      : LAST_NEWS_INTERVAL;

  return (
    <>
      <article className="article">
        <Title>{META_TRANS_NEWS_LIST.getH1(intervalDays)[LANGUAGE]}</Title>
        <nav>
          <Suspense>
            <FormDigestInterval searchParams={searchParams} />
          </Suspense>
        </nav>
        <Suspense>
          <SatNews searchParams={searchParams} />
        </Suspense>
      </article>
    </>
  );
}
