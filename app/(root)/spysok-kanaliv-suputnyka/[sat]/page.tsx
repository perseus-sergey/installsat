import DangerHtmlUl from '@/components/DangerHtml/DangerHtml';
import EmptyData from '@/components/EmptyData/EmptyData';
import { Title } from '@/components/Title/Title';
import {
  getSatChannels,
  getGroupedChannelsAllSat,
} from '@/controllers/satChannelList.controller';
import { getChannelSatList } from '@/controllers/sidebar.controller';
import {
  META_SAT_CHANNEL_LIST,
  START_CONTENT,
} from '@/models/channelList.model';
import type { Metadata } from 'next';
import StartArticleSection from '@/components/StartArticleSection/StartArticleSection';
import SatChannelsTable from '@/components/SatChannelsTable/SatChannelsTable';
import FillingValidImage from '@/components/Images/FillingValidImage';
import { cache } from 'react';
import { defaultMetaData } from '@/models/ui.model';
import { EUrlBaseParam, SITE_BASE_URL } from '@/models/url.model';
import { getFormattedDateStr } from '@/libs/utils';

export interface IPageParams {
  params: { sat: string };
}

const satListResponse = await getChannelSatList();

const getCurrentSatParams = cache((satCpu: string) => {
  const satParams =
    satListResponse instanceof Error
      ? ''
      : satListResponse.find((sat) => sat.cpu === satCpu);

  return satParams
    ? {
        title: satParams.title,
        id: `${satParams.id}`,
        satPosition: satParams.position,
        logo: satParams.logo,
        slug: satParams.cpu,
      }
    : { title: '', id: '-1', satPosition: -1, logo: '', slug: '' };
});

export const generateMetadata = ({ params }: IPageParams): Metadata => {
  const { title, satPosition, slug } = getCurrentSatParams(params.sat);
  const satTitle = `${title} - ${satPosition}`;
  const metaTitle = `${META_SAT_CHANNEL_LIST.getTitle().ua} ${satTitle}`;
  const description = `${META_SAT_CHANNEL_LIST.getDescription().ua} ${satTitle}`;

  return {
    title: metaTitle,
    description,
    keywords: `${satTitle} ${META_SAT_CHANNEL_LIST.getKeywords('ua')}`,
    openGraph: {
      ...defaultMetaData.openGraph,
      title: metaTitle,
      description,
      url: `${SITE_BASE_URL}/${EUrlBaseParam.SAT_CHANNEL_LIST}/${slug}`,
      publishedTime: getFormattedDateStr(new Date()),
    },
  };
};

export async function generateStaticParams(): Promise<
  {
    sat: string;
  }[]
> {
  if (satListResponse instanceof Error) return [{ sat: '' }];

  return satListResponse.map((sat) => ({ sat: sat.cpu }));
}

export const dynamicParams = false;
export default async function Page({ params }: IPageParams) {
  const satParams = getCurrentSatParams(params.sat);
  const satChannels = await getSatChannels(satParams.id);

  if (satChannels instanceof Error)
    return <EmptyData description={satChannels.message} />;

  return (
    <>
      <Title style={{ borderBottom: '2px groove' }}>
        {
          META_SAT_CHANNEL_LIST.getH1(
            `${satParams.title} - ${satParams.satPosition}`
          ).ua
        }
        <FillingValidImage
          image={{
            ...META_SAT_CHANNEL_LIST.h1SatImage,
            src: `${META_SAT_CHANNEL_LIST.h1SatImage.path}${satParams.logo}`,
          }}
          defaultImage={META_SAT_CHANNEL_LIST.h1SatImage.defaultImage}
          alternativeImgString={
            META_SAT_CHANNEL_LIST.h1SatImage.alternativeString
          }
          alt={`${META_SAT_CHANNEL_LIST.h1SatImage.alt.ua} ${satParams.title}`}
          isBlur
        />
      </Title>
      <StartArticleSection>
        <DangerHtmlUl wrapperTagName="p" text={START_CONTENT} />
      </StartArticleSection>
      <SatChannelsTable satChannels={getGroupedChannelsAllSat([satChannels])} />
    </>
  );
}
