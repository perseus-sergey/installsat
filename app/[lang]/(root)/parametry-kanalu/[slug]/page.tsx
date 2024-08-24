import BottomInfoPanel from '@/components/BottomInfoPanel/BottomInfoPanel';
import ChannelOnlineLink from '@/components/ui/buttons/ChannelOnlineLink/ChannelOnlineLink';
import ChannelParams from '@/components/ChannelParams/ChannelParams';
import DangerHtml from '@/components/ui/DangerHtml/DangerHtml';
import FillingValidImage from '@/components/ui/Images/FillingValidImage';
import NoteBlock from '@/components/ui/NoteBlock/NoteBlock';
import SimilarArticles from '@/components/SimilarArticles/SimilarArticles';
import { SimilarFlyChannel } from '@/components/SimilarChannel/SimilarChannel';
import { Title } from '@/components/ui/Titles/Title';
import TvScheduleLink from '@/components/TvScheduleLink/TvScheduleLink';
import {
  getSimilarArticles,
  updateViewCount,
} from '@/controllers/articles.controller';
import {
  getDBChannel,
  getSimilarFlyChannels,
} from '@/controllers/channel.controller';
import { META_CHANNEL } from '@/models/channel.model';
import {
  DEFAULT_LANG,
  EDBTableTitles,
  DEFAULT_META_DATA,
  ELanguage,
} from '@/models/ui.model';
import { EUrlAdminParam, EUrlBaseParam, MAIN_URL } from '@/models/url.model';
import { Metadata } from 'next';
import Link from 'next/link';
import CommentBlock from '@/components/comments/CommentBlock/CommentBlock';
import { getCommentsNumber } from '@/controllers/comments.controller';
import GrooveLine from '@/components/ui/GrooveLine';
import BreadCrumbServer from '@/components/BreadCrumbs/BreadCrumbsServer';
import { BREAD_CRUMBS } from '@/models/breadCrumbs.model';
import { getFormattedDateStrYearFirst } from '@/libs/utils/dates';
import EditLinkButton from '@/components/admin/EditLinkButton/EditLinkButton';
import { notFound } from 'next/navigation';
import { getELangKey } from '@/libs/utils/validSearchParam';

const BASE_URL = process.env.BASE_URL || MAIN_URL;

const {
  images: {
    channelLogo: { big: bigLogo },
  },
  infoPanelTitles: {
    // package: packageTitle,
    comments: commentsTitle,
    views: viewsTitle,
  },
  titleBefore,
  keywordsBefore,
  preText,
  scheduleLinkText: { channel: scheduleTitle },
  noteTitle,
  getOnlineLinkText,
  getResponsibilityText,
  similar: { channels: simChannelsBefore, articles: simArticlesBefore },
} = META_CHANNEL;

export interface IChannelProps {
  params: { [key in EUrlBaseParam]: string };
}

export const generateMetadata = async ({
  params,
}: IChannelProps): Promise<Metadata> => {
  const slug = params[EUrlBaseParam.SLUG];
  const lang = getELangKey(params[EUrlBaseParam.LANG]);

  const sqlResult = await getDBChannel(slug);
  if (!sqlResult) return DEFAULT_META_DATA[lang];

  const {
    title,
    description,
    chan_slug,
    cat_parent_id,
    cat_parent_title,
    cat_title,
    sat_title,
    freq,
    polar,
    canonical,
  } = sqlResult;

  const metaTitle =
    cat_parent_id > 0
      ? `${titleBefore[lang]} ${title} | ${cat_parent_title} | ${cat_title}`
      : `${titleBefore[lang]} ${title} | ${sat_title} ${freq} ${polar} | ${cat_title}`;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [clearedCanonical, ..._] = canonical
    .replace(/\/$/, '')
    .split('/')
    .reverse();

  const addCanonical = canonical ? clearedCanonical : chan_slug;

  return {
    metadataBase: new URL(BASE_URL),
    title: metaTitle,
    description: description || metaTitle,
    keywords: keywordsBefore[lang] + description,
    alternates: {
      canonical: `/${DEFAULT_LANG}/${EUrlBaseParam.CHANNEL_PARAMS}/${addCanonical}`,
      languages: {
        en: `/${ELanguage.EN}/${EUrlBaseParam.CHANNEL_PARAMS}/${chan_slug}`,
        uk: `/${ELanguage.UA}/${EUrlBaseParam.CHANNEL_PARAMS}/${chan_slug}`,
      },
    },
    openGraph: {
      ...DEFAULT_META_DATA.openGraph,
      title: metaTitle,
      description: description || metaTitle,
      url: `/${lang}/${EUrlBaseParam.CHANNEL_PARAMS}/${chan_slug}`,
      publishedTime: getFormattedDateStrYearFirst(),
    },
  };
};

export default async function Page({ params }: IChannelProps) {
  const slug = params[EUrlBaseParam.SLUG];
  const lang = getELangKey(params[EUrlBaseParam.LANG]);

  const sqlResult = await getDBChannel(slug);

  if (!sqlResult) notFound();

  const {
    id,
    title,
    logo,
    text,
    view,
    chan_slug,
    cat_id,
    // cat_title,
    // cat_parent_title,
    // cat_parent_id,
    // cat_parent_cpu,
    // cat_slug,
    // sat_slug,
    // sat_title,
    tvforsite_net,
  } = sqlResult;

  // const catLink =
  //   cat_parent_id > 0
  //     ? `${cat_parent_cpu}#${CHANNEL_LIST_ANCHOR_START}${cat_id}`
  //     : cat_slug;

  // const catTitle =
  //   cat_parent_id > 0 ? `${cat_parent_title} - ${cat_title}` : cat_title;

  const similarChannels = await getSimilarFlyChannels(title);

  const similarArticles = await getSimilarArticles(logo);

  const numberOfComments = await getCommentsNumber(
    EDBTableTitles.COMMENTS_CHANNEL,
    `${id}`
  );

  const currentDate = getFormattedDateStrYearFirst();

  updateViewCount(EDBTableTitles.CHANNELS, `${id}`, view);

  return (
    <>
      <EditLinkButton
        href={`/${lang}/${EUrlAdminParam.BASE_PATH}/${EUrlAdminParam.CHANNELS_EDIT}/edit/${id}`}
      />
      <BreadCrumbServer
        lang={lang}
        breadCrumbList={[
          // BREAD_CRUMBS.PACKAGE_CHANNEL_LIST,
          BREAD_CRUMBS.SAT_CHANNEL_LIST,
          // {
          //   href: `${EUrlBaseParam.PACKAGE_CHANNEL_LIST}/${catLink}`,
          //   title: catTitle,
          // },
          // {
          //   href: `${EUrlBaseParam.SAT_CHANNEL_LIST}/${sat_slug}`,
          //   title: sat_title,
          // },
          `${titleBefore[lang]} "${title}"`,
        ]}
      />
      <article className="article">
        <Title>
          {`${titleBefore[lang]} "${title}"`}
          <FillingValidImage
            image={{
              ...bigLogo,
              src: `${bigLogo.path}${logo}`,
            }}
            defaultImage={bigLogo.defaultImage}
            alternativeImgString={bigLogo.alternativeImgStr}
            alt={`${bigLogo.alt[lang]} "${title}"`}
            isBlur
          />
        </Title>

        <div className="article-text">
          {cat_id === 23 && (
            <h2 style={{ color: '#ff0000' }}>{preText[lang]}</h2>
          )}
          <DangerHtml text={text} />

          <GrooveLine className="py-4" />

          <TvScheduleLink
            lang={lang}
            title={`${scheduleTitle[lang]} "${title}"`}
            href={`/${lang}/${EUrlBaseParam.CHANNELS_TV_PROGRAM}/${slug}/${currentDate}`}
          />

          {tvforsite_net && (
            <ChannelOnlineLink
              lang={lang}
              href={`/${lang}/${EUrlBaseParam.ONLINE_CHANNEL_LIST}/${slug}`}
            >
              {getOnlineLinkText(title)[lang]}
            </ChannelOnlineLink>
          )}
          <ChannelParams channelDBParams={sqlResult} lang={lang} />

          <NoteBlock noteTitle={noteTitle[lang]}>
            {getResponsibilityText(title)[lang]}
          </NoteBlock>
        </div>

        <BottomInfoPanel
          items={[
            // {
            //   name: packageTitle[lang],
            //   value: (
            //     <Link
            //       href={`/${lang}/${EUrlBaseParam.PACKAGE_CHANNEL_LIST}/${catLink}`}
            //     >
            //       {catTitle}
            //     </Link>
            //   ),
            // },
            {
              name: viewsTitle[lang],
              value: (view + 1).toLocaleString('en-US'),
            },
            { name: commentsTitle[lang], value: numberOfComments },
          ]}
        />
      </article>

      {similarChannels.length ? (
        <SimilarArticles
          similarTitle={`${simChannelsBefore.title[lang]} "${title}"`}
          similarArticlesMapped={similarChannels.map((chan) => (
            <li key={chan.slug}>
              <SimilarFlyChannel lang={lang} chanParams={chan} />
            </li>
          ))}
        />
      ) : null}

      {similarArticles.length ? (
        <SimilarArticles
          similarTitle={simArticlesBefore.title[lang]}
          similarArticlesMapped={similarArticles.map((art) => (
            <li key={art.cpu}>
              <Link href={`/${lang}/${EUrlBaseParam.ARTICLE}/${art.cpu}`}>
                {lang === ELanguage.UA ? art.title : art.title_en || art.title}
              </Link>
              <span>{` (${getFormattedDateStrYearFirst(art.date)})`}</span>
            </li>
          ))}
        />
      ) : null}

      <CommentBlock
        lang={lang}
        numberOfComments={numberOfComments}
        revalidateUrl={`/${lang}/${EUrlBaseParam.CHANNEL_PARAMS}/${chan_slug}`}
        dbCommentTableName={EDBTableTitles.COMMENTS_CHANNEL}
        articleId={`${id}`}
        articleName={title}
      />
    </>
  );
}
