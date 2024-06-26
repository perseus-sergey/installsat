import {
  CHANNEL_LIST_ANCHOR_START,
  IOnlineChannelListModel,
  META_ONLINE_CHANNEL_LIST,
  ONLINE_CHANNEL_TOOLTIP_TITLES,
} from '@/models/channelList.model';
import styles from './channelList.module.scss';
import ChannelCardTooltip from '../ChannelCardTooltip/ChannelCardTooltip';
import { DEFAULT_LANG } from '@/models/ui.model';
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
} = META_ONLINE_CHANNEL_LIST;

const { channelLogo } = META_CHANNEL.images;

interface IProps {
  channels: [string, IOnlineChannelListModel[]][];
}

const GenreChannelList = ({ channels }: IProps) =>
  channels.map(([genreTitle, chanList]) => (
    <>
      <TitleH2List
        style={{ padding: '1rem' }}
        id={`${CHANNEL_LIST_ANCHOR_START}${chanList[0].genre_id}`}
        className="flex-col md:flex-row"
      >
        <GoUpLink />
        {genreTitle}
        <GenreImage
          tooltipText={genreTitle}
          genreMapPosition={chanList[0].genre_id}
          className={styles.genreImage}
        />
      </TitleH2List>
      <ul className={styles.channelList}>
        {chanList.map(
          ({
            chan_logo,
            chan_title,
            view,
            lan,
            chan_description,
            chan_id,
            chan_cpu,
          }) => (
            <li key={chan_id} className={styles.listItem}>
              <Link
                href={`${path}/${chan_cpu}`}
                aria-label={ariaLabel[DEFAULT_LANG]}
              >
                <ChannelCardTooltip
                  mainImage={{
                    ...channelLogo.big,
                    src: `${channelLogo.big.path}${chan_logo}`,
                  }}
                  mainDefaultImage={channelLogo.big.defaultImage}
                  mainAlternativeImgString={channelLogo.big.alternativeImgStr}
                  tooltipTextList={[
                    {
                      title: tName[DEFAULT_LANG],
                      description: chan_title,
                    },
                    {
                      title: tLanguage[DEFAULT_LANG],
                      description: lan,
                    },
                    view
                      ? {
                          title: tViews[DEFAULT_LANG],
                          description: view.toLocaleString('en-US'),
                        }
                      : { title: '', description: '' },
                    {
                      title: tDescription[DEFAULT_LANG],
                      description: cutText(chan_description, 100),
                    },
                  ]}
                >
                  <span className="text-center">{chan_title}</span>
                </ChannelCardTooltip>
              </Link>
            </li>
          )
        )}
      </ul>
    </>
  ));

export default GenreChannelList;
