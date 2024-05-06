import {
  CHANNEL_LIST_ANCHOR_START,
  IOnlineChannelListModel,
  IPackageChannelListModel,
  META_PACKAGE_CHANNEL_LIST,
  ONLINE_CHANNEL_TOOLTIP_TITLES,
} from '@/models/channelList.model';
import styles from './channelList.module.scss';
import { TitleH2List } from '../ui/Titles/TitleH2List';
import GoUpLink from '../ui/GoUpLink/GoUpLink';
import { META_CHANNEL } from '@/models/channel.model';
import ChannelCardTooltip from '../ChannelCardTooltip/ChannelCardTooltip';
import { LANGUAGE } from '@/models/ui.model';
import Link from 'next/link';
import { cutText } from '@/libs/utils/utils';
import FillingValidImage from '../ui/Images/FillingValidImage';
import GenreImage from '../ui/Images/GenreImage/GenreImage';

const {
  name: tName,
  views: tViews,
  description: tDescription,
  language: tLanguage,
} = ONLINE_CHANNEL_TOOLTIP_TITLES;

const {
  linkChannel: { ariaLabel, path },
  images: { subCatImage },
} = META_PACKAGE_CHANNEL_LIST;

const { channelLogo } = META_CHANNEL.images;

interface IProps {
  channels: [string, (IPackageChannelListModel | IOnlineChannelListModel)[]][];
}

const PackageChannelList = ({ channels }: IProps) =>
  channels.map(([genreTitle, chanList]) => (
    <>
      <TitleH2List
        style={{ padding: '1rem' }}
        id={`${CHANNEL_LIST_ANCHOR_START}${chanList[0].genre_id}`}
        className="flex-col md:flex-row"
      >
        <GoUpLink />
        {genreTitle}
        {'genre_logo' in chanList[0] ? (
          <FillingValidImage
            image={{
              width: subCatImage.width,
              height: subCatImage.height,
              src: `${subCatImage.path}${chanList[0].genre_logo}`,
            }}
            alt={`${subCatImage.altPre[LANGUAGE]} ${genreTitle}`}
            alternativeImgString={subCatImage.alternativeImgStr}
          />
        ) : (
          <GenreImage
            tooltipText={genreTitle}
            genreMapPosition={chanList[0].genre_id}
            className={styles.genreImage}
          />
        )}
      </TitleH2List>
      <ul className={styles.channelList}>
        {chanList.map((channel) => (
          <li key={channel.chan_id} className={styles.listItem}>
            <Link
              href={`${path}/${channel.chan_cpu}`}
              aria-label={ariaLabel[LANGUAGE]}
            >
              <ChannelCardTooltip
                mainImage={{
                  ...channelLogo.big,
                  src: `${channelLogo.big.path}${channel.chan_logo}`,
                }}
                mainDefaultImage={channelLogo.big.defaultImage}
                mainAlternativeImgString={channelLogo.big.alternativeImgStr}
                tooltipTextList={[
                  {
                    title: tName[LANGUAGE],
                    description: channel.chan_title,
                  },
                  'view' in channel
                    ? {
                        title: tViews[LANGUAGE],
                        description: channel.view.toLocaleString('en-US'),
                      }
                    : { title: '', description: '' },
                  {
                    title: tLanguage[LANGUAGE],
                    description: channel.lan,
                  },
                  {
                    title: tDescription[LANGUAGE],
                    description: cutText(channel.chan_description, 150),
                  },
                ]}
              >
                <span className="text-center">{channel.chan_title}</span>
              </ChannelCardTooltip>
            </Link>
          </li>
        ))}
      </ul>
    </>
  ));

export default PackageChannelList;
