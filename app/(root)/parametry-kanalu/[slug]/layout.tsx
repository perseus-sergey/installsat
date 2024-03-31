import type { Metadata } from 'next';
import React from 'react';
import { EUrlBaseParam, SITE_BASE_URL } from '@/models/url.model';
import { getFormattedDateStr } from '@/libs/utils';
import { EDBTableTitles, defaultMetaData } from '@/models/ui.model';
import { updateViewCount } from '@/controllers/articles.controller';
import SimilarArticles from '@/components/SimilarArticles/SimilarArticles';
import EmptyData from '@/components/EmptyData/EmptyData';
import { IChannelProps } from './page';
import {
  getDBChannel,
  getDBChannelSlugList,
  getSimilarChannels,
} from '@/controllers/channel.controller';
import SimilarChannel from '@/components/SimilarChannel/SimilarChannel';
import { META_CHANNEL } from '@/models/channel.model';

export interface IChannelLayoutParams extends IChannelProps {
  children: React.ReactNode;
}
// TODO: Change Meta

// private function setMetaTitle () {
//   if ($this->arrDbQuary[0]["cat_parent_id"] > 0){ 		// если есть подкатегория
//     $this->meta_title_befor = " | {$this->catParName} ";
//     $this->meta_title_add 	= "| {$this->arrDbQuary[0]['cat_name']}";
//   }
//   else { // если нет подкатегории
//     $this->meta_title_befor = " | {$this->arrDbQuary[0]["sa"]} {$this->arrDbQuary[0]["freq"]} {$this->arrDbQuary[0]["polar"]} ";
//     $this->meta_title_add 	= "| {$this->arrDbQuary[0]['cat_name']}";
//   }// if ($arr_pac ["cat_parent_id"] == 0)

// }

// private function setCanonical () {
//   if ((isset($this->arrDbQuary[0]['canonical']) AND $this->arrDbQuary[0]['canonical']) AND
//     $this->arrDbQuary[0]['cat_id'] == 23 OR			// Если канал находится в кодированной категории
//     $this->arrDbQuary[0]['cat_parent_id'] == 25 OR 	// или ЛЫБИДЬ
//     $this->arrDbQuary[0]['cat_parent_id'] == 2		// или UA TB
//      ){

//     $this->canonical = "<link rel='canonical' href='".SITE_ROOT.$this->arrDbQuary[0]['canonical']."' />";
//   }else{
//     $this->canonical = "<link rel='canonical' href='https://".$_SERVER['HTTP_HOST'].$_SERVER['REQUEST_URI']."' />";
//   }
// }

export const generateMetadata = async ({
  params: { slug },
}: IChannelLayoutParams): Promise<Metadata> => {
  const sqlResult = await getDBChannel(slug);
  if (sqlResult instanceof Error) return defaultMetaData.ua;

  const {
    title,
    description,
    chan_slug,
    cat_parent_id,
    cat_parent_title,
    cat_title,
    cat_id,
    sat_title,
    freq,
    polar,
    canonical,
  } = sqlResult[0];
  const metaTitle =
    cat_parent_id > 0
      ? `${META_CHANNEL.titleBefore.ua}${title} | ${cat_parent_title} | ${cat_title}`
      : `${META_CHANNEL.titleBefore.ua}${title} | ${sat_title} ${freq} ${polar} | ${cat_title}`;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [clearedCanonical, ..._] = canonical
    .replace(/\/$/, '')
    .split('/')
    .reverse();

  // if it is encrypted channel or category lybid || UA TV then canonical, else native url
  const addCanonical =
    canonical && (cat_id === 23 || cat_parent_id === 2 || cat_parent_id === 25)
      ? clearedCanonical
      : chan_slug;

  return {
    title: metaTitle,
    description: description || title,
    keywords: META_CHANNEL.keywordsBefore.ua + description,
    alternates: {
      canonical: `${SITE_BASE_URL}/${EUrlBaseParam.CHANNEL_PARAMS}/${addCanonical}`,
    },
    openGraph: {
      ...defaultMetaData.openGraph,
      title: metaTitle,
      description: description || title,
      url: `${SITE_BASE_URL}/${EUrlBaseParam.CHANNEL_PARAMS}/${chan_slug}`,
      publishedTime: getFormattedDateStr(),
    },
  };
};

export async function generateStaticParams(): Promise<
  {
    slug: string;
  }[]
> {
  const channelSlugList = await getDBChannelSlugList();

  if (channelSlugList instanceof Error) return [{ slug: '' }];

  return channelSlugList.map((channel) => ({ slug: channel.cpu }));
}

export const dynamicParams = false;

export default async function layout({
  children,
  params: { slug },
}: IChannelLayoutParams) {
  const sqlResult = await getDBChannel(slug);
  if (sqlResult instanceof Error)
    return <EmptyData description={sqlResult.message} />;

  const { id, title, logo, view } = sqlResult[0];

  const similarChannels = await getSimilarChannels(logo);
  if (similarChannels instanceof Error)
    return <EmptyData description={similarChannels.message} />;

  updateViewCount(EDBTableTitles.CHANNELS, id, view);

  return (
    <>
      <article className="article">{children}</article>

      {similarChannels.length ? (
        <SimilarArticles
          similarTitle={`${META_CHANNEL.similarArticlesTitle.ua}"${title}"`}
          similarArticlesMapped={similarChannels.map((chan) => (
            <li key={chan.cpu}>
              <SimilarChannel channelTitle={title} chanParams={chan} />
            </li>
          ))}
        />
      ) : null}
    </>
  );
}
