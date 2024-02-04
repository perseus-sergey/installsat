import type { Metadata } from 'next';
import './globals.scss';
import Image from 'next/image';
import BreadCrumbs from '@/components/BreadCrumbs/BreadCrumbs';
import Footer from '@/components/Footer/Footer';
import { SITE_BASE_URL } from '@/models/main.model';
import { META_TRANS_NEWS_LIST } from '@/models/meta.model';
import React from 'react';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_BASE_URL),
  title: META_TRANS_NEWS_LIST.getTitle(),
  description: META_TRANS_NEWS_LIST.getDescription(),
  keywords: META_TRANS_NEWS_LIST.getKeywords(),
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
      <body suppressHydrationWarning={true}>
        <main className="main flex min-h-screen flex-col items-center justify-between p-24">
          <Image
            className=""
            src="/images/InstallsatOrigBlue_200.png"
            alt="Installsat TV Logo"
            width={200}
            height={85}
            priority
          />
          <BreadCrumbs homeElement={'Home'} isCapitalizeLinks />

          {children}

          <Footer />
        </main>
      </body>
    </html>
  );
}
