// import type { Metadata } from 'next';
import React from 'react';
import SideBar from '@/components/SideBar/SideBar';
// import { META_TRANS_NEWS_LIST } from '@/models/satDigest.model';
// import { LANGUAGE, DEFAULT_META_DATA } from '@/models/ui.model';
// import { getFormattedDateStr } from '@/libs/utils/utils';

// const BASE_URL = process.env.BASE_URL;

// export const metadata: Metadata = {
//   metadataBase: new URL(BASE_URL || ''),
//   title: META_TRANS_NEWS_LIST.getTitle()[LANGUAGE],
//   description: META_TRANS_NEWS_LIST.getDescription()[LANGUAGE],
//   keywords: META_TRANS_NEWS_LIST.getKeywords()[LANGUAGE],
//   openGraph: {
//     ...DEFAULT_META_DATA.openGraph,
//     title: META_TRANS_NEWS_LIST.getTitle()[LANGUAGE],
//     description: META_TRANS_NEWS_LIST.getDescription()[LANGUAGE],
//     url: BASE_URL,
//     publishedTime: getFormattedDateStr(new Date()),
//   },
// };
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
