import '../globals.scss';
import AdBlockingRecovery from '@/components/GoogleAdsense/AdBlockingRecovery';
import GoogleAdsense from '@/components/GoogleAdsense/GoogleAdsense';
import Header from '@/components/Header/Header';
import { getELangKey } from '@/libs/utils/validSearchParam';
import { ELanguage } from '@/models/ui.model';
import { EUrlBaseParam } from '@/models/url.model';
import dynamic from 'next/dynamic';

const Footer = dynamic(() => import('@/components/Footer/Footer'));
import { GoogleTagManager } from '@next/third-parties/google';
import { Suspense } from 'react';
import AdBannerArticleAbove from '@/components/GoogleAdsense/AdBannerArticleAbove';

const GOOGLE_GTM_ID = process.env.GOOGLE_GTM || '';
const adsenseId = process.env.G_ADSENSE_ID || '';
const isProductionMode = process.env.NODE_ENV === 'production';

export async function generateStaticParams() {
  return Object.values(ELanguage).map((l) => ({ [EUrlBaseParam.LANG]: l }));
}

export const dynamicParams = false;

export default function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { [key in EUrlBaseParam]: string };
}) {
  const lang = getELangKey(params[EUrlBaseParam.LANG]);

  return (
    <html lang={lang === ELanguage.UA ? 'uk' : 'en'} className="!scroll-smooth">
      {isProductionMode && <GoogleTagManager gtmId={GOOGLE_GTM_ID} />}
      <body
        suppressHydrationWarning={true}
        className="font-serif text-stone-800 bg-black overflow-x-hidden sm:bg-[url('/Images/black00001.gif')]"
      >
        <Header lang={lang} />

        <section
          className="min-h-80 sm:min-h-72 w-full"
          role="complementary"
          aria-label={lang === ELanguage.UA ? 'Реклама' : 'Advertising'}
        >
          <Suspense>
            <AdBannerArticleAbove adsenseId={adsenseId} />
          </Suspense>
        </section>

        {children}
        <Footer lang={lang} />
      </body>
      <GoogleAdsense pId={adsenseId} />
      <AdBlockingRecovery pId={adsenseId} />
    </html>
  );
}

// {children}
// {/* <ToastProvider>{children}</ToastProvider> */}
// <Footer lang={lang} />

// <span id="ezoic-privacy-policy-embed"></span>
// <GoogleAnalytics gaId={gaId} />
