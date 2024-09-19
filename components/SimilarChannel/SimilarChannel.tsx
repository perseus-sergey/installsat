import { IFlyChannel, SIMILAR } from '@/models/channel.model';
// import Link from 'next/link';
import { EUrlBaseParam } from '@/models/url.model';
import { ELanguage } from '@/models/ui.model';
// import { CHANNEL_LIST_ANCHOR_START } from '@/models/channelList.model';
import SeoLink from '../ui/SeoLink/SeoLink';

// interface ISimilarChannelProps {
//   chanParams: ISimilarChannel;
//   channelTitle: string;
//   lang: ELanguage;
// }

interface ISimilarFlyChannelProps {
  chanParams: IFlyChannel;
  lang: ELanguage;
  chanName: string;
}

// const SimilarChannel = ({
//   chanParams: {
//     cat_parent_title,
//     cat_parent_id,
//     cat_id,
//     cat_title,
//     cat_slug,
//     cat_parent_cpu,
//     sat_cpu,
//     sat_position,
//     sat_title,
//     freq,
//     compress,
//     cpu,
//   },
//   channelTitle,
//   lang,
// }: ISimilarChannelProps) => {
//   const {
//     getOnlineChannelTitle,
//     getFrequencyTitle,
//     getSatChannelTitle,
//     packageTitle,
//   } = SIMILAR.channels;

//   const parentCatTitle = cat_parent_id > 0 ? `${cat_parent_title} | ` : '';

//   const catLink =
//     cat_parent_id > 0
//       ? `${cat_parent_cpu}#${CHANNEL_LIST_ANCHOR_START}${cat_id}`
//       : cat_slug;

//   if (compress === 5)
//     return (
//       <>
//         <Link href={`/${lang}/${EUrlBaseParam.ONLINE_CHANNEL_LIST}/${cpu}`}>
//           {getOnlineChannelTitle(channelTitle)[lang]}
//         </Link>
//       </>
//     );

//   if (cat_id === 4 && cat_title)
//     return (
//       <>
//         <Link href={`/${lang}/${EUrlBaseParam.SAT_CHANNEL_LIST}/${sat_cpu}`}>
//           {getSatChannelTitle(sat_title, sat_position)[lang]}
//         </Link>{' '}
//         {getFrequencyTitle(freq)[lang]}
//       </>
//     );

//   if (cat_title)
//     return (
//       <>
//         {packageTitle[lang]}{' '}
//         <Link
//           href={`/${lang}/${EUrlBaseParam.PACKAGE_CHANNEL_LIST}/${catLink}`}
//         >
//           {parentCatTitle}
//           {cat_title}
//         </Link>
//       </>
//     );

//   return null;
// };

export const SimilarFlyChannel = ({
  chanParams: {
    // title,
    sat_slug,
    sat_position,
    sat_title,
    frequency,
    // compress,
    // slug,
    package_id,
    package_title,
    package_slug,
    // official_broadcast_url,
  },
  lang,
  chanName,
}: ISimilarFlyChannelProps) => {
  const { getFrequencyTitle, getSatChannelTitle, packageTitle } =
    SIMILAR.channels;

  // if (official_broadcast_url)
  //   return (
  //     <>
  //       <Link href={`/${lang}/${EUrlBaseParam.ONLINE_CHANNEL_LIST}/${slug}`}>
  //         {getOnlineChannelTitle(title)[lang]}
  //       </Link>
  //     </>
  //   );

  if (package_id > 2)
    return (
      <>
        {packageTitle[lang]}{' '}
        <SeoLink
          href={`/${lang}/${EUrlBaseParam.PACKAGE_CHANNEL_LIST}/${package_slug}`}
          title={
            lang === ELanguage.UA
              ? `Дивитись параметри каналу "${chanName}" в пакеті "${package_title}"`
              : `Watch "${chanName}" channel parameters on satellite "${package_title}"`
          }
        >
          {package_title}
        </SeoLink>
      </>
    );

  return (
    <>
      <SeoLink
        href={`/${lang}/${EUrlBaseParam.SAT_CHANNEL_LIST}/${sat_slug}`}
        title={
          lang === ELanguage.UA
            ? `Дивитись параметри каналу "${chanName}" на супутнику "${sat_title} ${sat_position}"`
            : `Watch "${chanName}" channel parameters on satellite "${sat_title} ${sat_position}"`
        }
      >
        {getSatChannelTitle(sat_title, sat_position)[lang]}
      </SeoLink>{' '}
      {getFrequencyTitle(frequency)[lang]}
    </>
  );
};

// export default SimilarChannel;
