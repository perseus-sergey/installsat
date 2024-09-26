import FormDigestInterval from '@/components/FormDigestInterval/FormDigestInterval';
import SatNews from '@/components/SatNews/SatNews';
import { Title } from '@/components/ui/Titles/Title';
import { ELanguage } from '@/cron/libs/commons.mjs';
import { getELangKey } from '@/libs/utils/validSearchParam';
import {
  LAST_NEWS_INTERVAL,
  META_TRANS_NEWS_LIST,
} from '@/models/satDigest.model';
import { TSearchParams } from '@/models/ui.model';
import { EUrlBaseParam, EUrlSearchParam } from '@/models/url.model';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const AdBanner = dynamic(() => import('@/components/GoogleAdsense/AdBanner'), {
  ssr: false,
});

interface IProps {
  searchParams: TSearchParams;
  params: { [key in EUrlBaseParam]: string };
}

const adsenseId = process.env.G_ADSENSE_ID || '';

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
        <div
          className="h-28 w-full flex justify-center items-center"
          role="complementary"
          aria-label={lang === ELanguage.UA ? 'Реклама' : 'Advertising'}
        >
          <Suspense>
            <AdBanner adsId={adsenseId} />
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
      </article>
    </>
  );
}
