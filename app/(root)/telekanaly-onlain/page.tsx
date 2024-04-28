import EmptyData from '@/components/errors/EmptyData/EmptyData';
import { Title } from '@/components/ui/Titles/Title';
import { getOnlineChannels } from '@/controllers/channelList.controller';
import {
  META_ALL_SAT_CHANNEL_LIST,
  META_ONLINE_CHANNEL_LIST,
  START_CONTENT,
} from '@/models/channelList.model';
import type { Metadata } from 'next';
import StartArticleSection from '@/components/article/StartArticleSection/StartArticleSection';
import FillingImg from '@/components/Images/FillingImage';
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
import OnlineChannelList from '@/components/OnlineChannelList/OnlineChannelList';
import TooltipSimple from '@/components/ui/TooltipSimple/TooltipSimple';
import Link from 'next/link';

const BASE_URL = process.env.BASE_URL;

const {
  metaDescription,
  metaH1,
  metaKeywords,
  metaTitle,
  images: { h1Image },
  ONLINE_CHANNEL_LIST_DB_ID,
} = META_ONLINE_CHANNEL_LIST;

const {
  filtering: {
    filterByChannelName: { placeholder, labelTitle },
  },
} = META_ALL_SAT_CHANNEL_LIST;

export const metadata: Metadata = {
  title: metaTitle[L],
  description: metaDescription[L],
  keywords: metaKeywords[L],
  openGraph: {
    ...DEFAULT_META_DATA.openGraph,
    title: metaTitle[L],
    description: metaDescription[L],
    url: `${BASE_URL}/${EUrlBaseParam.ONLINE_CHANNEL_LIST}`,
    publishedTime: getFormattedDateStr(new Date()),
  },
};
interface IPageProps {
  searchParams?: TSearchParams;
}

export default async function Page({ searchParams }: IPageProps) {
  const searchQueryChannel = validSearchParam(
    EUrlSearchParam.CHANNEL,
    searchParams
  );

  const onlineChannels = await getOnlineChannels(searchQueryChannel);

  if (onlineChannels instanceof Error)
    return <EmptyData description={onlineChannels.message} />;

  const numberOfComments = await getCommentsNumber(
    EDBTableTitles.COMMENTS_GENRE,
    ONLINE_CHANNEL_LIST_DB_ID
  );

  return (
    <>
      <article className="article">
        <Title>
          {metaH1[L]}
          {searchQueryChannel
            ? ` назва яких містить «${searchQueryChannel}»`
            : '.'}
          <FillingImg {...h1Image} alt={h1Image.alt[L]} />
        </Title>

        <Fieldset legendText="Фільтри">
          <nav className="p-2 md:p-4">
            <ul>
              {onlineChannels.map(([genreTitle, chanList]) => (
                <li key={genreTitle}>
                  <TooltipSimple
                    tooltipText={`Перейти до жанру: ${genreTitle}`}
                  >
                    <Link
                      title={genreTitle}
                      href={`#genre-${chanList[0].tema}`}
                      className="text-indigo-800 text-lg hover:text-red-500"
                    >
                      {genreTitle}
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
        <StartArticleSection>
          <p>{START_CONTENT[LANGUAGE]}</p>
        </StartArticleSection>

        <Suspense key={searchQueryChannel}>
          <OnlineChannelList onlineChannels={onlineChannels} />
        </Suspense>
      </article>

      <CommentBlock
        numberOfComments={numberOfComments}
        revalidateUrl={`/${EUrlBaseParam.ONLINE_CHANNEL_LIST}`}
        dbCommentTableName={EDBTableTitles.COMMENTS_GENRE}
        articleId={ONLINE_CHANNEL_LIST_DB_ID}
        articleName={metaTitle[L]}
      />
    </>
  );
}

// const inputData: Channel[] = [
//   {
//     title: 'Obieqtivi TV',
//     compress: 3,
//     tvforsite_net: 'http://tv.myvideo.ge',
//     genre: '22',
//   },
//   { title: 'РЕН ТВ', compress: 5, tvforsite_net: '', genre: '22' },
//   { title: 'ICTV', compress: 5, tvforsite_net: '', genre: '22' },
//   {
//     title: 'ТРК Украина',
//     compress: 4,
//     tvforsite_net: 'https://kanalukraina.tv/online',
//     genre: '22',
//   },
//   {
//     title: 'ТРК Украина',
//     compress: 5,
//     tvforsite_net: 'https://kanalukraina.tv/5',
//     genre: '22',
//   },
//   {
//     title: 'Санкт Петербург',
//     compress: 5,
//     tvforsite_net: 'https://topspb.tv/live/',
//     genre: '22',
//   },
//   {
//     title: 'ТВ Центр',
//     compress: 3,
//     tvforsite_net: 'http://www.tvc.ru/channel/onair',
//     genre: '33',
//   },
//   {
//     title: 'ТВ Центр',
//     compress: 5,
//     tvforsite_net: '',
//     genre: '33',
//   },
//   {
//     title: 'ТВ Центр',
//     compress: 4,
//     tvforsite_net: 'http://www.tvc.ru/channel/onair',
//     genre: '33',
//   },
//   { title: 'Мир (+4ч)', compress: 5, tvforsite_net: '', genre: '33' },
//   {
//     title: 'Белсат ТВ',
//     compress: 4,
//     tvforsite_net: 'https://belsat.eu/online/',
//     genre: '33',
//   },
// ];

// console.log("🚀 ~ grouped(inputData):", grouped(inputData)) =>
// [
//   [
//     '22',
//     [
//       {
//         title: 'Obieqtivi TV',
//         compress: 3,
//         tvforsite_net: 'http://tv.myvideo.ge',
//         genre: '22',
//       },
//       { title: 'РЕН ТВ', compress: 5, tvforsite_net: '', genre: '22' },
//       {
//         title: 'ICTV',
//         compress: 5,
//         tvforsite_net: '',
//         genre: '22',
//       },
//       {
//         title: 'ТРК Украина',
//         compress: 4,
//         tvforsite_net: 'https://kanalukraina.tv/online',
//         genre: '22',
//       },
//       {
//         title: 'Санкт Петербург',
//         compress: 5,
//         tvforsite_net: 'https://topspb.tv/live/',
//         genre: '22',
//       },
//     ],
//   ],
//   [
//     '33',
//     [
//       {
//         title: 'ТВ Центр',
//         compress: 3,
//         tvforsite_net: 'http://www.tvc.ru/channel/onair',
//         genre: '33',
//       },
//       {
//         title: 'Мир (+4ч)',
//         compress: 5,
//         tvforsite_net: '',
//         genre: '33',
//       },
//       {
//         title: 'Белсат ТВ',
//         compress: 4,
//         tvforsite_net: 'https://belsat.eu/online/',
//         genre: '33',
//       },
//     ],
//   ],
// ];
