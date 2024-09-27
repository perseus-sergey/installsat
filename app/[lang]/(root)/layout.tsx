import type { Metadata } from 'next';
import SideBar from '@/components/SideBar/SideBar';
import { META_TRANS_NEWS_LIST } from '@/models/satDigest.model';
import { DEFAULT_META_DATA, ELanguage } from '@/models/ui.model';
import { getFormattedDateStrYearFirst } from '@/libs/utils/dates';
import { EUrlBaseParam, MAIN_URL } from '@/models/url.model';
import { getELangKey } from '@/libs/utils/validSearchParam';
import SideBarServer from '@/components/SideBar/SideBarServer';
import { Suspense } from 'react';
import dynamic from 'next/dynamic';

const WidgetLastNews = dynamic(
  () => import('@/components/WidgetLastNews/WidgetLastNews')
);

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
    <main className="mx-auto bg-slate-900 flex w-fit min-h-screen sm:rounded-lg sm:border sm:border-stone-400">
      <Suspense>
        <SideBar lang={lang}>
          <SideBarServer lang={lang} />
        </SideBar>
      </Suspense>

      <section className="flex flex-col max-w-4xl lg:max-w-3xl overflow-x-hidden">
        {children}
      </section>

      <aside className="hidden lg:flex w-64">
        <Suspense>
          <WidgetLastNews lang={lang} />
        </Suspense>
      </aside>
    </main>
  );
}
