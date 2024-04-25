// import FormDigestInterval from '@/components/FormDigestInterval1/FormDigestInterval';
// import SatNews from '@/components/SatNews/SatNews';
// import { Title } from '@/components/Title/Title';
// import {
//   LAST_NEWS_INTERVAL,
//   META_TRANS_NEWS_LIST,
// } from '@/models/satDigest.model';
// import { EUrlSearchParam } from '@/models/url.model';
// import { Suspense } from 'react';

import { Title } from '@/components/ui/Title/Title';
import { getFormattedDateStr } from '@/libs/utils/utils';
import { DEFAULT_META_DATA } from '@/models/ui.model';
import { EUrlBaseParam } from '@/models/url.model';
import { Metadata } from 'next';

const BASE_URL = process.env.BASE_URL || '';

// TODO: Change MetaData
// =================================================================
export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: 'maps',
  description: 'maps description',
  keywords: 'maps keywords',
  openGraph: {
    ...DEFAULT_META_DATA.openGraph,
    title: 'maps',
    description: 'maps description',
    url: `${BASE_URL}/${EUrlBaseParam.DELETE_COMMENT_SUBSCRIPTION}`,
    publishedTime: getFormattedDateStr(new Date()),
  },
};
export default function Page() {
  //   const searchInterval = searchParams[EUrlSearchParam.INTERVAL];
  //   const intervalDays =
  //     typeof searchInterval === 'string' && searchInterval
  //       ? +searchInterval
  //       : LAST_NEWS_INTERVAL;

  return (
    <>
      <article className="article">
        <Title>Варіанти встановлення антен</Title>
      </article>
    </>
  );
}
