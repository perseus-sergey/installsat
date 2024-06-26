import '../globals.scss';
import Footer from '@/components/Footer/Footer';
import Header from '@/components/Header/Header';
import ToastProvider from '@/libs/ToastProvider/ToastProvider';
import { getELangKey } from '@/libs/utils/validSearchParam';
import { DEFAULT_LANG, ELanguage } from '@/models/ui.model';
import { EUrlBaseParam } from '@/models/url.model';
import { GoogleAnalytics } from '@next/third-parties/google';

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
    <html lang={lang || DEFAULT_LANG}>
      <body suppressHydrationWarning={true}>
        <input type="checkbox" id="toggle-sidebar" hidden />
        <Header lang={lang} />
        <ToastProvider>{children}</ToastProvider>
        <Footer lang={lang} />
      </body>
      <GoogleAnalytics gaId="G-60MX085VHN" />
    </html>
  );
}
