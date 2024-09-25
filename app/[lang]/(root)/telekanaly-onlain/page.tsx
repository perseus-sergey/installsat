import { Title } from '@/components/ui/Titles/Title';
import { getOnlineChannels } from '@/controllers/channelList.controller';
import {
  META_ONLINE_CHANNEL_LIST,
  ONLINE_CHANNEL_LIST_DATA,
  ONLINE_CHANNEL_LIST_IMAGES,
} from '@/models/channelList.model';
import type { Metadata } from 'next';
import { TSearchParams, DEFAULT_META_DATA, ELanguage } from '@/models/ui.model';
import { EUrlBaseParam, EUrlSearchParam, MAIN_URL } from '@/models/url.model';
import { getELangKey, validSearchParam } from '@/libs/utils/validSearchParam';
// import CommentBlock from '@/components/comments/CommentBlock/CommentBlock';
// import { getCommentsNumber } from '@/controllers/comments.controller';
import OnlineChannelListAfterText from '@/components/online/OnlineChannelListAfterText/OnlineChannelListAfterText';
import PackageChannelList from '@/components/channelList/PackageChannelList';
import BreadCrumbServer from '@/components/BreadCrumbs/BreadCrumbsServer';
import { getFormattedDateStrYearFirst } from '@/libs/utils/dates';
import Image from 'next/image';
import h1Img from 'public/Images/packages/Popcorn-icon.png';
import { Suspense } from 'react';

interface IPageProps {
  params: { [key in EUrlBaseParam]: string };
  searchParams?: TSearchParams;
}

const BASE_URL = process.env.BASE_URL || MAIN_URL;
const { LANG, ONLINE_CHANNEL_LIST } = EUrlBaseParam;

const { metaDescription, metaH1, getH1After, metaKeywords, metaTitle } =
  META_ONLINE_CHANNEL_LIST;

const {
  fieldsetFilters: {},
} = ONLINE_CHANNEL_LIST_DATA;
const { h1Image } = ONLINE_CHANNEL_LIST_IMAGES;

export const revalidate = 3600 * 48;

export const generateMetadata = ({ params }: IPageProps): Metadata => {
  const lang = getELangKey(params[LANG]);

  return {
    metadataBase: new URL(BASE_URL),
    title: metaTitle[lang],
    description: metaDescription[lang],
    keywords: metaKeywords[lang],
    openGraph: {
      ...DEFAULT_META_DATA.openGraph,
      title: metaTitle[lang],
      description: metaDescription[lang],
      url: `/${lang}/${ONLINE_CHANNEL_LIST}`,
      publishedTime: getFormattedDateStrYearFirst(),
    },
    alternates: {
      canonical: `/${lang}/${ONLINE_CHANNEL_LIST}`,
      languages: {
        en: `/${ELanguage.EN}/${ONLINE_CHANNEL_LIST}`,
        uk: `/${ELanguage.UA}/${ONLINE_CHANNEL_LIST}`,
      },
    },
  };
};

export default async function Page({ params, searchParams }: IPageProps) {
  const lang = getELangKey(params[LANG]);

  const searchQueryChannel = validSearchParam(
    EUrlSearchParam.CHANNEL,
    searchParams
  );

  const getChannelsFn = () => getOnlineChannels(lang, searchQueryChannel);

  // const numberOfComments = await getCommentsNumber(
  //   EDBTableTitles.COMMENTS_GENRE,
  //   ONLINE_CHANNEL_LIST_DB_ID
  // );

  return (
    <>
      <BreadCrumbServer breadCrumbList={[metaH1[lang]]} lang={lang} />

      <article className="article">
        <Title>
          {metaH1[lang]}
          {getH1After(searchQueryChannel)[lang]}
          <Image src={h1Img} alt={h1Image.alt[lang]} priority />
        </Title>

        <section className="min-h-[70vh]">
          <Suspense>
            <PackageChannelList
              lang={lang}
              isGenre
              getChannelsFn={getChannelsFn}
              pathToChannelDetails={ONLINE_CHANNEL_LIST}
            />
          </Suspense>
        </section>

        <OnlineChannelListAfterText lang={lang} />
      </article>
    </>
  );
}

// <CommentBlock
//   lang={lang}
//   numberOfComments={numberOfComments}
//   revalidateUrl={`/${lang}/${ONLINE_CHANNEL_LIST}`}
//   dbCommentTableName={EDBTableTitles.COMMENTS_GENRE}
//   articleId={ONLINE_CHANNEL_LIST_DB_ID}
//   articleName={metaTitle[lang]}
// />
