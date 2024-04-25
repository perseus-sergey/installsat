import '../globals.scss';
import Footer from '@/components/Footer/Footer';
import Header from '@/components/Header/Header';
import ToastProvider from '@/libs/ToastProvider/ToastProvider';

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
        <ToastProvider>{children}</ToastProvider>
        <Footer />
      </body>
    </html>
  );
}
