import '../globals.scss';
import GoogleAdsense from '@/components/GoogleAdsense/GoogleAdsense';
import Header from '@/components/Header/Header';
import { getELangKey } from '@/libs/utils/validSearchParam';
import { ELanguage } from '@/models/ui.model';
import { EUrlBaseParam } from '@/models/url.model';
import dynamic from 'next/dynamic';

import { Suspense } from 'react';

const AdBlockingRecovery = dynamic(
  () => import('@/components/GoogleAdsense/AdBlockingRecovery')
);

const GoogleTagManager = dynamic(
  () =>
    import('@next/third-parties/google').then((mod) => mod.GoogleTagManager),
  {
    ssr: false, // Оскільки GTM має виконуватись тільки на клієнті
  }
);

const Footer = dynamic(() => import('@/components/Footer/Footer'));

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
      <body
        suppressHydrationWarning={true}
        className="font-serif text-stone-800 bg-black overflow-x-hidden sm:bg-[url('/Images/black00001.gif')]"
      >
        <Header lang={lang} />

        {children}
        <Footer lang={lang} />
      </body>
      {isProductionMode && (
        <Suspense>
          <GoogleTagManager gtmId={GOOGLE_GTM_ID} />
        </Suspense>
      )}
      <Suspense>
        <GoogleAdsense pId={adsenseId} />
      </Suspense>
      <Suspense>
        <AdBlockingRecovery pId={adsenseId} />
      </Suspense>
    </html>
  );
}

// {children}
// {/* <ToastProvider>{children}</ToastProvider> */}
// <Footer lang={lang} />

// <span id="ezoic-privacy-policy-embed"></span>
// <GoogleAnalytics gaId={gaId} />
