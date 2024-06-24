import '../globals.scss';
import Footer from '@/components/Footer/Footer';
import Header from '@/components/Header/Header';
import ToastProvider from '@/libs/ToastProvider/ToastProvider';
import { isValidLanguage } from '@/libs/utils/validSearchParam';
import { EUrlBaseParam } from '@/models/url.model';
import { GoogleAnalytics } from '@next/third-parties/google';
import { notFound } from 'next/navigation';

export default function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { [key in EUrlBaseParam]: string };
}) {
  if (!isValidLanguage(params[EUrlBaseParam.LANG])) notFound();

  return (
    <html lang={params[EUrlBaseParam.LANG]}>
      <body suppressHydrationWarning={true}>
        <input type="checkbox" id="toggle-sidebar" hidden />
        <Header />
        <ToastProvider>{children}</ToastProvider>
        <Footer />
      </body>
      <GoogleAnalytics gaId="G-60MX085VHN" />
    </html>
  );
}
