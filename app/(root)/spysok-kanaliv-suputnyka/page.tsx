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
} from '@/models/satChannelList.model';
import type { Metadata } from 'next';
import StartArticleSection from '@/components/StartArticleSection/StartArticleSection';
import SatChannelsTable from '@/components/SatChannelsTable/SatChannelsTable';
import FillingImg from '@/components/Images/FillingImage';
import Link from 'next/link';

export const metadata: Metadata = {
  title: META_ALL_SAT_CHANNEL_LIST.getTitle().ua,
  description: META_ALL_SAT_CHANNEL_LIST.getDescription().ua,
  keywords: META_ALL_SAT_CHANNEL_LIST.getKeywords().ua,
};

export default async function SatNewsDatePage() {
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
      <Title
        className="flex items-center justify-around gap-4 flex-wrap"
        style={{ borderBottom: '2px groove' }}
      >
        {META_ALL_SAT_CHANNEL_LIST.getH1().ua}
        <FillingImg
          src={META_ALL_SAT_CHANNEL_LIST.h1ImageParams.path}
          alt={META_ALL_SAT_CHANNEL_LIST.h1ImageParams.alt.ua}
          width={META_ALL_SAT_CHANNEL_LIST.h1ImageParams.width}
          height={META_ALL_SAT_CHANNEL_LIST.h1ImageParams.height}
        />
      </Title>
      <ul>
        {satLinks.map((satLink) => (
          <li key={satLink.slug}>
            <Link href={`#${satLink.slug}`}>{satLink.title}</Link>
          </li>
        ))}
      </ul>
      <StartArticleSection>
        <DangerHtmlUl wrapperTagName="p" text={START_CONTENT} />
      </StartArticleSection>
      <SatChannelsTable satChannels={groupedChannelsAllSat} />
    </>
  );
}
