// import FormDigestInterval from '@/components/FormDigestInterval1/FormDigestInterval';
// import SatNews from '@/components/SatNews/SatNews';
// import { Title } from '@/components/Titles/Title';
// import {
//   LAST_NEWS_INTERVAL,
//   META_TRANS_NEWS_LIST,
// } from '@/models/satDigest.model';
// import { EUrlSearchParam } from '@/models/url.model';
// import { Suspense } from 'react';

import { Title } from '@/components/ui/Titles/Title';
import { EUrlBaseParam } from '@/models/url.model';
import { Metadata } from 'next';
import { DEFAULT_META_DATA } from '@/models/ui.model';
import { getFormattedDateStrYearFirst } from '@/libs/utils/dates';

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
    publishedTime: getFormattedDateStrYearFirst(),
  },
};
interface IProps {
  params: { cat_parent: string; cat: string; product: string };
}

export default function Page({ params: { product } }: IProps) {
  //   const searchInterval = searchParams[EUrlSearchParam.INTERVAL];
  //   const intervalDays =
  //     typeof searchInterval === 'string' && searchInterval
  //       ? +searchInterval
  //       : LAST_NEWS_INTERVAL;

  return (
    <>
      <article className="article">
        <Title>{product}</Title>
      </article>
    </>
  );
}
