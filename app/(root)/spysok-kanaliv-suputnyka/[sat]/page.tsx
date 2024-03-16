import DangerHtmlUl from '@/components/DangerHtml/DangerHtml';
import EmptyData from '@/components/EmptyData/EmptyData';
import { Title } from '@/components/Title/Title';
import { getSatChannels } from '@/controllers/satChannelList.controller';
import { getChannelSatList } from '@/controllers/sidebar.controller';
import {
  META_SAT_CHANNEL_LIST,
  START_CONTENT,
} from '@/models/satChannelList.model';
import { EUrlBaseParam } from '@/models/url.model';
import type { Metadata } from 'next';
import Link from 'next/link';
import { IMG_PROPERTIES } from '@/models/ui.model';
import { getSmallSatLogoPath, imagePathValidate } from '@/libs/utilsServer';
import BlurImage from '@/components/BlurImage/BlurImage';

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
  // const newsArray = await getTransNewsForSingleDay(params.sat, singleDaySql);
  // if (newsArray instanceof Error)
  //   return <EmptyData description={newsArray.message} />;

  const h1ImagePath = imagePathValidate(
    `${IMG_PROPERTIES.h1SatImage.path}${satParams.logo}`,
    IMG_PROPERTIES.h1SatImage.defaultImage
  );

  return (
    <>
      <Title className="flex items-center justify-between gap-4">
        {`${satParams.title} - ${satParams.satPosition}`}
        {h1ImagePath ? (
          <BlurImage
            imgParentWidth={132}
            imgParentHeight={99}
            imgPath={h1ImagePath}
            alt={`Satellite logo for ${satParams.title}`}
          />
        ) : (
          <span className="text-8xl">
            {IMG_PROPERTIES.h1SatImage.alternativeSymbol}
          </span>
        )}
      </Title>
      <DangerHtmlUl tagName="p" text={START_CONTENT} />
      <ul>
        {satChannels.map((satChannel) => (
          <li key={satChannel.cpu}>
            <Link href={`/${EUrlBaseParam.CHANNEL_PARAMS}/${satChannel.cpu}`}>
              <BlurImage
                imgParentWidth={55}
                imgParentHeight={42}
                imgPath={
                  getSmallSatLogoPath(
                    `${IMG_PROPERTIES.channelLogo.small.path}${satChannel.logo}`,
                    IMG_PROPERTIES.channelLogo.small.defaultImage
                  ) || IMG_PROPERTIES.channelLogo.small.defaultImage
                }
                alt={satChannel.title}
              />
              {satChannel.title}
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}

// protected function createObjH1 () {
//   $this->h1 	= "Список каналов спутника \"{$this->title}\" - {$this->position}";
//   $this->imgAltH1 		= "Список телеканалов спутника {$this->title}";
//   if ($this->logo) {
//     $this->imgClassH1 	= "h1img_chan";
//     $this->imgPathH1 	= "Images/satellites/{$this->logo}";
//   } else {
//     $this->imgClassH1 	= "h1img";
//     $this->imgPathH1 	= "Images/satellite_7144.png";
//   }
// }
