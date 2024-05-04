import {
  IOnlineChannelListModel,
  META_ONLINE_CHANNEL_LIST,
  ONLINE_CHANNEL_TOOLTIP_TITLES,
} from '@/models/channelList.model';
import styles from './OnlineChannelList.module.scss';
import ChannelCardTooltip from '../ChannelCardTooltip/ChannelCardTooltip';
import { LANGUAGE } from '@/models/ui.model';
import { cutText } from '@/libs/utils/utils';
import { META_CHANNEL } from '@/models/channel.model';
import { TitleH2List } from '../ui/Titles/TitleH2List';
import GoUpLink from '../ui/GoUpLink/GoUpLink';
import Link from 'next/link';
import GenreImage from '../ui/Images/GenreImage/GenreImage';

const {
  name: tName,
  description: tDescription,
  views: tViews,
  language: tLanguage,
} = ONLINE_CHANNEL_TOOLTIP_TITLES;

const {
  linkChannel: { ariaLabel, path },
  fieldsetFilters: {
    anchorLink: { hrefStart },
  },
} = META_ONLINE_CHANNEL_LIST;

const { channelLogo } = META_CHANNEL.images;

interface IOnlineChannelListProps {
  onlineChannels: [string, IOnlineChannelListModel[]][];
}

const OnlineChannelList = ({ onlineChannels }: IOnlineChannelListProps) =>
  onlineChannels.map(([genreTitle, chanList]) => (
    <>
      <TitleH2List
        style={{ padding: '1rem' }}
        id={`${hrefStart}${chanList[0].tema}`}
        className="flex-col md:flex-row"
      >
        <GoUpLink />
        {genreTitle}
        <GenreImage
          tooltipText={genreTitle}
          genreMapPosition={chanList[0].tema}
          className={styles.genreImage}
        />
      </TitleH2List>
      <ul className={styles.OnlineChannelList}>
        {chanList.map(({ logo, title, view, lan, description, id, cpu }) => (
          <li key={id} className={styles.listItem}>
            <Link href={`${path}/${cpu}`} aria-label={ariaLabel[LANGUAGE]}>
              <ChannelCardTooltip
                mainImage={{
                  ...channelLogo.big,
                  src: `${channelLogo.big.path}${logo}`,
                }}
                mainDefaultImage={channelLogo.big.defaultImage}
                mainAlternativeImgString={channelLogo.big.alternativeImgStr}
                tooltipTextList={[
                  {
                    title: tName[LANGUAGE],
                    description: title,
                  },
                  {
                    title: tLanguage[LANGUAGE],
                    description: lan,
                  },
                  {
                    title: tViews[LANGUAGE],
                    description: view.toLocaleString('en-US'),
                  },
                  {
                    title: tDescription[LANGUAGE],
                    description: cutText(description, 100),
                  },
                ]}
              >
                <span className="text-center">{title}</span>
              </ChannelCardTooltip>
            </Link>
          </li>
        ))}
      </ul>
    </>
  ));

export default OnlineChannelList;
