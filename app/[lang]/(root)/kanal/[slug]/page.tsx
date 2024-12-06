import { notFound } from 'next/navigation';
import { Suspense } from 'react';

import BottomInfoPanel from '@/components/BottomInfoPanel/BottomInfoPanel';
import ChannelOnlineLink from '@/components/ui/buttons/ChannelOnlineLink/ChannelOnlineLink';
import { FlyChannelParams } from '@/components/ChannelParams/ChannelParams';
import DangerHtml from '@/components/ui/DangerHtml/DangerHtml';
import FillingValidImage from '@/components/ui/Images/FillingValidImage';
import NoteBlock from '@/components/ui/NoteBlock/NoteBlock';
import { Title } from '@/components/ui/Titles/Title';
import TvScheduleLink from '@/components/TvScheduleLink/TvScheduleLink';
import { getDBFlyChannel } from '@/controllers/channel.controller';
import { EDBTableTitles } from '@/models/dbTblNames.model';
import { Metadata } from 'next';
import GrooveLine from '@/components/ui/GrooveLine';
import BreadCrumbServer from '@/components/BreadCrumbs/BreadCrumbsServer';
import { getFormattedDateStrYearFirst } from '@/libs/utils/dates';
import EditLinkButton from '@/components/admin/EditLinkButton/EditLinkButton';
import { getELangKey } from '@/libs/utils/getLanguage';
import TextUnderH1 from '@/components/TextUnderH1/TextUnderH1';
import { MChanTheme } from '@/models/channels/channelList.model';
import FillingImg from '@/components/ui/Images/FillingImage';
import SimilarChannels from '@/components/SimilarArticles/SimilarChannels';
import ArticleWrapper from '@/components/article/ArticleWrapper';
import { ELanguage } from '@/models/language.model';
import { DEFAULT_META_DATA } from '@/models/defaultMeta.model';
import { updateViewCount } from '@/controllers/viewUpdate.controller';
import { EUrlBaseParam, MAIN_URL } from '@/models/url/url.model';
import { EUrlAdminParam } from '@/models/url/urlAdmin.model';
import {
  CHANNEL_IMAGES,
  META_CHANNEL,
  NOT_FOUND_CHANNEL_LOGO,
  SIMILAR_CHANNELS_TITLE,
} from '@/models/channels/metaChannel.model';
import {
  CHANNEL_RESPONSIBILITIES,
  DB_ARRAY_SEPARATOR,
} from '@/models/channels/channel.model';
import { INFO_PANEL_TITLES } from '@/models/ui/infoPanel.model';
import { SAT_CHANNEL_LIST_IMAGES } from '@/models/channels/channelListMeta.model';
import { localeStringMaker } from '@/libs/utils/localeStringMaker';
import { getLanguageList } from '@/controllers/languageList.controller';

const BASE_URL = process.env.BASE_URL || MAIN_URL;

const {
  SLUG,
  LANG,
  KANAL,
  SAT_CHANNEL_LIST,
  CHANNELS_TV_PROGRAM,
  ONLINE_CHANNEL_LIST,
} = EUrlBaseParam;

export const revalidate = 43200; // 3600 * 12 invalidate cache every 12 hours

const { titleBefore, preText } = META_CHANNEL;
const { views: viewsTitle } = INFO_PANEL_TITLES;
const { genreImage } = SAT_CHANNEL_LIST_IMAGES;
const { noteTitle, getResponsibilityText } = CHANNEL_RESPONSIBILITIES;
const {
  channelLogo: { big: bigLogo },
} = CHANNEL_IMAGES;

export interface IChannelProps {
  params: { [key in EUrlBaseParam]: string };
}

export const generateMetadata = async ({
  params,
}: IChannelProps): Promise<Metadata> => {
  const slug = params[SLUG];
  const lang = getELangKey(params[LANG]);

  const { UA, EN, RU, ES, AR, DE, FR, IT } = ELanguage;

  const flyChannels = await getDBFlyChannel(slug, lang);
  if (!flyChannels) return DEFAULT_META_DATA[lang];

  const {
    title,
    description,
    keywords,
    slug: chan_slug,
    sat_title,
    frequency,
    polarization,
    beam,
    a_pid,
  } = flyChannels;

  const metaTitle = `${titleBefore[lang]} ${title} | ${sat_title} | ${frequency} ${polarization}`;
  const chanDescription = description || `${metaTitle} | ${beam} | ${a_pid}`;

  return {
    metadataBase: new URL(BASE_URL),
    title: metaTitle,
    description: chanDescription,
    keywords: keywords || chanDescription,
    alternates: {
      canonical: `/${lang}/${KANAL}/${chan_slug}`,
      languages: {
        en: `/${EN}/${KANAL}/${chan_slug}`,
        uk: `/${UA}/${KANAL}/${chan_slug}`,
        ru: `/${RU}/${KANAL}/${chan_slug}`,
        es: `/${ES}/${KANAL}/${chan_slug}`,
        ar: `/${AR}/${KANAL}/${chan_slug}`,
        de: `/${DE}/${KANAL}/${chan_slug}`,
        fr: `/${FR}/${KANAL}/${chan_slug}`,
        it: `/${IT}/${KANAL}/${chan_slug}`,
      },
    },
    openGraph: {
      ...DEFAULT_META_DATA.openGraph,
      title: metaTitle,
      description: description || metaTitle,
      url: `/${lang}/${KANAL}/${chan_slug}`,
      publishedTime: getFormattedDateStrYearFirst('', lang),
    },
  };
};

export default async function Page({ params }: IChannelProps) {
  const slug = params[SLUG];
  const lang = getELangKey(params[LANG]);

  const flyChannels = await getDBFlyChannel(slug, lang);

  if (!flyChannels) notFound();

  const {
    id,
    title,
    logo,
    text,
    theme,
    genre_description,
    theme_id,
    view,
    is_removed,
    sat_slug,
    sat_title,
    official_broadcast_url,
    vsetv,
    vipiko,
    is_radio,
    description,
    beam,
    a_pid,
    frequency,
    polarization,
    compress,
    sat_position,
    sr,
    fec,
    sid,
    v_pid,
  } = flyChannels;

  const genreImgSrc = theme_id ? MChanTheme.get(theme_id) : theme_id;

  // const similarArticles = await getSimilarArticles(
  //   chan_slug.split('-').slice(1).join('-')
  // );

  const currentDate = getFormattedDateStrYearFirst('', lang);

  updateViewCount(EDBTableTitles.FLY_CHANNELS, `${id}`, view);

  const metaTitle = `${titleBefore[lang]} ${title} | ${sat_title} | ${frequency} ${polarization}`;
  const chanDescription = description || `${metaTitle} | ${beam} | ${a_pid}`;
  const chanLogoUrl =
    !logo || logo === NOT_FOUND_CHANNEL_LOGO
      ? null
      : `${BASE_URL}/${bigLogo.pathFly}${logo}`;

  const aPidList = !a_pid ? [] : a_pid.split(DB_ARRAY_SEPARATOR);
  const languageObjects = getLanguageList(aPidList);

  const jsonLd = {
    '@context': 'https://schema.org/',
    '@type': is_radio ? 'RadioStation' : 'TVStation',
    name: title,
    description: chanDescription,
    ...(chanLogoUrl && {
      // Only include if logo exists
      image: {
        '@type': 'ImageObject',
        url: chanLogoUrl,
      },
    }),
    genre: theme, // e.g., "Entertainment", "News", etc.

    broadcastService: {
      '@type': 'BroadcastService',
      inLanguage: languageObjects.map((track) => track.value),
      broadcastLocation: {
        '@type': 'Place',
        name: `${sat_title} / ${sat_position}`,
      },
    },

    audio: languageObjects.map((track) => ({
      '@type': 'AudioObject',
      name: track.label,
      inLanguage: track.value,
    })),

    //Technical details of broadcasting the channel
    broadcastFrequency: {
      '@type': 'BroadcastFrequencySpecification',
      frequency: localeStringMaker(frequency), // GHz
      modulation: compress,
      polarization,
      symbolRate: sr,
      fec,
      serviceId: sid,
      videoPid: v_pid,
      audioPid: aPidList,
    },
  };

  return (
    <>
      <Suspense>
        <EditLinkButton
          href={`/${lang}/${EUrlAdminParam.BASE_PATH}/${EUrlAdminParam.CHANNELS_EDIT}/edit/${id}`}
        />
      </Suspense>

      <BreadCrumbServer
        lang={lang}
        breadCrumbList={[
          {
            href: `${SAT_CHANNEL_LIST}/${sat_slug}`,
            title: sat_title,
          },
          `${titleBefore[lang]} "${title}"`,
        ]}
      />
      <ArticleWrapper lang={lang}>
        <Title>
          {`${titleBefore[lang]} ≪${title}≫`}
          {logo && (
            <FillingValidImage
              className="bg-white px-2 py-1 shadow"
              image={{
                ...bigLogo,
                src: `${bigLogo.pathFly}${logo}`,
              }}
              defaultImage={bigLogo.defaultImage}
              alt={`${bigLogo.alt[lang]} "${title}"`}
            />
          )}
        </Title>

        {theme && (
          <TextUnderH1>
            <div className="flex flex-wrap items-center gap-2">
              <FillingImg
                width={genreImage.width}
                height={genreImage.height}
                alt={`${genreImage.altPre} "${theme}"`}
                src={`${genreImage.path}${genreImgSrc}`}
              />
              <b>{theme}:</b> {genre_description}
            </div>
          </TextUnderH1>
        )}

        {text ? (
          <div className="article-text">
            {is_removed === 1 && (
              <h2 style={{ color: '#ff0000' }}>{preText[lang]}</h2>
            )}
            <>
              <DangerHtml text={text} />
              <GrooveLine className="py-4" />
            </>
          </div>
        ) : null}

        {vipiko || vsetv ? (
          <TvScheduleLink
            lang={lang}
            title={title}
            href={`/${lang}/${CHANNELS_TV_PROGRAM}/${slug}/${currentDate}`}
          />
        ) : null}

        {official_broadcast_url && (
          <ChannelOnlineLink
            lang={lang}
            href={`/${lang}/${ONLINE_CHANNEL_LIST}/${slug}`}
            channelName={title}
          />
        )}

        <FlyChannelParams
          channelDBParams={flyChannels}
          lang={lang}
          languageObjects={languageObjects}
          aPidList={aPidList}
        />

        <NoteBlock noteTitle={noteTitle[lang]}>
          {getResponsibilityText(title)[lang]}
        </NoteBlock>

        <BottomInfoPanel
          lang={lang}
          items={[
            {
              name: viewsTitle[lang],
              value: localeStringMaker(view + 1),
            },
          ]}
        />
      </ArticleWrapper>

      <Suspense>
        <SimilarChannels
          lang={lang}
          chanelTitle={title}
          sectionCaption={`${SIMILAR_CHANNELS_TITLE[lang]} "${title}"`}
        />
      </Suspense>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
