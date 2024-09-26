import FormDigestInterval from '@/components/FormDigestInterval/FormDigestInterval';
import SatNews from '@/components/SatNews/SatNews';
import { Title } from '@/components/ui/Titles/Title';
import { getELangKey } from '@/libs/utils/validSearchParam';
import {
  LAST_NEWS_INTERVAL,
  META_TRANS_NEWS_LIST,
} from '@/models/satDigest.model';
import { TSearchParams } from '@/models/ui.model';
import { EUrlBaseParam, EUrlSearchParam } from '@/models/url.model';
import { Suspense } from 'react';

interface IProps {
  searchParams: TSearchParams;
  params: { [key in EUrlBaseParam]: string };
}

export const revalidate = 21600; // 3600 * 6 invalidate cache every 6 hours

export default async function Page({ searchParams, params }: IProps) {
  const lang = getELangKey(params[EUrlBaseParam.LANG]);

  const searchInterval = searchParams[EUrlSearchParam.INTERVAL];
  const intervalDays =
    typeof searchInterval === 'string' && searchInterval
      ? +searchInterval
      : LAST_NEWS_INTERVAL;

  return (
    <>
      <article className="article">
        <Title>{META_TRANS_NEWS_LIST.getH1(intervalDays)[lang]}</Title>

        <nav>
          <Suspense>
            <FormDigestInterval lang={lang} />
          </Suspense>
        </nav>

        <Suspense>
          <SatNews searchParams={searchParams} lang={lang} />
        </Suspense>
      </article>
    </>
  );
}
