import { ELanguage } from '@/models/ui.model';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import AdBannerWrapper from '../GoogleAdsense/AdBannerWrapper';

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

      <AdBannerWrapper
        lang={lang}
        className="w-full p-px flex justify-center items-center border border-stone-400"
      >
        <AdBanner
          adsenseId={adsenseId}
          className="w-full h-full text-center"
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
