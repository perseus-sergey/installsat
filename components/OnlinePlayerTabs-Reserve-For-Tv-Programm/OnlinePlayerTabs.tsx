import { IOnlineChannel } from '@/models/channel.model';
import styles from './OnlinePlayerTabs.module.scss';
import Video from 'next-video';
import FakePlayer from '../FakePlayer/FakePlayer';

interface IOnlinePlayerTabsProps {
  channelData: IOnlineChannel;
  allowedCountryCode: string;
}

const OnlinePlayerTabs = ({
  channelData: { country, url, title },
  // channelData: { potok, tvforsite_net, country, url, title },
  allowedCountryCode,
}: IOnlinePlayerTabsProps) => {
  // const streams = [
  //   () => ONLINE_PLAYERS.MAIN_STREAM(potok),
  //   () => ONLINE_PLAYERS.TV_FOR_SITE_NET(tvforsite_net, title),
  // ];
  const streams = [
    { stream: 'potok', player: ONLINE_PLAYERS.MAIN_STREAM('potok') },
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
              <ul className={styles.OnlinePlayerTabs}>
                {streams.map(
                  ({ stream, player }, i) =>
                    stream && (
                      <>
                        <input
                          type="radio"
                          id={`tab-${i}`}
                          name="online-tabs-radio"
                          className={styles.tabRadio}
                          defaultChecked={!i}
                        />
                        <li className={styles.tabItem}>
                          <label
                            htmlFor={`tab-${i}`}
                            className={styles.tabLabel}
                            style={{ left: `${i * 7}rem` }}
                          >
                            {i + 1} Канал
                          </label>
                          <div className={styles.tabContent}>{player}</div>
                        </li>
                      </>
                    )
                )}
              </ul>
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
// function uppod_enc_replace_ab(a: string, b: string, tmp: string): string {
//   tmp = tmp.replace(new RegExp(a, 'g'), '___');
//   tmp = tmp.replace(new RegExp(b, 'g'), a);
//   tmp = tmp.replace(/___/g, b);

//   return tmp;
// }

// function uppod_enc_replace(str: string): string {
//   const uppod_tmp_a = 'wUbmeGt8MJ6uRnV4o0cldgXN7=';
//   const uppod_tmp_b = 'k1fLDaiZT2BQ93IvWH5sxyOpzyO';
//   let uppod_tmp = str;

//   for (let i = 0; i < uppod_tmp_a.length; i++) {
//     uppod_tmp = uppod_enc_replace_ab(uppod_tmp_a[i], uppod_tmp_b[i], uppod_tmp);
//   }

//   return uppod_tmp;
// }

// function uppod_encode(str: string, lkey: string = ''): string {
//   let tmp = uppod_enc_replace(btoa(str));
//   if (lkey !== '') {
//     const tmpn = Math.floor(Math.random() * (tmp.length + 1));
//     tmp = tmp.slice(0, tmpn) + uppod_enc_replace(btoa(lkey)) + tmp.slice(tmpn);
//   }

//   return tmp;
// }

// function uppod_encode_html5(str: string): string {
//   const utf16be = Buffer.from(str, 'utf16le').toString('hex');
//   const match = utf16be.match(/0{1}([0-9a-f]{3})/i);
//   if (match) {
//     return `#${match[1]}`;
//   }

//   return '';
// }
