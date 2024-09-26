import '../globals.scss';
// import Footer from '@/components/Footer/Footer';
import AdBlockingRecovery from '@/components/GoogleAdsense/AdBlockingRecovery';
import GoogleAdsense from '@/components/GoogleAdsense/GoogleAdsense';
import Header from '@/components/Header/Header';
// import ToastProvider from '@/libs/ToastProvider/ToastProvider';
import { getELangKey } from '@/libs/utils/validSearchParam';
import { ELanguage } from '@/models/ui.model';
import { EUrlBaseParam } from '@/models/url.model';
import dynamic from 'next/dynamic';

const Footer = dynamic(() => import('@/components/Footer/Footer'));
import { GoogleTagManager } from '@next/third-parties/google';
// import { Suspense } from 'react';
// import AdBanner from '@/components/GoogleAdsense/AdBanner';

const GOOGLE_GTM_ID = process.env.GOOGLE_GTM || '';
// const gaId = process.env.GA_ID || '';
const adsenseId = process.env.G_ADSENSE_ID || '';
const isProductionMode = process.env.NODE_ENV === 'production';

export async function generateStaticParams() {
  return Object.values(ELanguage).map((l) => ({ [EUrlBaseParam.LANG]: l }));
}

const AdBanner = dynamic(() => import('@/components/GoogleAdsense/AdBanner'), {
  ssr: false,
});
// const AdsHeadMediaBanner = dynamic(
//   () => import('@/components/GoogleAdsense/AdsHeadMediaBanner'),
//   {
//     ssr: false,
//   }
// );

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

        <div
          className="h-40 flex justify-center items-center"
          // className="h-40 flex justify-center items-center bg-[url('/Images/google.png')] bg-no-repeat bg-center"
          role="complementary"
          aria-label={lang === ELanguage.UA ? 'Реклама' : 'Advertising'}
        >
          <AdBanner adsId={adsenseId} />
          {/* <Suspense>
            <AdsHeadMediaBanner
              data-ad-client={`ca-pub-${adsenseId}`}
              data-ad-slot="1581071444"
              data-full-width-responsive="true"
              // data-ad-layout="in-article"
              data-ad-format="auto"
            />
          </Suspense> */}
        </div>

        {children}
        {/* <ToastProvider>{children}</ToastProvider> */}
        <Footer lang={lang} />
      </body>
      {/* <script
        async
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-${adsenseId}`}
        crossOrigin="anonymous"
      ></script> */}
      <GoogleAdsense pId={adsenseId} />
      <AdBlockingRecovery pId={adsenseId} />
    </html>
  );
}

// </body>
// <GoogleAdsense pId={adsenseId} />
// <AdBlockingRecovery pId={adsenseId} />
// </html>

// <span id="ezoic-privacy-policy-embed"></span>
// <GoogleAnalytics gaId={gaId} />

{
  /* <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8343784915002692"
     crossorigin="anonymous"></script>
<!-- HeadMediaFixed -->
<ins class="adsbygoogle"
     style="display:inline-block;width:728px;height:90px"
     data-ad-client="ca-pub-8343784915002692"
     data-ad-slot="4614458113"></ins>
<script>
     (adsbygoogle = window.adsbygoogle || []).push({});
</script> */
}
