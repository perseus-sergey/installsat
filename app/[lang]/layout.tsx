import '../globals.scss';
// import Footer from '@/components/Footer/Footer';
// import AdBlockingRecovery from '@/components/GoogleAdsense/AdBlockingRecovery';
// import GoogleAdsense from '@/components/GoogleAdsense/GoogleAdsense';
import Header from '@/components/Header/Header';
import ToastProvider from '@/libs/ToastProvider/ToastProvider';
import { getELangKey } from '@/libs/utils/validSearchParam';
import { ELanguage } from '@/models/ui.model';
import { EUrlBaseParam } from '@/models/url.model';
import dynamic from 'next/dynamic';

const Footer = dynamic(() => import('@/components/Footer/Footer'));
// import { GoogleTagManager } from '@next/third-parties/google';

// const GOOGLE_GTM_ID = process.env.GOOGLE_GTM || '';
// const gaId = process.env.GA_ID || '';
// const adsenseId = process.env.G_ADSENSE_ID || '';
// const isProductionMode = process.env.NODE_ENV === 'production';

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
      {/* {isProductionMode && <GoogleTagManager gtmId={GOOGLE_GTM_ID} />} */}
      <body
        suppressHydrationWarning={true}
        className="font-serif text-stone-800 bg-black overflow-x-hidden bg-[url('/Images/black00001.gif')]"
      >
        <input type="checkbox" id="toggle-sidebar" hidden />
        <Header lang={lang} />
        {/* {children} */}
        <ToastProvider>{children}</ToastProvider>
        <Footer lang={lang} />
      </body>
    </html>
  );
}
// </body>
// <GoogleAdsense pId={adsenseId} />
// <AdBlockingRecovery pId={adsenseId} />
// </html>

// <span id="ezoic-privacy-policy-embed"></span>
// <GoogleAnalytics gaId={gaId} />
