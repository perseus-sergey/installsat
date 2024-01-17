import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.scss';
import Image from 'next/image';
import BreadCrumbs from '@/components/BreadCrumbs/BreadCrumbs';
import Footer from '@/components/Footer/Footer';
// import { executeQuery } from '@/libs/db/mysqldb';
// import { IChannel } from '@/models/channel.model';
import { SITE_BASE_URL } from '@/models/main.model';
import { META_TRANS_NEWS_SINGLE } from '@/models/meta.model';

const inter = Inter({ subsets: ['latin'] });

// const res = await executeQuery<IChannel>(
//   'SELECT * FROM `tbl_digest` WHERE `date`="2022-01-05"',
//   []
// );

// const res = await executeQuery<IChannel>(
//   'SELECT * FROM `tbl_channals` LIMIT 1',
//   []
// );

export const metadata: Metadata = {
  metadataBase: new URL(SITE_BASE_URL),
  title: META_TRANS_NEWS_SINGLE.getTitle('2022-01-05'),
  description: META_TRANS_NEWS_SINGLE.getDescription('2022-01-05'),
  keywords: META_TRANS_NEWS_SINGLE.getKeywords('2022-01-05'),
  alternates: {
    canonical: '/',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
          <Image
            className="relative dark:drop-shadow-[0_0_0.3rem_#ffffff70] dark:invert"
            src="/next.svg"
            alt="Next.js Logo"
            width={180}
            height={37}
            priority
          />
          <BreadCrumbs homeElement={'Home'} isCapitalizeLinks />

          {children}
          {/* <p>{res[0].title}</p> */}
          <Footer />
        </main>
      </body>
    </html>
  );
}
