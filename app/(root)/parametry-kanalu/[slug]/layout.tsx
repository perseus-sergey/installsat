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

export interface IChannelLayoutParams extends IChannelProps {
  children: React.ReactNode;
}
// TODO: Change Meta
export const generateMetadata = async ({
  params: { slug },
}: IChannelLayoutParams): Promise<Metadata> => {
  const sqlResult = await getDBChannel(slug);
  if (sqlResult instanceof Error) return defaultMetaData.ua;

  const { title, description, chan_slug } = sqlResult[0];

  return {
    title,
    description,
    keywords: description,
    openGraph: {
      ...defaultMetaData.openGraph,
      title,
      description,
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
