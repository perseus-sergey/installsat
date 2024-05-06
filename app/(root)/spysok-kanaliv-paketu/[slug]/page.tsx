import EmptyData from '@/components/errors/EmptyData/EmptyData';
import { Title } from '@/components/ui/Titles/Title';
import {
  getPackageChannels,
  getT2Channels,
} from '@/controllers/channelList.controller';
import {
  CHANNEL_LIST_ANCHOR_START,
  META_ALL_SAT_CHANNEL_LIST,
  META_PACKAGE_CHANNEL_LIST,
} from '@/models/channelList.model';
import type { Metadata } from 'next';
import Fieldset from '@/components/ui/Fieldset/Fieldset';
import {
  LANGUAGE as L,
  LANGUAGE,
  TSearchParams,
  DEFAULT_META_DATA,
  EDBTableTitles,
} from '@/models/ui.model';
import { getFormattedDateStr } from '@/libs/utils/utils';
import { EUrlBaseParam, EUrlSearchParam } from '@/models/url.model';
import Filter from '@/components/ui/Filter/Filter';
import { Suspense } from 'react';
import { validSearchParam } from '@/libs/utils/validSearchParam';
import CommentBlock from '@/components/comments/CommentBlock/CommentBlock';
import { getCommentsNumber } from '@/controllers/comments.controller';
import TooltipSimple from '@/components/ui/TooltipSimple/TooltipSimple';
import Link from 'next/link';
// import OnlineChannelListAfterText from '@/components/online/OnlineChannelListAfterText/OnlineChannelListAfterText';
import PackageChannelList from '@/components/channelList/PackageChannelList';
import FillingValidImage from '@/components/ui/Images/FillingValidImage';
import GenreImage from '@/components/ui/Images/GenreImage/GenreImage';

const BASE_URL = process.env.BASE_URL;

const T2_SLUG = 't2-efir';

const {
  getH1,
  metaKeywords,
  metaTitle,
  images: { h1Image },
  fieldsetFilters: {
    legendText,
    anchorLink: { ariaLabel },
  },
} = META_PACKAGE_CHANNEL_LIST;

const {
  filtering: {
    filterByChannelName: { placeholder, labelTitle },
  },
} = META_ALL_SAT_CHANNEL_LIST;

interface IPageProps {
  params: { slug: string };
  searchParams?: TSearchParams;
}

export const generateMetadata = async ({
  params: { slug },
}: IPageProps): Promise<Metadata> => {
  const res =
    slug === T2_SLUG ? await getT2Channels() : await getPackageChannels(slug);

  if (res instanceof Error || !res.length) return DEFAULT_META_DATA[LANGUAGE];

  const { cat_title, cat_description, cat_slug } = res[0][1][0];

  return {
    title: `${cat_title}. ${metaTitle[L]}`,
    description: cat_description,
    keywords: `${cat_title} ${metaKeywords[L]}`,
    openGraph: {
      ...DEFAULT_META_DATA.openGraph,
      title: `${cat_title}. ${metaTitle[L]}`,
      description: cat_description,
      url: `${BASE_URL}/${EUrlBaseParam.PACKAGE_CHANNEL_LIST}/${cat_slug}`,
      publishedTime: getFormattedDateStr(new Date()),
    },
  };
};

// export async function generateStaticParams(): Promise<
//   {
//     cat: string;
//   }[]
// > {
//   if (allCatResponse instanceof Error) return [{ cat: '' }];

//   return allCatResponse.map((cat) => ({ cat: cat.cpu }));
// }

// export const dynamicParams = false;

export default async function Page({
  params: { slug },
  searchParams,
}: IPageProps) {
  const searchQueryChannel = validSearchParam(
    EUrlSearchParam.CHANNEL,
    searchParams
  );

  const channels =
    slug === T2_SLUG
      ? await getT2Channels(searchQueryChannel)
      : await getPackageChannels(slug, searchQueryChannel);

  if (channels instanceof Error)
    return <EmptyData description={channels.message} />;

  const { cat_logo, cat_slug, cat_title, cat_id } = channels[0][1][0];

  const numberOfComments = await getCommentsNumber(
    EDBTableTitles.COMMENTS_PACKAGES,
    `${cat_id}`
  );

  return (
    <>
      <article className="article">
        <Title>
          {getH1(cat_title, searchQueryChannel)[L]}
          <FillingValidImage
            image={{
              width: h1Image.width,
              height: h1Image.height,
              src: `${h1Image.path}${cat_logo}`,
            }}
            defaultImage={h1Image.defaultImage}
            alternativeImgString={h1Image.alternativeImgStr}
            alt={h1Image.alt[L]}
            isBlur
          />
        </Title>

        <Fieldset legendText={legendText[L]}>
          <nav className="p-2 md:p-4">
            <ul>
              {channels.map(([subCatTitle, chanList]) => (
                <li key={subCatTitle} className="flex items-center gap-4">
                  {slug === 't2-efir' && (
                    <GenreImage
                      tooltipText={subCatTitle}
                      genreMapPosition={chanList[0].genre_id}
                    />
                  )}
                  <TooltipSimple tooltipText={`${ariaLabel[L]} ${subCatTitle}`}>
                    <Link
                      title={subCatTitle}
                      href={`#${CHANNEL_LIST_ANCHOR_START}${chanList[0].genre_id}`}
                      className="text-indigo-800 text-lg hover:text-red-500"
                      aria-label={`${ariaLabel[L]} ${subCatTitle}`}
                    >
                      {subCatTitle}
                    </Link>
                  </TooltipSimple>
                </li>
              ))}
            </ul>
            <Filter
              idName="channel-search-input"
              placeholder={placeholder[L]}
              labelTitle={labelTitle[L]}
              searchQueryTitle={EUrlSearchParam.CHANNEL}
            />
          </nav>
        </Fieldset>

        <Suspense key={searchQueryChannel}>
          <PackageChannelList channels={channels} />
        </Suspense>

        {/* <OnlineChannelListAfterText lang={LANGUAGE} /> */}
      </article>

      <CommentBlock
        numberOfComments={numberOfComments}
        revalidateUrl={`/${EUrlBaseParam.PACKAGE_CHANNEL_LIST}/${cat_slug}`}
        dbCommentTableName={EDBTableTitles.COMMENTS_PACKAGES}
        articleId={`${cat_id}`}
        articleName={`${cat_title}. ${metaTitle[L]}`}
      />
    </>
  );
}
