import dynamic from 'next/dynamic';
import { Suspense } from 'react';

import { ELanguage } from '@/models/language.model';
import AdBannerWrapper from '../GoogleAdsense/AdBannerWrapper';
import SitePartners from './SitePartners';

const WidgetLastNews = dynamic(
  () => import('@/components/WidgetLastNews/WidgetLastNews')
);
const AdBanner = dynamic(() => import('@/components/GoogleAdsense/AdBanner'), {
  ssr: false,
});

const adsenseId = process.env.G_ADSENSE_ID || '';

const RightAside = ({ lang }: { lang: ELanguage }) => {
  return (
    <aside className="hidden w-64 lg:flex flex-col justify-start items-center gap-4">
      <Suspense>
        <WidgetLastNews lang={lang} />
      </Suspense>

      <SitePartners lang={lang} />

      <AdBannerWrapper
        lang={lang}
        className="w-full p-px flex justify-center items-center"
      >
        <AdBanner
          adsenseId={adsenseId}
          className="hidden lg:block w-full h-full text-center"
          dataAttrs={{
            'data-ad-slot': '2599017354',
            'data-full-width-responsive': 'true',
            'data-ad-format': 'auto',
          }}
        />
      </AdBannerWrapper>
    </aside>
  );
};

export default RightAside;
