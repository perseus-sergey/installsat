import type { Metadata } from 'next';
import SideBar from '@/components/SideBar/SideBar';
import { META_TRANS_NEWS_LIST } from '@/models/satDigest.model';
import { DEFAULT_META_DATA, ELanguage } from '@/models/ui.model';
import { getFormattedDateStrYearFirst } from '@/libs/utils/dates';
import { EUrlBaseParam, MAIN_URL } from '@/models/url.model';
import { getELangKey } from '@/libs/utils/validSearchParam';
import SideBarServer from '@/components/SideBar/SideBarServer';
import { Suspense } from 'react';
import RightAside from '@/components/SideBar/RightAside';

const BASE_URL = process.env.BASE_URL || MAIN_URL;

const { metaDescription, metaKeywords, metaTitle } = META_TRANS_NEWS_LIST;

interface IProps {
  children?: React.ReactNode;
  params: { [key in EUrlBaseParam]: string };
}

export const generateMetadata = ({ params }: IProps): Metadata => {
  const lang = getELangKey(params[EUrlBaseParam.LANG]);

  return {
    metadataBase: new URL(BASE_URL),
    title: metaTitle[lang],
    description: metaDescription[lang],
    keywords: metaKeywords[lang],
    openGraph: {
      ...DEFAULT_META_DATA.openGraph,
      title: metaTitle[lang],
      description: metaDescription[lang],
      url: `/${lang}`,
      publishedTime: getFormattedDateStrYearFirst(),
    },
    alternates: {
      canonical: `/${lang}`,
      languages: {
        en: `/${ELanguage.EN}`,
        uk: `/${ELanguage.UA}`,
      },
    },
  };
};

export default function Layout({ children, params }: IProps) {
  const lang = getELangKey(params[EUrlBaseParam.LANG]);

  return (
    <main className="mx-auto bg-slate-900 w-full max-w-5xl flex min-h-screen sm:rounded-lg sm:border sm:border-stone-400">
      <Suspense>
        <SideBar lang={lang}>
          <SideBarServer lang={lang} />
        </SideBar>
      </Suspense>

      <section className="flex flex-col w-full lg:max-w-3xl overflow-x-hidden">
        {children}
      </section>

      <RightAside lang={lang} />
    </main>
  );
}
