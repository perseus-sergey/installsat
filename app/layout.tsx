import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.scss';
import Image from 'next/image';
import BreadCrumbs from '@/components/BreadCrumbs/BreadCrumbs';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_BASE_URL),
  title: metaMap.get(EPageTitles.MAIN)?.[EMetaTypes.TITLE][ELang.en],
  description: metaMap.get(EPageTitles.MAIN)?.[EMetaTypes.DESCRIPTION][ELang.en],
  keywords: metaMaps.get(EPageTitles.MAIN)?.[EMetaTypes.KEYWORDS][ELang.en],
  alternates: {
    canonical: '/',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
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
        </main>
      </body>
    </html>
  );
}
