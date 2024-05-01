'use client';

import styles from './OnlinePlayerTabs.module.scss';
import Video from 'next-video';
import FakePlayer from '../FakePlayer/FakePlayer';
import BaseButton from '../ui/buttons/BaseButton/BaseButton';
import { useState } from 'react';
import { IOnlineChannel } from '../../models/channel.model';

interface IOnlinePlayerTabsProps {
  channelData: IOnlineChannel;
  allowedCountryCode: string;
}

const OnlinePlayerTabs = ({
  channelData: { country, url, title },
  // channelData: { potok, tvforsite_net, country, url, title },
  allowedCountryCode,
}: IOnlinePlayerTabsProps) => {
  const [playerN, setPlayerN] = useState(0);
  // const streams = [
  //   () => ONLINE_PLAYERS.MAIN_STREAM(potok),
  //   () => ONLINE_PLAYERS.TV_FOR_SITE_NET(tvforsite_net, title),
  // ];

  const streams = [
    {
      stream: 'https://spas.mediacdn.ru/cdn/spas/tracks-v1a1/mono.m3u8',
      player: ONLINE_PLAYERS.MAIN_STREAM(
        'https://spas.mediacdn.ru/cdn/spas/tracks-v1a1/mono.m3u8'
      ),
    },
    {
      stream: 'tvforsite_net',
      player: ONLINE_PLAYERS.TV_FOR_SITE_NET('tvforsite_net', title),
    },
  ];
  // const streams = ['potok', 'tvforsite_net'];
  // const streams = [potok, tvforsite_net];
  const numberOfTabs = streams.reduce(
    (acc, curr) => (curr.stream ? acc + 1 : acc),
    0
  );

  return (
    <div className={styles.OnlinePlayerTabs} data-testid="OnlinePlayerTabs">
      <p>country: {country}</p>
      {numberOfTabs > 0 ? (
        !country || country === allowedCountryCode ? (
          <>
            {numberOfTabs > 1 ? (
              <>
                <ul className={styles.tabButtonList}>
                  {streams.map(
                    ({ stream }, i) =>
                      stream && (
                        <li key={i}>
                          <BaseButton
                            ariaLabel={`Дивитись із ${i + 1}-го Джерела`}
                            className={`${styles.tabButton}${playerN === i ? ` ${styles.currentTab}` : ''}`}
                            onClick={() => setPlayerN(i)}
                          >
                            {i + 1} Канал
                          </BaseButton>
                        </li>
                      )
                  )}
                </ul>
                {/* <div className={styles.tabContent}> */}
                <div>{streams[playerN].player}</div>
              </>
            ) : (
              streams.map(({ stream, player }) => stream && player)
            )}
          </>
        ) : (
          <FakePlayer chanTitle={title} url={url} />
        )
      ) : (
        <FakePlayer chanTitle={title} url={url} />
      )}
    </div>
  );
};

export default OnlinePlayerTabs;

const ONLINE_PLAYERS = {
  MAIN_STREAM(stream: string) {
    return !stream ? null : /.*youtu.*/.test(stream) ? (
      <iframe
        style={{
          display: 'block',
          marginLeft: 'auto',
          marginRight: 'auto',
        }}
        width="700"
        height="395"
        src={`https://www.youtube.com/embed/${stream.replace(/\/$/, '').split('/').reverse()[0]}`}
        allowFullScreen
      ></iframe>
    ) : (
      <Video src={stream} />
    );
  },
  TV_FOR_SITE_NET(stream: string, chanTitle: string) {
    return !stream ? null : <FakePlayer chanTitle={chanTitle} url={stream} />;
  },
};
