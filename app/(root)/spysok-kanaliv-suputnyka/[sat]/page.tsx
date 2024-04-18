import DangerHtmlUl from '@/components/ui/DangerHtml/DangerHtml';
import EmptyData from '@/components/errors/EmptyData/EmptyData';
import { Title } from '@/components/ui/Title/Title';
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
import StartArticleSection from '@/components/article/StartArticleSection/StartArticleSection';
import SatChannelsTable from '@/components/SatChannelsTable/SatChannelsTable';
import FillingValidImage from '@/components/Images/FillingValidImage';
import { cache } from 'react';
import { LANGUAGE, defaultMetaData } from '@/models/ui.model';
import { EUrlBaseParam } from '@/models/url.model';
import { getFormattedDateStr } from '@/libs/utils';

const { BASE_URL } = process.env;

const {
  getTitle,
  getDescription,
  getKeywords,
  getH1,
  images: { h1SatImage },
} = META_SAT_CHANNEL_LIST;

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
  const metaTitle = `${getTitle()[LANGUAGE]} ${satTitle}`;
  const description = `${getDescription()[LANGUAGE]} ${satTitle}`;

  return {
    title: metaTitle,
    description,
    keywords: `${satTitle} ${getKeywords(LANGUAGE)}`,
    openGraph: {
      ...defaultMetaData.openGraph,
      title: metaTitle,
      description,
      url: `${BASE_URL}/${EUrlBaseParam.SAT_CHANNEL_LIST}/${slug}`,
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
  const { id, title, logo, satPosition } = getCurrentSatParams(params.sat);

  const satChannels = await getSatChannels('', id);

  if (satChannels instanceof Error)
    return <EmptyData description={satChannels.message} />;

  return (
    <>
      <Title>
        {getH1(`${title} - ${satPosition}`)[LANGUAGE]}
        <FillingValidImage
          image={{
            ...h1SatImage,
            src: `${h1SatImage.path}${logo}`,
          }}
          defaultImage={h1SatImage.defaultImage}
          alternativeImgString={h1SatImage.alternativeString}
          alt={`${h1SatImage.alt[LANGUAGE]} ${title}`}
          isBlur
        />
      </Title>
      <StartArticleSection>
        <DangerHtmlUl wrapperTagName="p" text={START_CONTENT[LANGUAGE]} />
      </StartArticleSection>
      <SatChannelsTable
        isSingleSat
        satChannels={getGroupedChannelsAllSat([satChannels])}
      />
    </>
  );
}
