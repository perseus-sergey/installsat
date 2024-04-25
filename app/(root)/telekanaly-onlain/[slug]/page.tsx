import { Title } from '@/components/ui/Title/Title';
import { EUrlBaseParam } from '@/models/url.model';
import { Metadata } from 'next';
import { DEFAULT_META_DATA } from '@/models/ui.model';
import { getFormattedDateStr } from '@/libs/utils/utils';

const BASE_URL = process.env.BASE_URL || '';

// TODO: Change MetaData
// =================================================================
export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: 'maps',
  description: 'maps description',
  keywords: 'maps keywords',
  openGraph: {
    ...DEFAULT_META_DATA.openGraph,
    title: 'maps',
    description: 'maps description',
    url: `${BASE_URL}/${EUrlBaseParam.DELETE_COMMENT_SUBSCRIPTION}`,
    publishedTime: getFormattedDateStr(new Date()),
  },
};

interface IProps {
  params: { slug: string };
}

export default function Page({ params: { slug } }: IProps) {
  return (
    <>
      <article className="article">
        <Title>Канал &quot;{slug}&quot; у прямому ефірі онлайн.</Title>
      </article>
    </>
  );
}
