import type { Metadata } from 'next';
import React from 'react';
import SideBar from '@/components/SideBar/SideBar';
import { EUrlBaseParam, SITE_BASE_URL } from '@/models/url.model';
import { META_TRANS_NEWS_LIST } from '@/models/satDigest.model';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_BASE_URL),
  title: META_TRANS_NEWS_LIST.getTitle(),
  description: META_TRANS_NEWS_LIST.getDescription(),
  keywords: META_TRANS_NEWS_LIST.getKeywords(),
  alternates: {
    canonical: EUrlBaseParam.BASE_PATH,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="main">
      <SideBar />
      <article className="article">{children}</article>
    </main>
  );
}
