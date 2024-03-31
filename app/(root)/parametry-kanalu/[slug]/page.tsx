import EmptyData from '@/components/EmptyData/EmptyData';
import FillingValidImage from '@/components/Images/FillingValidImage';
import { Title } from '@/components/Title/Title';
import { getDBChannel } from '@/controllers/channel.controller';
import { META_CHANNEL } from '@/models/channel.model';

export interface IChannelProps {
  params: { slug: string };
}

export default async function Page({ params: { slug } }: IChannelProps) {
  const sqlResult = await getDBChannel(slug);
  if (sqlResult instanceof Error)
    return <EmptyData description={sqlResult.message} />;

  const { title, logo } = sqlResult[0];

  const {
    images: {
      channelLogo: { big: bigLogo },
    },
    titleBefore,
  } = META_CHANNEL;

  return (
    <>
      <Title>
        {`${titleBefore.ua} "${title}"`}
        <FillingValidImage
          image={{
            ...bigLogo,
            src: `${bigLogo.path}${logo}`,
          }}
          defaultImage={bigLogo.defaultImage}
          alternativeImgString={bigLogo.alternativeImgStr}
          alt={`${bigLogo.alt.ua} "${title}"`}
          isBlur
        />
      </Title>
    </>
  );
}
