// import FormDigestInterval from '@/components/FormDigestInterval1/FormDigestInterval';
// import SatNews from '@/components/SatNews/SatNews';
// import { Title } from '@/components/Title/Title';
// import {
//   LAST_NEWS_INTERVAL,
//   META_TRANS_NEWS_LIST,
// } from '@/models/satDigest.model';
// import { EUrlSearchParam } from '@/models/url.model';
// import { Suspense } from 'react';

import { Title } from '@/components/Title/Title';

interface IProps {
  params: { slug: string };
}

export default function Page({ params: { slug } }: IProps) {
  //   const searchInterval = searchParams[EUrlSearchParam.INTERVAL];
  //   const intervalDays =
  //     typeof searchInterval === 'string' && searchInterval
  //       ? +searchInterval
  //       : LAST_NEWS_INTERVAL;

  return (
    <>
      <article className="article">
        <Title>
          Канал {`"`}
          {slug}
          {`"`} у прямому ефірі онлайн
        </Title>
      </article>
    </>
  );
}
