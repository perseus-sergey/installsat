'use client';

// import { GoogleTagManager } from '@next/third-parties/google';

import dynamic from 'next/dynamic';

const AdBlockingRecovery = dynamic(
  () => import('@/components/GoogleAdsense/AdBlockingRecovery'),
  {
    ssr: false,
  }
);

const GoogleTagManager = dynamic(
  () =>
    import('@next/third-parties/google').then((mod) => mod.GoogleTagManager),
  {
    ssr: false,
  }
);
// const GoogleTagManager = (await import('@next/third-parties/google'))
//   .GoogleTagManager;

const GoogleAdsense = dynamic(
  () => import('@/components/GoogleAdsense/GoogleAdsense'),
  {
    ssr: false,
  }
);

const GoogleComponents = ({
  GOOGLE_GTM_ID,
  adsenseId,
}: {
  GOOGLE_GTM_ID: string;
  adsenseId: string;
}) => {
  if (process.env.NODE_ENV !== 'production') {
    return null;
  }

  return (
    <>
      <GoogleTagManager gtmId={GOOGLE_GTM_ID} />
      <GoogleAdsense pId={adsenseId} />
      <AdBlockingRecovery pId={adsenseId} />
    </>
  );
};

export default GoogleComponents;
