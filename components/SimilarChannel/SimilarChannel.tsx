import { ISimilarChannel, META_CHANNEL } from '@/models/channel.model';
import Link from 'next/link';
import { EUrlBaseParam } from '@/models/url.model';
import { ELanguage } from '@/models/ui.model';
import { CHANNEL_LIST_ANCHOR_START } from '@/models/channelList.model';

interface ISimilarChannelProps {
  chanParams: ISimilarChannel;
  channelTitle: string;
  lang: ELanguage;
}

const SimilarChannel = ({
  chanParams: {
    cat_parent_title,
    cat_parent_id,
    cat_id,
    cat_title,
    cat_slug,
    cat_parent_cpu,
    sat_cpu,
    sat_position,
    sat_title,
    freq,
    compress,
    cpu,
  },
  channelTitle,
  lang,
}: ISimilarChannelProps) => {
  const {
    getOnlineChannelTitle,
    getFrequencyTitle,
    getSatChannelTitle,
    packageTitle,
  } = META_CHANNEL.similar.channels;

  const parentCatTitle = cat_parent_id > 0 ? `${cat_parent_title} | ` : '';

  const catLink =
    cat_parent_id > 0
      ? `${cat_parent_cpu}#${CHANNEL_LIST_ANCHOR_START}${cat_id}`
      : cat_slug;

  if (compress === 5)
    return (
      <>
        <Link href={`/${lang}/${EUrlBaseParam.ONLINE_CHANNEL_LIST}/${cpu}`}>
          {getOnlineChannelTitle(channelTitle)[lang]}
        </Link>
      </>
    );

  if (cat_id === 4 && cat_title)
    return (
      <>
        <Link href={`/${lang}/${EUrlBaseParam.SAT_CHANNEL_LIST}/${sat_cpu}`}>
          {getSatChannelTitle(sat_title, sat_position)[lang]}
        </Link>{' '}
        {getFrequencyTitle(freq)[lang]}
      </>
    );

  if (cat_title)
    return (
      <>
        {packageTitle[lang]}{' '}
        <Link
          href={`/${lang}/${EUrlBaseParam.PACKAGE_CHANNEL_LIST}/${catLink}`}
        >
          {parentCatTitle}
          {cat_title}
        </Link>
      </>
    );

  return null;
};

export default SimilarChannel;
