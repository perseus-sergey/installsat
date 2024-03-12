import './globals.scss';
import Footer from '@/components/Footer/Footer';
import Header from '@/components/Header/Header';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <input type="checkbox" id="toggle-sidebar" hidden />
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
