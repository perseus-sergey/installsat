import type { Metadata } from 'next';
import { META_TRANS_NEWS_LIST } from '@/models/meta.model';
import React from 'react';
import SideBar from '@/components/SideBar/SideBar';
import { SITE_BASE_URL } from '@/models/url.model';
import BreadCrumbs from '@/components/BreadCrumbs/BreadCrumbs';

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
    <main className="main flex min-h-screen flex-col items-center justify-between p-24">
      <SideBar />
      <BreadCrumbs />
      <article className="article">{children}</article>
    </main>
  );
}
