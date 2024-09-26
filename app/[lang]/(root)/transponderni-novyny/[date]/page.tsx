import ArticleWrapper from '@/components/article/ArticleWrapper';
import BreadCrumbServer from '@/components/BreadCrumbs/BreadCrumbsServer';
import TransNewsSingle from '@/components/TransNewsSingle/TransNewsSingle';
import { getTransNewsForSingleDay } from '@/controllers/satDigest.controller';
import { getDateInISO, getFormattedDateStrYearFirst } from '@/libs/utils/dates';
import { getELangKey } from '@/libs/utils/validSearchParam';
import { META_TRANS_NEWS_SINGLE } from '@/models/satDigest.model';
import { DEFAULT_META_DATA, ELanguage } from '@/models/ui.model';
import { EUrlBaseParam, MAIN_URL } from '@/models/url.model';
import { notFound } from 'next/navigation';
import { cache } from 'react';

const BASE_URL = process.env.BASE_URL || MAIN_URL;

const { metaDescriptionStart, metaH1start, metaKeywordsStart, metaTitleStart } =
  META_TRANS_NEWS_SINGLE;

const getCurrDateCached = cache(getFormattedDateStrYearFirst);

interface IPageParams {
  params: { [key in EUrlBaseParam]: string };
}

// export const dynamic = 'force-dynamic';
export const revalidate = 43200; // 3600 * 12 invalidate cache every 12 hours

export const generateMetadata = async ({ params }: IPageParams) => {
  const { date } = params;
  const lang = getELangKey(params[EUrlBaseParam.LANG]);

  const formattedDate = getCurrDateCached(date);
  const title = `${metaTitleStart[lang]} ${formattedDate}`;
  const description = `${metaDescriptionStart[lang]} ${formattedDate}`;

  return {
    metadataBase: new URL(BASE_URL),
    title,
    description,
    keywords: `${metaKeywordsStart[lang]} ${formattedDate}`,
    openGraph: {
      ...DEFAULT_META_DATA.openGraph,
      title,
      description,
      url: `/${lang}/${EUrlBaseParam.TRANSPONDER_NEWS}/${date}`,
      publishedTime: date,
    },
    alternates: {
      canonical: `/${lang}/${EUrlBaseParam.TRANSPONDER_NEWS}/${date}`,
      languages: {
        en: `/${ELanguage.EN}/${EUrlBaseParam.TRANSPONDER_NEWS}/${date}`,
        uk: `/${ELanguage.UA}/${EUrlBaseParam.TRANSPONDER_NEWS}/${date}`,
      },
    },
  };
};

export default async function Page({ params }: IPageParams) {
  const lang = getELangKey(params[EUrlBaseParam.LANG]);
  const newsArray = await getTransNewsForSingleDay(params.date, lang);

  const formattedDate = getDateInISO(params.date);

  if (!formattedDate) notFound();

  return (
    <>
      <BreadCrumbServer
        lang={lang}
        breadCrumbList={[`${metaH1start[lang]} ${formattedDate}`]}
      />
      <ArticleWrapper lang={lang}>
        <TransNewsSingle
          lang={lang}
          title={
            <>
              {metaH1start[lang]}{' '}
              <time dateTime={formattedDate}>{formattedDate}</time>
            </>
          }
          newsArray={newsArray}
        />
      </ArticleWrapper>
    </>
  );
}
