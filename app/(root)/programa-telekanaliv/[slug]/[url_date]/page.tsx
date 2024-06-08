import BottomInfoPanel from '@/components/BottomInfoPanel/BottomInfoPanel';
import FillingValidImage from '@/components/ui/Images/FillingValidImage';
import SimilarArticles from '@/components/SimilarArticles/SimilarArticles';
import SimilarChannel from '@/components/SimilarChannel/SimilarChannel';
import { Title } from '@/components/ui/Titles/Title';
import {
  getDBOnlineChannel,
  getSimilarChannels,
} from '@/controllers/channel.controller';
import { getCommentsNumber } from '@/controllers/comments.controller';
import { cutText } from '@/libs/utils/utils';
import { META_CHANNEL } from '@/models/channel.model';
import { LANGUAGE, EDBTableTitles, DEFAULT_META_DATA } from '@/models/ui.model';
import { EUrlBaseParam } from '@/models/url.model';
import { Metadata } from 'next';
import BreadCrumbServer from '@/components/BreadCrumbs/BreadCrumbsServer';
import { SCHEDULE_META } from '@/models/scheduleTV.model';
import { getChanOneDaySchedule } from '@/controllers/schedule.controller';
import { notFound } from 'next/navigation';
import CommentBlock from '@/components/comments/CommentBlock/CommentBlock';
import SchedulePage from '@/components/SchedulePage/SchedulePage';
import { getFormattedDateStr, getValidDate } from '@/libs/utils/dates';
import WeekScheduleTabs from '@/components/tabs/WeekScheduleTabs';
import NoteBlock from '@/components/ui/NoteBlock/NoteBlock';
import GrooveLine from '@/components/ui/GrooveLine';
import { BREAD_CRUMBS } from '@/models/breadCrumbs.model';
import ChannelOnlineLink from '@/components/ui/buttons/ChannelOnlineLink/ChannelOnlineLink';
import { decode } from 'html-entities';

const BASE_URL = process.env.BASE_URL;

const {
  images: {
    channelLogo: { big: bigLogo },
  },
  infoPanelTitles: { comments: commentsTitle, views: viewsTitle },
  similar: { channels: simChannelsBefore },
  noteTitle,
  getResponsibilityText,
  getOnlineLinkText,
} = META_CHANNEL;

const { getKeywords, getTitle, h1Start, descriptionStart } = SCHEDULE_META;

export interface IPageProps {
  params: { slug: string; url_date: string };
}

export const generateMetadata = async ({
  params: { slug, url_date },
}: IPageProps): Promise<Metadata> => {
  const sqlResult = await getDBOnlineChannel(slug);
  if (!sqlResult) return DEFAULT_META_DATA[LANGUAGE];

  const { title, description } = sqlResult;

  const metaDescription = `${descriptionStart[LANGUAGE]} ${title}. ${cutText(description, 150)}`;
  const metaTitle = getTitle(title, url_date)[LANGUAGE];

  return {
    title: metaTitle,
    description: metaDescription,
    keywords: getKeywords(title)[LANGUAGE],
    openGraph: {
      ...DEFAULT_META_DATA.openGraph,
      title: metaTitle,
      description: metaDescription,
      url: `${BASE_URL}/${EUrlBaseParam.CHANNELS_TV_PROGRAM}/${slug}/${url_date}`,
      publishedTime: getFormattedDateStr(),
    },
  };
};

export default async function Page({ params: { slug, url_date } }: IPageProps) {
  const sqlResult = await getDBOnlineChannel(slug);
  if (!sqlResult || !getValidDate(url_date)) notFound();

  const {
    id,
    title: chanTitle,
    logo,
    view,
    vipiko,
    vsetv,
    tvforsite_net,
  } = sqlResult;
  const title = decode(chanTitle);

  const dbScheduleDataArr = [
    {
      tblName: EDBTableTitles.TV_SCHEDULE_VIPIKO,
      scheduleId: vipiko,
    },
    {
      tblName: EDBTableTitles.TV_SCHEDULE_VSE_TV,
      scheduleId: vsetv,
    },
  ];
  const filteredSchedules = dbScheduleDataArr.filter((t) => t.scheduleId);
  const schedules = await getChanOneDaySchedule(filteredSchedules, url_date);

  const similarChannelsResult = await getSimilarChannels(logo);
  const similarChannels =
    similarChannelsResult instanceof Error ? [] : similarChannelsResult;

  const numberOfComments = await getCommentsNumber(
    EDBTableTitles.COMMENTS_CHANNEL,
    `${id}`
  );

  return (
    <>
      <BreadCrumbServer
        breadCrumbList={[
          BREAD_CRUMBS.CHANNELS_TV_PROGRAM,
          `${h1Start[LANGUAGE]} "${title}"`,
        ]}
      />
      <article className="article">
        <Title>
          {`${h1Start[LANGUAGE]} "${title}"`}
          <FillingValidImage
            image={{
              ...bigLogo,
              src: `${bigLogo.path}${logo}`,
            }}
            defaultImage={bigLogo.defaultImage}
            alternativeImgString={bigLogo.alternativeImgStr}
            alt={`${bigLogo.alt[LANGUAGE]} "${title}"`}
            isBlur
          />
        </Title>

        <WeekScheduleTabs currentDate={url_date} />
        <SchedulePage
          scheduleList={schedules}
          urlDate={url_date}
          channelTitle={title}
        />

        {tvforsite_net && (
          <ChannelOnlineLink
            href={`/${EUrlBaseParam.ONLINE_CHANNEL_LIST}/${slug}`}
          >
            {getOnlineLinkText(title)[LANGUAGE]}
          </ChannelOnlineLink>
        )}

        <GrooveLine className="py-4" />

        <NoteBlock noteTitle={noteTitle[LANGUAGE]}>
          {getResponsibilityText(title)[LANGUAGE]}
        </NoteBlock>

        <BottomInfoPanel
          items={[
            { name: viewsTitle[LANGUAGE], value: view + 1 },
            { name: commentsTitle[LANGUAGE], value: numberOfComments },
          ]}
        />
      </article>

      {similarChannels.length ? (
        <SimilarArticles
          similarTitle={`${simChannelsBefore.title[LANGUAGE]}"${title}"`}
          similarArticlesMapped={similarChannels.map((chan) => (
            <li key={chan.cpu}>
              <SimilarChannel channelTitle={title} chanParams={chan} />
            </li>
          ))}
        />
      ) : null}

      <CommentBlock
        numberOfComments={numberOfComments}
        revalidateUrl={`/${EUrlBaseParam.CHANNELS_TV_PROGRAM}/${slug}/${url_date}`}
        dbCommentTableName={EDBTableTitles.COMMENTS_CHANNEL}
        articleId={`${id}`}
        articleName={`${h1Start[LANGUAGE]} "${title}"`}
      />
    </>
  );
}
