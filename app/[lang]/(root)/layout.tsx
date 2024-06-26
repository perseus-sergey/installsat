import type { Metadata } from 'next';
import React from 'react';
import SideBar from '@/components/SideBar/SideBar';
import { META_TRANS_NEWS_LIST } from '@/models/satDigest.model';
import { DEFAULT_META_DATA } from '@/models/ui.model';
import { getFormattedDateStrYearFirst } from '@/libs/utils/dates';
import { EUrlBaseParam } from '@/models/url.model';
import { getELangKey } from '@/libs/utils/validSearchParam';

const BASE_URL = process.env.BASE_URL;

const { metaDescription, metaKeywords, metaTitle } = META_TRANS_NEWS_LIST;

interface IProps {
  children?: React.ReactNode;
  params: { [key in EUrlBaseParam]: string };
}

export const generateMetadata = ({ params }: IProps): Metadata => {
  const lang = getELangKey(params[EUrlBaseParam.LANG]);

  return {
    metadataBase: new URL(BASE_URL || ''),
    title: metaTitle[lang],
    description: metaDescription[lang],
    keywords: metaKeywords[lang],
    openGraph: {
      ...DEFAULT_META_DATA.openGraph,
      title: metaTitle[lang],
      description: metaDescription[lang],
      url: BASE_URL,
      publishedTime: getFormattedDateStrYearFirst(),
    },
  };
};

export default function Layout({ children, params }: IProps) {
  const lang = getELangKey(params[EUrlBaseParam.LANG]);

  return (
    <main className="main">
      <SideBar lang={lang} />
      <section className="articleWrapper">{children}</section>
    </main>
  );
}
