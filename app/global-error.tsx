'use client';

import Footer from '@/components/Footer/Footer';
import Header from '@/components/Header/Header';
import ErrorPage from '@/components/errors/ErrorPage/ErrorPage';
import { ELanguage } from '@/models/ui.model';

export default ({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) => (
  <html lang="en">
    <body suppressHydrationWarning={true}>
      <input type="checkbox" id="toggle-sidebar" hidden />
      <Header lang={ELanguage.EN} />
      <main className="article">
        <ErrorPage error={error} resetFn={reset} />
      </main>
      <Footer lang={ELanguage.EN} />
    </body>
  </html>
);
