import {
  MChanTheme,
  META_SAT_CHANNEL_LIST,
  CHANNEL_TOOLTIP_TITLES,
  isFtaChannel,
  getCompressColor,
  ECompressColors,
} from '@/models/channelList.model';
import styles from './SatChannelsTable.module.scss';
import Link from 'next/link';
import { EUrlBaseParam } from '@/models/url.model';
import { cutText } from '@/libs/utils/utils';
import FillingImg from '../ui/Images/FillingImage';
import TooltipSimple from '../ui/tooltips/TooltipSimple/TooltipSimple';
import FillingValidImage from '../ui/Images/FillingValidImage';
import { IFlyChannel, META_CHANNEL, TDbBoolean } from '@/models/channel.model';
import ChannelCardTooltip from '../ChannelCardTooltip/ChannelCardTooltip';
import GoUpLink from '../ui/GoUpLink/GoUpLink';
import EmptyData from '../errors/EmptyData/EmptyData';
import { DB_ARRAY_SEPARATOR, ELanguage } from '@/models/ui.model';
import Tooltip from '../ui/tooltips/TooltipMovingClient/Tooltip';

const {
  images: { h2SatListImage, genreImage, genreRadioImage, t2Image },
} = META_SAT_CHANNEL_LIST;

interface ISatChannelsTableProps {
  lang: ELanguage;
  satChannels: IFlyChannel[][][];
  isSingleSat?: boolean;
}

const FrequencySegment = ({
  frequencyChannels,
  lang,
}: {
  frequencyChannels: IFlyChannel[];
  lang: ELanguage;
}) =>
  frequencyChannels.map(
    (
      {
        logo,
        compress,
        title,
        description,
        slug,
        biss,
        theme_id,
        theme,
        genre_description,
        encryption,
        mode,
        is_radio,
        sid,
        v_pid,
        a_pid,
        t2_stream,
      },
      idx
    ) => {
      const encryptionList = encryption
        ? encryption.split(DB_ARRAY_SEPARATOR)
        : [''];
      const aPidList = a_pid.split(DB_ARRAY_SEPARATOR);
      const modeList = mode.split(DB_ARRAY_SEPARATOR);
      // const genreImgSrc = MChanTheme.get(theme_id || 1);
      const genreImgSrc = theme_id ? MChanTheme.get(theme_id) : theme_id;
      const isFta = isFtaChannel(encryptionList);
      const compressColor = getCompressColor(compress, modeList, t2_stream);

      const languages = [...new Set(aPidList.map((aP) => aP.split(' ')[1]))];

      const isCBand = frequencyChannels[0].frequency < 10700;

      return (
        <tr
          key={idx}
          className={
            t2_stream
              ? 'bg-yellow-100'
              : !isFta
                ? 'bg-red-200'
                : is_radio
                  ? 'bg-green-100'
                  : 'bg-green-200'
          }
        >
          {!idx && (
            <td
              rowSpan={frequencyChannels.length}
              className={`text-sm ${isCBand ? 'bg-rose-50' : 'bg-blue-100'}`}
            >
              <ul>
                <li className="font-bold">
                  {`${frequencyChannels[0].frequency} ${frequencyChannels[0].polarization}`}
                </li>
                <li>
                  {`${frequencyChannels[0].sr}, ${frequencyChannels[0].fec}`}
                </li>
                <li className="text-gray-500 text-sm">
                  {frequencyChannels[0].beam}{' '}
                  {lang === ELanguage.UA ? 'напр.' : 'beam'}
                </li>
                <li className="text-xs font-bold">
                  {modeList.length === 1 ? (
                    `(${modeList[0]})`
                  ) : (
                    <ul>
                      {modeList.map((mod) => (
                        <li key={mod}>({mod})</li>
                      ))}
                    </ul>
                  )}
                </li>
              </ul>
            </td>
          )}

          <td
            className={`text-sm min-w-8`}
            style={
              is_radio
                ? {}
                : {
                    backgroundColor: `${compressColor}`,
                  }
            }
          >
            <Tooltip
              hintHtml={
                <ul className="flex flex-col gap-2 justify-center items-center text-sm">
                  <li className="text-lg flex flex-row gap-2">
                    -= {is_radio ? 'Radio' : 'TV'} =-
                  </li>
                  {t2_stream && (
                    <li className="flex flex-row gap-2">
                      <figure className="flex flex-col gap-1 items-center">
                        <div className="bg-slate-50 rounded-lg p-1">
                          <T2Icon t2Stream={t2_stream} lang={lang} />
                        </div>
                        <figcaption>
                          DVB-T2 (
                          {lang === ELanguage.UA
                            ? 'Цифрове Ефірне ТБ'
                            : 'Digital Terrestrial TV'}
                          )
                        </figcaption>
                      </figure>
                    </li>
                  )}
                  {compress || mode[0] ? (
                    <HintItemList
                      itemList={[compress, ...modeList]}
                      title="Mode"
                    />
                  ) : null}
                  {sid || v_pid ? (
                    <li>
                      <ul>
                        {sid && (
                          <li>
                            <b>SID: </b>
                            {sid}
                          </li>
                        )}
                        {v_pid && (
                          <li>
                            <b>V.pid: </b>({v_pid})
                          </li>
                        )}
                      </ul>
                    </li>
                  ) : null}
                  <HintItemList itemList={aPidList} title="Audio" />
                  <HintItemList itemList={encryptionList} title="Encryption" />
                </ul>
              }
            >
              {is_radio ? (
                <ul className="flex flex-row flex-wrap gap-2 justify-center">
                  <div className="sm:inline-block hidden">
                    <RadioIcon is_radio={is_radio} lang={lang} />
                  </div>
                  <li className="bg-slate-50 border border-dotted border-gray-600 rounded-sm px-1 text-lg m-1 inline-block sm:hidden">
                    🎼
                  </li>
                </ul>
              ) : (
                <ul>
                  {t2_stream && (
                    <>
                      <li className="bg-slate-50 rounded-lg border border-dotted border-gray-600 p-1 inline-block sm:hidden">
                        <T2Icon t2Stream={t2_stream} lang={lang} />
                      </li>
                      <li className="text-red-950 text-xs hidden sm:block">
                        ({t2_stream})
                      </li>
                    </>
                  )}
                  <li className="text-red-800 font-bold hidden sm:block">
                    {compress}
                    {compressColor === ECompressColors.MPEG_2_S2 && '/S2'}
                  </li>
                  <li
                    className={
                      t2_stream
                        ? 'hidden'
                        : 'bg-slate-50 border border-dotted border-gray-600 rounded-sm px-1 text-lg m-1 inline-block sm:hidden'
                    }
                  >
                    🎬
                  </li>
                </ul>
              )}
            </Tooltip>
          </td>

          <td className="text-sm hidden sm:table-cell">
            {sid || v_pid ? (
              <ul>
                {sid && <li>{sid}</li>}
                {v_pid && <li> ({v_pid})</li>}
              </ul>
            ) : null}
          </td>

          <td className="text-sm text-left hidden sm:table-cell">
            {aPidList.length > 2 ? (
              <Tooltip
                hintHtml={
                  <ul>
                    <HintItemList itemList={aPidList} title="Audio" />
                  </ul>
                }
              >
                <ul>
                  {aPidList.slice(0, 2).map((aPid, i) => (
                    <li
                      key={`${i}${aPid}`}
                      className={i % 2 ? 'bg-white/30' : 'bg-white/50'}
                    >
                      {aPid}
                    </li>
                  ))}
                  <li>...</li>
                </ul>
              </Tooltip>
            ) : aPidList.length > 1 ? (
              <ul>
                {aPidList.map((aPid, i) => (
                  <li
                    key={`${i}${aPid}`}
                    className={i % 2 ? 'bg-white/30' : 'bg-white/50'}
                  >
                    {aPid}
                  </li>
                ))}
              </ul>
            ) : (
              <span className="bg-white/30">{aPidList[0]}</span>
            )}
          </td>
          {/* 
          <td className="text-sm text-center hidden sm:table-cell">
            {languages.length > 1 ? (
              <ul>
                {languages.map((language, i) => (
                  <li
                    key={`${i}${language}`}
                    className={i % 2 ? 'bg-indigo-100' : 'bg-indigo-50'}
                  >
                    {language}
                  </li>
                ))}
              </ul>
            ) : (
              <span className="bg-indigo-100">{languages[0]}</span>
            )}
          </td> */}

          <td className="text-sm hidden sm:table-cell">
            {t2_stream && (
              <div className="flex justify-center">
                <T2Icon t2Stream={t2_stream} lang={lang} />
              </div>
            )}
            {encryptionList.length > 1 ? (
              <ul>
                {encryptionList.map((enc) => (
                  <li key={enc}>{enc}</li>
                ))}
              </ul>
            ) : (
              encryptionList[0]
            )}
          </td>

          <td className={is_radio ? 'text-left' : ''}>
            <div className={`flex items-center gap-2 px-2 sm:justify-between`}>
              {!is_radio && logo && (
                <ChannelCardTooltip
                  mainImage={{
                    ...META_CHANNEL.images.channelLogo.small,
                    src: `${META_CHANNEL.images.channelLogo.small.path}${logo}`,
                  }}
                  mainDefaultImage={
                    META_CHANNEL.images.channelLogo.small.defaultImage
                  }
                  mainAlternativeImgString={
                    META_CHANNEL.images.channelLogo.small.alternativeImgStr
                  }
                  mainIsChangeToGif
                  tooltipImage={{
                    ...META_CHANNEL.images.channelLogo.big,
                    src: `${META_CHANNEL.images.channelLogo.big.path}${logo}`,
                  }}
                  tooltipDefaultImage={
                    META_CHANNEL.images.channelLogo.big.defaultImage
                  }
                  tooltipAlternativeImgString={
                    META_CHANNEL.images.channelLogo.big.alternativeImgStr
                  }
                  tooltipTextList={[
                    {
                      title: CHANNEL_TOOLTIP_TITLES.name[lang],
                      description: title,
                    },
                    {
                      title: CHANNEL_TOOLTIP_TITLES.genre[lang],
                      description: theme,
                    },
                    {
                      title: CHANNEL_TOOLTIP_TITLES.language[lang],
                      description: languages,
                    },
                    {
                      title: CHANNEL_TOOLTIP_TITLES.description[lang],
                      description: cutText(description, 100),
                    },
                    {
                      title: CHANNEL_TOOLTIP_TITLES.compression[lang],
                      description: [compress, ...modeList],
                    },
                  ]}
                />
              )}
              <Link
                className={is_radio ? styles.linkRadio : styles.linkTV}
                id={slug}
                href={`/${lang}/${EUrlBaseParam.KANAL}/${slug}`}
              >
                <RadioIcon is_radio={is_radio} lang={lang} />
                {title}
              </Link>
              {genreImgSrc && !is_radio ? (
                <div className="flex-col items-center text-sm hidden sm:flex">
                  <TooltipSimple tooltipText={genre_description}>
                    <FillingImg
                      width={genreImage.width}
                      height={genreImage.height}
                      alt={`${genreImage.altPre} ${theme}`}
                      src={`${genreImage.path}${genreImgSrc}`}
                    />
                  </TooltipSimple>
                </div>
              ) : null}
            </div>
            {biss && <p className={styles.biss}>{biss}</p>}
          </td>
        </tr>
      );
    }
  );

const FlyChannelsTable = ({
  satChannels,
  lang,
  isSingleSat = false,
}: ISatChannelsTableProps) =>
  satChannels.length > 0 && satChannels[0].length > 0 ? (
    <>
      {satChannels.map((sat) => (
        <>
          {!isSingleSat && (
            <h2
              id={sat[0][0].sat_slug}
              className="font-bold text-base sm:text-2xl text-blue-800 text-center py-2 flex items-center justify-between gap-4"
              style={{
                fontFamily: 'Verdana, Geneva, sans-serif',
                textShadow: '1px 1px 1px #ffffff',
              }}
            >
              <GoUpLink lang={lang} />
              {sat[0][0].sat_title} - {sat[0][0].sat_position}
              <FillingValidImage
                image={{
                  ...h2SatListImage,
                  src: `${h2SatListImage.path}${sat[0][0].sat_logo}`,
                }}
                defaultImage={h2SatListImage.defaultImage}
                alternativeImgString={h2SatListImage.alternativeString}
                alt={`${h2SatListImage.alt[lang]} ${sat[0][0].sat_title}`}
                isBlur
              />
            </h2>
          )}
          <table className={styles.SatChannelsTable}>
            <thead>
              <tr className="bg-violet-200 hidden sm:table-row">
                <th>Frequency / Beam / Mode</th>
                <th>Compress.</th>
                <th>Sid (v.pid)</th>
                <th>A.pid</th>
                <th>Code</th>
                <th>Title</th>
              </tr>
            </thead>
            <tbody>
              {sat.map((freqChannels, idx) => (
                <FrequencySegment
                  key={idx}
                  frequencyChannels={freqChannels}
                  lang={lang}
                />
              ))}
            </tbody>
          </table>
        </>
      ))}
    </>
  ) : (
    <EmptyData
      lang={lang}
      description={
        lang === ELanguage.UA
          ? 'Зараз канали відсутні. Спробуйте обрати інший супутник, або  налаштувати фільтри.'
          : 'There are currently no channels. Try to choose another satellite or adjust the filters.'
      }
    />
  );

const RadioIcon = ({
  is_radio,
  lang,
}: {
  is_radio: TDbBoolean;
  lang: ELanguage;
}) =>
  is_radio ? (
    <FillingImg
      width={genreRadioImage.width}
      height={genreRadioImage.height}
      alt={`${genreRadioImage.alt[lang]}`}
      src={`${genreRadioImage.src}`}
    />
  ) : null;

const T2Icon = ({
  t2Stream,
  lang,
}: {
  t2Stream: string | null;
  lang: ELanguage;
}) =>
  t2Stream ? (
    <FillingImg
      width={t2Image.width}
      height={t2Image.height}
      alt={`${t2Image.alt[lang]}`}
      src={`${t2Image.src}`}
    />
  ) : null;

const HintItemList = ({
  itemList,
  title,
}: {
  itemList: string[];
  title: string;
}) =>
  itemList.length && itemList[0] ? (
    <li className="w-60">
      <h3>-= {title} =-</h3>
      <ul className="text-sm border border-gray-300 border-groove p-2 rounded-md grid grid-cols-[repeat(auto-fit,minmax(70px,1fr))] gap-2">
        {itemList.map((item) => (
          <li key={item} className="bg-indigo-900">
            {item}
          </li>
        ))}
      </ul>
    </li>
  ) : null;

export default FlyChannelsTable;
