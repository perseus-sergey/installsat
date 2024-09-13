// import { Title } from '@/components/ui/Titles/Title';
// import {
//   getSatChannels,
//   getGroupedChannelsAllSat,
// } from '@/controllers/channelList.controller';
// import {
//   META_ALL_SAT_CHANNEL_LIST,
//   START_CONTENT,
// } from '@/models/channelList.model';
// import type { Metadata } from 'next';
// import StartArticleSection from '@/components/article/StartArticleSection/StartArticleSection';
// import SatChannelsTable from '@/components/SatChannelsTable/SatChannelsTable';
// import FillingImg from '@/components/ui/Images/FillingImage';
// import Fieldset from '@/components/ui/Fieldset/Fieldset';
// import {
//   TSearchParams,
//   DEFAULT_META_DATA,
//   EDBTableTitles,
//   DEFAULT_LANG,
//   ELanguage,
// } from '@/models/ui.model';
// import { EUrlBaseParam, EUrlSearchParam, MAIN_URL } from '@/models/url.model';
// import Filter from '@/components/ui/Filter/Filter';
// import { Suspense } from 'react';
// import AnchorListItemWithCheckbox from '@/components/AnchorListItem/AnchorListItemWithCheckbox';
// import { getChannelSatList } from '@/controllers/sidebar.controller';
// import ChannelFormatSliders from '@/components/ui/ChannelFormatSliders/ChannelFormatSliders';
// import { getELangKey, validSearchParam } from '@/libs/utils/validSearchParam';
// import CommentBlock from '@/components/comments/CommentBlock/CommentBlock';
// import { getCommentsNumber } from '@/controllers/comments.controller';
// import BreadCrumbServer from '@/components/BreadCrumbs/BreadCrumbsServer';
// import { BREAD_CRUMBS } from '@/models/breadCrumbs.model';
// import { getFormattedDateStrYearFirst } from '@/libs/utils/dates';

// const BASE_URL = process.env.BASE_URL || MAIN_URL;

// const {
//   metaH1,
//   metaDescription,
//   metaKeywords,
//   metaTitle,
//   image: { h1ImageParams },
//   anchors,
//   filtering: {
//     filterByChannelName: { placeholder, labelTitle },
//     filterByChannelFormat: { formats },
//     resetAllFiltersButton,
//     satCheckBox,
//     satAnchor,
//   },
//   CHANNEL_LIST_DB_ID,
// } = META_ALL_SAT_CHANNEL_LIST;

// interface IPageProps {
//   params: { [key in EUrlBaseParam]: string };
//   searchParams?: TSearchParams;
// }

// export const generateMetadata = async ({
//   params,
// }: IPageProps): Promise<Metadata> => {
//   const lang = getELangKey(params[EUrlBaseParam.LANG]);

//   return {
//     metadataBase: new URL(BASE_URL),
//     title: metaTitle[lang],
//     description: metaDescription[lang],
//     keywords: metaKeywords[lang],
//     openGraph: {
//       ...DEFAULT_META_DATA.openGraph,
//       title: metaTitle[lang],
//       description: metaDescription[lang],
//       url: `/${lang}/${EUrlBaseParam.SAT_CHANNEL_LIST}`,
//       publishedTime: getFormattedDateStrYearFirst(),
//     },
//     alternates: {
//       canonical: `/${DEFAULT_LANG}/${EUrlBaseParam.SAT_CHANNEL_LIST}`,
//       languages: {
//         en: `/${ELanguage.EN}/${EUrlBaseParam.SAT_CHANNEL_LIST}`,
//         uk: `/${ELanguage.UA}/${EUrlBaseParam.SAT_CHANNEL_LIST}`,
//       },
//     },
//   };
// };

// export default async function Page({ searchParams, params }: IPageProps) {
//   const lang = getELangKey(params[EUrlBaseParam.LANG]);
//   const searchQueryChannel = validSearchParam(
//     EUrlSearchParam.CHANNEL,
//     searchParams
//   );

//   const satChannels = await getSatChannels(
//     lang,
//     searchQueryChannel,
//     '',
//     searchParams?.[EUrlSearchParam.SAT],
//     !!searchParams?.[EUrlSearchParam.CHANNEL_FORMAT_MPG4],
//     !!searchParams?.[EUrlSearchParam.CHANNEL_FORMAT_T2MI]
//   );

//   const satListResults = await getChannelSatList();
//   const satList = satListResults instanceof Error ? [] : satListResults;

//   const groupedChannelsAllSat = getGroupedChannelsAllSat([satChannels]);

//   const satLinks = satList.map((sat) => ({
//     title: `${sat.title} - ${sat.position}`,
//     slug: sat.cpu,
//   }));

//   const numberOfComments = await getCommentsNumber(
//     EDBTableTitles.COMMENTS_PACKAGES,
//     CHANNEL_LIST_DB_ID
//   );

//   return (
//     <>
//       <BreadCrumbServer
//         lang={lang}
//         breadCrumbList={[BREAD_CRUMBS.PACKAGE_CHANNEL_LIST, metaH1[lang]]}
//       />
//       <article className="article">
//         <Title>
//           {metaH1[lang]}
//           <FillingImg
//             src={h1ImageParams.path}
//             alt={h1ImageParams.alt[lang]}
//             width={h1ImageParams.width}
//             height={h1ImageParams.height}
//           />
//         </Title>
//         <Suspense>
//           <Fieldset legendText={anchors.legendTitle[lang]}>
//             <nav>
//               <ul>
//                 {satLinks.map((satLink) => (
//                   <li key={satLink.slug}>
//                     <AnchorListItemWithCheckbox
//                       linkParams={{
//                         title: satLink.title,
//                         href: `#${satLink.slug}`,
//                         'aria-label': satAnchor.tooltip[lang],
//                       }}
//                       inputAttributes={{
//                         value: satLink.slug,
//                         id: `chb-${satLink.slug}`,
//                         name: satLink.slug,
//                         'aria-label': satCheckBox.tooltip[lang],
//                       }}
//                       searchQueryName={EUrlSearchParam.SAT}
//                     />
//                   </li>
//                 ))}
//                 {formats.map((format) => (
//                   <li key={format.searchQueryName}>
//                     <ChannelFormatSliders {...format} />
//                   </li>
//                 ))}
//               </ul>
//               <Suspense>
//                 <Filter
//                   lang={lang}
//                   idName="channel-search-input"
//                   placeholder={placeholder[lang]}
//                   labelTitle={labelTitle[lang]}
//                   searchQueryTitle={EUrlSearchParam.CHANNEL}
//                   resetButton={{
//                     ariaLabel: resetAllFiltersButton.ariaLabel[lang],
//                     content: resetAllFiltersButton.imgStr,
//                   }}
//                 />
//               </Suspense>
//             </nav>
//           </Fieldset>
//         </Suspense>
//         <StartArticleSection>
//           <p>{START_CONTENT[lang]}</p>
//         </StartArticleSection>
//         <Suspense key={searchQueryChannel}>
//           <SatChannelsTable lang={lang} satChannels={groupedChannelsAllSat} />
//         </Suspense>
//       </article>

//       <CommentBlock
//         lang={lang}
//         numberOfComments={numberOfComments}
//         revalidateUrl={`/${lang}/${EUrlBaseParam.SAT_CHANNEL_LIST}`}
//         dbCommentTableName={EDBTableTitles.COMMENTS_PACKAGES}
//         articleId={CHANNEL_LIST_DB_ID}
//         articleName={metaTitle[lang]}
//       />
//     </>
//   );
// }
