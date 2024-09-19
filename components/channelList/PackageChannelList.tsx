import {
  CHANNEL_LIST_ANCHOR_START,
  IOnlineChannelListModel,
  IPackageChannelListModel,
  ONLINE_CHANNEL_TOOLTIP_TITLES,
  PACKAGE_CHANNEL_LIST_DATA,
  PACKAGE_CHANNEL_LIST_IMAGES,
} from '@/models/channelList.model';
import { TitleH2List } from '../ui/Titles/TitleH2List';
import GoUpLink from '../ui/GoUpLink/GoUpLink';
import { CHANNEL_IMAGES } from '@/models/channel.model';
import ChannelCardTooltip from '../ChannelCardTooltip/ChannelCardTooltip';
import { ELanguage } from '@/models/ui.model';
import { cutText } from '@/libs/utils/utils';
import FillingValidImage from '../ui/Images/FillingValidImage';
import GenreImage from '../ui/Images/GenreImage/GenreImage';
import EmptyData from '../errors/EmptyData/EmptyData';
import { EUrlBaseParam } from '@/models/url.model';
import SeoLink from '../ui/SeoLink/SeoLink';

const {
  name: tName,
  views: tViews,
  description: tDescription,
  language: tLanguage,
} = ONLINE_CHANNEL_TOOLTIP_TITLES;

const { getPriceString } = PACKAGE_CHANNEL_LIST_DATA;
const {
  subCatImage: { width, height, path, defaultImgSrc, altPre },
} = PACKAGE_CHANNEL_LIST_IMAGES;

const { channelLogo } = CHANNEL_IMAGES;

interface IProps {
  channels: [string, (IPackageChannelListModel | IOnlineChannelListModel)[]][];
  pathToChannelDetails: EUrlBaseParam;
  lang: ELanguage;
  todayStr?: string;
}

const PackageChannelList = ({
  channels,
  pathToChannelDetails,
  lang,
  todayStr = '',
}: IProps) =>
  channels.length > 0 ? (
    channels.map(([genreTitle, chanList]) => (
      <>
        <TitleH2List
          style={{ padding: '1rem' }}
          id={`${CHANNEL_LIST_ANCHOR_START}${chanList[0].genre_id}`}
          className="flex-col md:flex-row"
        >
          <GoUpLink lang={lang} />

          {genreTitle}

          {'genre_logo' in chanList[0] ? (
            <FillingValidImage
              image={{
                width,
                height,
                src: `${path}${chanList[0].genre_logo}`,
              }}
              defaultImage={{ src: defaultImgSrc, width, height }}
              alt={`${altPre[lang]} ${genreTitle}`}
            />
          ) : (
            <GenreImage
              lang={lang}
              tooltipText={chanList[0].genre_description}
              genreMapPosition={chanList[0].genre_id}
              className="p-4 leading-none border border-stone-400 rounded-full bg-blue-50"
            />
          )}
        </TitleH2List>
        {'price' in chanList[0] && chanList[0].price && (
          <p className="thhead_small">
            {getPriceString(chanList[0].price)[lang]}
          </p>
        )}
        <ul
          className="flex flex-wrap justify-center gap-4 md:p-8 p-4"
          style={{
            borderTop: '2px #cccccc groove',
            borderBottom: '2px #cccccc groove',
          }}
        >
          {chanList.map((channel) => {
            const chanTitle = channel.chan_title;

            return (
              <li
                key={channel.chan_id}
                className="w-min flex flex-col items-center justify-center border border-solid border-white bg-white overflow-hidden shadow-md"
              >
                <SeoLink
                  href={`/${lang}/${pathToChannelDetails}/${channel.chan_cpu}${todayStr ? `/${todayStr}` : ''}`}
                  title={
                    lang === ELanguage.UA
                      ? `Перейти до перегляду детальних параметрів каналу "${chanTitle}"`
                      : `Go to view detailed parameters of "${chanTitle}" channel`
                  }
                >
                  <ChannelCardTooltip
                    mainImage={{
                      ...channelLogo.big,
                      src: `${channelLogo.big.path}${channel.chan_logo}`,
                    }}
                    mainDefaultImage={channelLogo.big.defaultImage}
                    tooltipTextList={[
                      {
                        title: tName[lang],
                        description: chanTitle,
                      },
                      'view' in channel
                        ? {
                            title: tViews[lang],
                            description: channel.view.toLocaleString('en-US'),
                          }
                        : { title: '', description: '' },
                      {
                        title: tLanguage[lang],
                        description: channel.lan,
                      },
                      {
                        title: tDescription[lang],
                        description: cutText(channel.chan_description, 150),
                      },
                    ]}
                  >
                    <span className="text-center">{chanTitle}</span>
                  </ChannelCardTooltip>
                </SeoLink>
              </li>
            );
          })}
          {'genre_h1' in chanList[0] && chanList[0].genre_h1 && (
            <p className="thhead_small">{chanList[0].genre_h1}</p>
          )}
        </ul>
      </>
    ))
  ) : (
    <EmptyData lang={lang} />
  );

export default PackageChannelList;
