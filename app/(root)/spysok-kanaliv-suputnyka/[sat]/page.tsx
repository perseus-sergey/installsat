import { Title } from '@/components/Title/Title';
import { getChannelSatList } from '@/controllers/sidebar.controller';
import { META_SAT_CHANNEL_LIST } from '@/models/satChannelList.model';
import type { Metadata } from 'next';

export interface ISatChannelListParams {
  params: { sat: string };
}

const satListResponse = await getChannelSatList();

const getCurrentSatTitle = (satCpu: string) => {
  const satTitle =
    satListResponse instanceof Error
      ? ''
      : satListResponse.find((sat) => sat.cpu === satCpu);

  return satTitle ? satTitle.title : '';
};

export const generateMetadata = ({
  params,
}: ISatChannelListParams): Metadata => {
  const satTitle = getCurrentSatTitle(params.sat);

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
  const satTitle = getCurrentSatTitle(params.sat);

  // const newsArray = await getTransNewsForSingleDay(params.sat, singleDaySql);
  // if (newsArray instanceof Error)
  //   return <EmptyData description={newsArray.message} />;

  return <Title>{satTitle}</Title>;
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
