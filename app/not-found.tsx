import Footer from '@/components/Footer/Footer';
import Header from '@/components/Header/Header';
import NotFoundPage from '@/components/errors/NotFoundPage/NotFoundPage';
import { ELanguage } from '@/models/language.model';

export default function NotFound() {
  return (
    <html lang={ELanguage.EN}>
      <body suppressHydrationWarning={true} className="bg-slate-950">
        <Header lang={ELanguage.EN} />
        <main className="article">
          <NotFoundPage />
        </main>
        <Footer lang={ELanguage.EN} />
      </body>
    </html>
  );
}
