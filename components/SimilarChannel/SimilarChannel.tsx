import { ISimilarChannel } from '@/models/channel.model';
import Link from 'next/link';
import { EUrlBaseParam } from '@/models/url.model';

interface ISimilarChannelProps {
  chanParams: ISimilarChannel;
  channelTitle: string;
}

const SimilarChannel = ({ chanParams, channelTitle }: ISimilarChannelProps) => {
  const parentCatTitle =
    chanParams.cat_parent_id > 0 ? `${chanParams.cat_parent_title} | ` : '';

  const catLink =
    chanParams.cat_parent_id > 0
      ? `${chanParams.cat_parent_cpu}#${chanParams.cat_cpu}`
      : chanParams.cat_cpu;

  if (chanParams.compress === 5)
    return (
      <>
        <Link href={`/${EUrlBaseParam.ONLINE_CHANNEL_LIST}/${chanParams.cpu}`}>
          Дивитись канал {`"`}
          {channelTitle}
          {`"`} у прямому ефірі онлайн
        </Link>
      </>
    );

  if (chanParams.cat_id === 4 && chanParams.cat_title)
    return (
      <>
        <Link href={`/${EUrlBaseParam.SAT_CHANNEL_LIST}/${chanParams.sat_cpu}`}>
          Супутник: {chanParams.sat_title} {chanParams.sat_position}
        </Link>{' '}
        | Частота: {chanParams.freq}
      </>
    );

  if (chanParams.cat_title)
    return (
      <>
        Пакет:{' '}
        <Link href={`/${EUrlBaseParam.PACKAGE_CHANNEL_LIST}/${catLink}`}>
          {parentCatTitle}
          {chanParams.cat_title}
        </Link>
      </>
    );

  return null;
};

export default SimilarChannel;
