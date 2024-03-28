import type { Metadata } from 'next';
import React from 'react';
import SideBar from '@/components/SideBar/SideBar';
import { SITE_BASE_URL } from '@/models/url.model';
import { META_TRANS_NEWS_LIST } from '@/models/satDigest.model';
import { defaultMetaData } from '@/models/ui.model';
import { getFormattedDateStr } from '@/libs/utils';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_BASE_URL),
  title: META_TRANS_NEWS_LIST.getTitle(),
  description: META_TRANS_NEWS_LIST.getDescription(),
  keywords: META_TRANS_NEWS_LIST.getKeywords(),
  openGraph: {
    ...defaultMetaData.openGraph,
    title: META_TRANS_NEWS_LIST.getTitle(),
    description: META_TRANS_NEWS_LIST.getDescription(),
    url: SITE_BASE_URL,
    publishedTime: getFormattedDateStr(new Date()),
  },
  // alternates: {
  //   canonical: EUrlBaseParam.BASE_PATH,
  // },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="main">
      <SideBar />
      <section className="articleWrapper">{children}</section>
    </main>
  );
}
