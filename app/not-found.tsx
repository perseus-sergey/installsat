import Footer from '@/components/Footer/Footer';
import Header from '@/components/Header/Header';
import NotFoundPage from '@/components/errors/NotFoundPage/NotFoundPage';
import { ELanguage } from '@/models/ui.model';

export default function NotFound() {
  return (
    <html lang={ELanguage.EN}>
      <body suppressHydrationWarning={true}>
        <Header lang={ELanguage.EN} />
        <main className="article">
          <NotFoundPage />
        </main>
        <Footer lang={ELanguage.EN} />
      </body>
    </html>
  );
}
