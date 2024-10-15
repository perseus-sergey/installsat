import type { Metadata } from 'next';
import SideBar from '@/components/SideBar/SideBar';
import { META_TRANS_NEWS_LIST } from '@/models/satDigest.model';
import { getFormattedDateStrYearFirst } from '@/libs/utils/dates';
import { getELangKey } from '@/libs/utils/getLanguage';
import SideBarServer from '@/components/SideBar/SideBarServer';
import { Suspense } from 'react';
import RightAside from '@/components/SideBar/RightAside';
import { DEFAULT_META_DATA } from '@/models/defaultMeta.model';
import { ELanguage } from '@/models/language.model';
import { EUrlBaseParam, MAIN_URL } from '@/models/url/url.model';

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
    <>
      <Suspense>
        <SideBar lang={lang}>
          <SideBarServer lang={lang} />
        </SideBar>
      </Suspense>

      <main className="mx-auto bg-slate-900 w-full max-w-5xl flex min-h-screen sm:rounded-lg sm:border sm:border-stone-400">
        <div className="w-0 min-h-screen"></div>

        <section className="flex flex-col w-full lg:max-w-3xl overflow-x-hidden">
          {children}
        </section>

        <RightAside lang={lang} />
      </main>
    </>
  );
}
