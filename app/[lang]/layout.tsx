// import GoogleAdsense from '@/components/GoogleAdsense/GoogleAdsense';
import '../globals.scss';
import Header from '@/components/Header/Header';
import { getELangKey } from '@/libs/utils/validSearchParam';
import { ELanguage } from '@/models/ui.model';
import { EUrlBaseParam } from '@/models/url.model';
import dynamic from 'next/dynamic';
// import AdBlockingRecovery from '@/components/GoogleAdsense/AdBlockingRecovery';
// import { Suspense } from 'react';
import GoogleComponents from '@/components/GoogleAdsense/GoogleComponents';
// import { Suspense } from 'react';
// import { GoogleTagManager } from '@next/third-parties/google';
// import GoogleAdsense from '@/components/GoogleAdsense/GoogleAdsense';
// import AdBlockingRecovery from '@/components/GoogleAdsense/AdBlockingRecovery';

// const AdBlockingRecovery = dynamic(
//   () => import('@/components/GoogleAdsense/AdBlockingRecovery'),
//   {
//     ssr: false,
//   }
// );

// const GoogleTagManager = dynamic(
//   () =>
//     import('@next/third-parties/google').then((mod) => mod.GoogleTagManager),
//   {
//     ssr: false,
//   }
// );
// const GoogleTagManager = (await import('@next/third-parties/google'))
//   .GoogleTagManager;

// const GoogleAdsense = dynamic(
//   () => import('@/components/GoogleAdsense/GoogleAdsense'),
//   {
//     ssr: false,
//   }
// );

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
      {/* {isProductionMode && ( */}
      {/* <GoogleTagManager gtmId={GOOGLE_GTM_ID} />
      <GoogleAdsense pId={adsenseId} />
      <AdBlockingRecovery pId={adsenseId} /> */}
      {/* )} */}
      {isProductionMode && (
        <GoogleComponents GOOGLE_GTM_ID={GOOGLE_GTM_ID} adsenseId={adsenseId} />
      )}
    </html>
  );
}

// {children}
// {/* <ToastProvider>{children}</ToastProvider> */}
// <Footer lang={lang} />

// <span id="ezoic-privacy-policy-embed"></span>
// <GoogleAnalytics gaId={gaId} />
