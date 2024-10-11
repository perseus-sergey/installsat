import { ELanguage } from '@/models/ui.model';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import AdBannerWrapper from '../GoogleAdsense/AdBannerWrapper';
import Image from 'next/image';
import Link from 'next/link';

import onePlusTwoLogoImg from 'public/Images/1plus2-logo_w180.png';

const WidgetLastNews = dynamic(
  () => import('@/components/WidgetLastNews/WidgetLastNews')
);
const AdBanner = dynamic(() => import('@/components/GoogleAdsense/AdBanner'), {
  ssr: false,
});

const adsenseId = process.env.G_ADSENSE_ID || '';

const RightAside = ({ lang }: { lang: ELanguage }) => {
  const onePlusTwoAriaLabel =
    lang === ELanguage.UA
      ? `Перейти на сайт "1plus2" - навчання в розважальній формі`
      : `Go to the "1plus2" website - learning in an entertaining way`;

  return (
    <aside className="hidden w-64 lg:flex flex-col justify-start items-center gap-4">
      <Suspense>
        <WidgetLastNews lang={lang} />
      </Suspense>

      <div className="flex flex-col items-center justify-center gap-2">
        <h3 className="text-slate-100 font-bold text-xl border-b border-b-slate-50">
          {lang === ELanguage.UA ? 'Наші Партнери' : 'Our Partners'}
        </h3>

        <Link
          href="https://www.1plus2.fun/en"
          target="_blank"
          rel="noopener noreferrer"
          title={onePlusTwoAriaLabel}
          aria-label={onePlusTwoAriaLabel}
          className="py-2"
        >
          <Image
            src={onePlusTwoLogoImg}
            alt={
              lang === ELanguage.UA
                ? `Логотип сайту "1plus2".fun з грайливими числами та навчальними символами.`
                : `Logo of "1plus2".fun website with playful numbers and educational symbols.`
            }
          />
        </Link>
      </div>

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
