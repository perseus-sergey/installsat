import { ISimilarChannel, META_CHANNEL } from '@/models/channel.model';
import Link from 'next/link';
import { EUrlBaseParam } from '@/models/url.model';
import { DEFAULT_LANG } from '@/models/ui.model';

interface ISimilarChannelProps {
  chanParams: ISimilarChannel;
  channelTitle: string;
}

const SimilarChannel = ({
  chanParams: {
    cat_parent_title,
    cat_parent_id,
    cat_id,
    cat_title,
    cat_cpu,
    cat_parent_cpu,
    sat_cpu,
    sat_position,
    sat_title,
    freq,
    compress,
    cpu,
  },
  channelTitle,
}: ISimilarChannelProps) => {
  const {
    getOnlineChannelTitle,
    getFrequencyTitle,
    getSatChannelTitle,
    packageTitle,
  } = META_CHANNEL.similar.channels;

  const parentCatTitle = cat_parent_id > 0 ? `${cat_parent_title} | ` : '';

  const catLink = cat_parent_id > 0 ? `${cat_parent_cpu}#${cat_cpu}` : cat_cpu;

  if (compress === 5)
    return (
      <>
        <Link href={`/${EUrlBaseParam.ONLINE_CHANNEL_LIST}/${cpu}`}>
          {getOnlineChannelTitle(channelTitle)[DEFAULT_LANG]}
        </Link>
      </>
    );

  if (cat_id === 4 && cat_title)
    return (
      <>
        <Link href={`/${EUrlBaseParam.SAT_CHANNEL_LIST}/${sat_cpu}`}>
          {getSatChannelTitle(sat_title, sat_position)[DEFAULT_LANG]}
        </Link>{' '}
        {getFrequencyTitle(freq)[DEFAULT_LANG]}
      </>
    );

  if (cat_title)
    return (
      <>
        {packageTitle[DEFAULT_LANG]}{' '}
        <Link href={`/${EUrlBaseParam.PACKAGE_CHANNEL_LIST}/${catLink}`}>
          {parentCatTitle}
          {cat_title}
        </Link>
      </>
    );

  return null;
};

export default SimilarChannel;
