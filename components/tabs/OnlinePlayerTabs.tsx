'use client';

// import Video from 'next-video';
import FakePlayer from '../online/FakePlayer/FakePlayer';
import BaseButton from '../ui/buttons/BaseButton/BaseButton';
import React, { useState } from 'react';
import {
  IOnlineChannel,
  ONLINE_TABS,
  YOUTUBE_PLAYER,
} from '../../models/channel.model';
import { ELanguage } from '@/models/ui.model';

const {
  width: yWidth,
  height: yHeight,
  embedPath: yEmbedPath,
} = YOUTUBE_PLAYER;

const {
  button: { getAriaLabel, getTitle },
} = ONLINE_TABS;

interface IOnlinePlayerTabsProps {
  channelData: IOnlineChannel;
  lang: ELanguage;
}

const OnlinePlayerTabs = ({
  channelData: { potok, tvforsite_net, url, title },
  lang,
}: IOnlinePlayerTabsProps) => {
  const [playerN, setPlayerN] = useState(0);

  const streams = [
    {
      stream: potok,
      player: ONLINE_PLAYERS.MAIN_STREAM(potok, title, lang),
    },
    {
      stream: tvforsite_net,
      player: ONLINE_PLAYERS.TV_FOR_SITE_NET(tvforsite_net, title, lang),
    },
    // {
    //   stream: other_stream,
    //   player: ONLINE_PLAYERS.OTHER_STREAM(other_stream),
    // },
  ];
  const numberOfTabs = streams.reduce(
    (acc, curr) => (curr.stream ? acc + 1 : acc),
    0
  );

  return (
    <div className="py-4 px-0">
      {numberOfTabs > 0 ? (
        <>
          {numberOfTabs > 1 ? (
            <>
              <ul className="flex">
                {streams.map(
                  ({ stream }, i) =>
                    stream && (
                      <li key={i}>
                        <BaseButton
                          ariaLabel={getAriaLabel(i + 1)[lang]}
                          className={`rounded-[2px_15px_0_0] max-w-32 w-fit flex items-center py-1 px-4 text-stone-600 cursor-pointer bg-stone-50 border border-solid border-stone-400 hover:border-orange-200 hover:bg-yellow-100 hover:text-orange-600 
                              ${playerN === i ? `pointer-events-none text-white !bg-indigo-900 border-b-rose-500` : ''}`}
                          onClick={() => setPlayerN(i)}
                        >
                          {getTitle(i + 1)[lang]}
                        </BaseButton>
                      </li>
                    )
                )}
              </ul>
              <div>{streams[playerN].player}</div>
            </>
          ) : (
            streams.map(
              ({ stream, player }, i) =>
                stream && <React.Fragment key={i}>{player}</React.Fragment>
            )
          )}
        </>
      ) : (
        <FakePlayer lang={lang} chanTitle={title} url={url} />
      )}
    </div>
  );
};

export default OnlinePlayerTabs;

const ONLINE_PLAYERS = {
  MAIN_STREAM(stream: string, chanTitle: string, lang: ELanguage) {
    return !stream ? null : /.*youtu.*/.test(stream) ? (
      <iframe
        style={{
          display: 'block',
          marginLeft: 'auto',
          marginRight: 'auto',
        }}
        width={yWidth}
        height={yHeight}
        src={`${yEmbedPath}${stream.replace(/\/$/, '').split('/').reverse()[0]}`}
        allowFullScreen
      />
    ) : (
      // <Video src={stream} />
      // <DynamicVideo src={stream} />
      <FakePlayer lang={lang} chanTitle={chanTitle} url={stream} />
    );
  },
  TV_FOR_SITE_NET(stream: string, chanTitle: string, lang: ELanguage) {
    return !stream ? null : (
      <FakePlayer lang={lang} chanTitle={chanTitle} url={stream} />
    );
  },
  // OTHER_STREAM(stream: string) {
  //   return !stream ? null : <DangerHtml text={stream} />;
  // },
};

// const DynamicVideo = dynamic(() => import('next-video'), {
//   ssr: false, // Вимикаємо SSR для компонентів, що використовують клієнтські ресурси
// });
