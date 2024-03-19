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
} from '@/models/satChannelList.model';
import type { Metadata } from 'next';
import { imagePathValidate } from '@/libs/utilsServer';
import StartArticleSection from '@/components/StartArticleSection/StartArticleSection';
import SatChannelsTable from '@/components/SatChannelsTable/SatChannelsTable';
import FillingImg from '@/components/Images/FillingImage';

export interface ISatChannelListParams {
  params: { sat: string };
}

const satListResponse = await getChannelSatList();

const getCurrentSatParams = (satCpu: string) => {
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
      }
    : { title: '', id: '-1', satPosition: -1, logo: '' };
};

export const generateMetadata = ({
  params,
}: ISatChannelListParams): Metadata => {
  const satParams = getCurrentSatParams(params.sat);
  const satTitle = `${satParams.title} - ${satParams.satPosition}`;

  return {
    title: `${META_SAT_CHANNEL_LIST.getTitle().ua} ${satTitle}`,
    description: `${META_SAT_CHANNEL_LIST.getDescription().ua} ${satTitle}`,
    keywords: `${satTitle} ${META_SAT_CHANNEL_LIST.getKeywords('ua')}`,
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
export default async function SatNewsDatePage({
  params,
}: ISatChannelListParams) {
  const satParams = getCurrentSatParams(params.sat);
  const satChannels = await getSatChannels(satParams.id);

  if (satChannels instanceof Error)
    return <EmptyData description={satChannels.message} />;

  const h1ImagePath = imagePathValidate(
    `${META_SAT_CHANNEL_LIST.h1SatImage.path}${satParams.logo}`,
    META_SAT_CHANNEL_LIST.h1SatImage.defaultImage
  );

  return (
    <>
      <Title
        className="flex items-center justify-around gap-4 flex-wrap"
        style={{ borderBottom: '2px groove' }}
      >
        {
          META_SAT_CHANNEL_LIST.getH1(
            `${satParams.title} - ${satParams.satPosition}`
          ).ua
        }
        {h1ImagePath ? (
          <FillingImg
            width={META_SAT_CHANNEL_LIST.h1SatImage.width}
            height={META_SAT_CHANNEL_LIST.h1SatImage.height}
            src={h1ImagePath}
            alt={`${META_SAT_CHANNEL_LIST.h1SatImage.alt.ua} ${satParams.title}`}
            isBlur
          />
        ) : (
          <span className="text-8xl">
            {META_SAT_CHANNEL_LIST.h1SatImage.alternativeSymbol}
          </span>
        )}
      </Title>
      <StartArticleSection>
        <DangerHtmlUl wrapperTagName="p" text={START_CONTENT} />
      </StartArticleSection>
      <SatChannelsTable satChannels={getGroupedChannelsAllSat([satChannels])} />
    </>
  );
}
