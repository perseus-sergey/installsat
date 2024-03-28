import FormDigestInterval from '@/components/FormDigestInterval1/FormDigestInterval';
import SatNews from '@/components/SatNews/SatNews';
import { Title } from '@/components/Title/Title';
import {
  LAST_NEWS_INTERVAL,
  META_TRANS_NEWS_LIST,
} from '@/models/satDigest.model';
import { EUrlSearchParam } from '@/models/url.model';
import { Suspense } from 'react';

interface IProps {
  searchParams: { [key: string]: string | string[] | undefined };
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
        <Title>{META_TRANS_NEWS_LIST.getH1(intervalDays)}</Title>
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
