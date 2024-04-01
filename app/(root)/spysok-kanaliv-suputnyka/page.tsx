import DangerHtmlUl from '@/components/DangerHtml/DangerHtml';
import EmptyData from '@/components/EmptyData/EmptyData';
import { Title } from '@/components/Title/Title';
import {
  getSatChannels,
  getGroupedChannelsAllSat,
} from '@/controllers/satChannelList.controller';
import {
  META_ALL_SAT_CHANNEL_LIST,
  START_CONTENT,
} from '@/models/channelList.model';
import type { Metadata } from 'next';
import StartArticleSection from '@/components/StartArticleSection/StartArticleSection';
import SatChannelsTable from '@/components/SatChannelsTable/SatChannelsTable';
import FillingImg from '@/components/Images/FillingImage';
import Link from 'next/link';
import Fieldset from '@/components/Fieldset/Fieldset';
import { defaultMetaData } from '@/models/ui.model';
import { getFormattedDateStr } from '@/libs/utils';
import { EUrlBaseParam, SITE_BASE_URL } from '@/models/url.model';

export const metadata: Metadata = {
  title: META_ALL_SAT_CHANNEL_LIST.getTitle().ua,
  description: META_ALL_SAT_CHANNEL_LIST.getDescription().ua,
  keywords: META_ALL_SAT_CHANNEL_LIST.getKeywords().ua,
  openGraph: {
    ...defaultMetaData.openGraph,
    title: META_ALL_SAT_CHANNEL_LIST.getTitle().ua,
    description: META_ALL_SAT_CHANNEL_LIST.getDescription().ua,
    url: `${SITE_BASE_URL}/${EUrlBaseParam.SAT_CHANNEL_LIST}`,
    publishedTime: getFormattedDateStr(new Date()),
  },
};

export default async function Page() {
  const satChannels = await getSatChannels();

  if (satChannels instanceof Error)
    return <EmptyData description={satChannels.message} />;

  const groupedChannelsAllSat = getGroupedChannelsAllSat([satChannels]);

  const satLinks = groupedChannelsAllSat.map((sat) => ({
    title: `${sat[0][0].sat_title} - ${sat[0][0].sat_position}`,
    slug: sat[0][0].sat_slug,
  }));

  return (
    <>
      <Title>
        {META_ALL_SAT_CHANNEL_LIST.getH1().ua}
        <FillingImg
          src={META_ALL_SAT_CHANNEL_LIST.image.h1ImageParams.path}
          alt={META_ALL_SAT_CHANNEL_LIST.image.h1ImageParams.alt.ua}
          width={META_ALL_SAT_CHANNEL_LIST.image.h1ImageParams.width}
          height={META_ALL_SAT_CHANNEL_LIST.image.h1ImageParams.height}
        />
      </Title>
      <Fieldset legendText={META_ALL_SAT_CHANNEL_LIST.anchors.legendTitle.ua}>
        <nav className="text-center text-xl">
          <ul>
            {satLinks.map((satLink) => (
              <li key={satLink.slug}>
                <Link
                  href={`#${satLink.slug}`}
                  className="text-indigo-800 hover:text-red-500"
                >
                  {satLink.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </Fieldset>
      <StartArticleSection>
        <DangerHtmlUl wrapperTagName="p" text={START_CONTENT} />
      </StartArticleSection>
      <SatChannelsTable satChannels={groupedChannelsAllSat} />
    </>
  );
}
