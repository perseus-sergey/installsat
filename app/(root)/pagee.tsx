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
