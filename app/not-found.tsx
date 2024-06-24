import Footer from '@/components/Footer/Footer';
import Header from '@/components/Header/Header';
import NotFoundPage from '@/components/errors/NotFoundPage/NotFoundPage';

export default function NotFound() {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <input type="checkbox" id="toggle-sidebar" hidden />
        <Header />
        <main className="article">
          <NotFoundPage />
        </main>
        <Footer />
      </body>
    </html>
  );
}
