import {
  MChanTheme,
  getCompressColor,
  ECompressColors,
  SAT_CHANNEL_LIST_IMAGES,
} from '@/models/channelList.model';
import { EUrlBaseParam } from '@/models/url.model';
import FillingValidImage from '../ui/Images/FillingValidImage';
import { IFlyChannel } from '@/models/channel.model';
import GoUpLink from '../ui/GoUpLink/GoUpLink';
import EmptyData from '../errors/EmptyData/EmptyData';
import { DB_ARRAY_SEPARATOR, ELanguage } from '@/models/ui.model';
import Tooltip from '../ui/tooltips/TooltipMovingClient/Tooltip';
import SeoLink from '../ui/SeoLink/SeoLink';
import { isFtaChannel } from '@/controllers/channelList.controller';

const { h2SatListImage, genreImage } = SAT_CHANNEL_LIST_IMAGES;

interface ISatChannelsTableProps {
  lang: ELanguage;
  satChannels: IFlyChannel[][][];
  isSingleSat?: boolean;
}

const borderStyle = { border: '2px groove' };
const radioIconBg = `bg-[url('/Images/genre/radio.png')] h-4 w-4`;
const t2IconBg = `bg-[url('/Images/t2_antenna_24.png')]`;

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
        compress,
        title,
        slug,
        biss,
        theme_id,
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
      const genreImgSrc = theme_id ? MChanTheme.get(theme_id) : theme_id;
      const isFta = isFtaChannel(encryptionList);
      const compressColor = getCompressColor(compress, modeList, t2_stream);
      const aPidLength = aPidList.length;

      // const languages = [...new Set(aPidList.map((aP) => aP.split(' ')[1]))];

      const isCBand = frequencyChannels[0].frequency < 10700;

      return (
        <tr
          key={idx}
          style={borderStyle}
          className={
            t2_stream
              ? 'bg-yellow-100'
              : !isFta
                ? 'bg-red-200'
                : is_radio === 1
                  ? 'bg-green-100'
                  : 'bg-green-200'
          }
        >
          {!idx && (
            <td
              style={borderStyle}
              rowSpan={frequencyChannels.length}
              className={`text-sm p-0.5 ${isCBand ? 'bg-rose-50' : 'bg-blue-100'}`}
            >
              <ul>
                <li className="font-bold">
                  {`${frequencyChannels[0].frequency} ${frequencyChannels[0].polarization}`}
                </li>
                <li>
                  {`${frequencyChannels[0].sr.toLocaleString('de-DE')}, ${frequencyChannels[0].fec}`}
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
            className={`text-sm p-0.5 min-w-8`}
            style={
              is_radio === 1
                ? borderStyle
                : {
                    ...borderStyle,
                    backgroundColor: `${compressColor}`,
                  }
            }
          >
            <Tooltip
              hintHtml={
                <ul className="flex flex-col gap-2 justify-center items-center text-sm">
                  <li className="text-lg flex flex-row gap-2">
                    -= {is_radio === 1 ? 'Radio' : 'TV'} =-
                  </li>
                  {t2_stream && (
                    <li className="flex flex-wrap gap-2 items-center">
                      <div
                        className={`${t2IconBg} block h-8 w-8 bg-slate-50 rounded-lg p-1 bg-no-repeat bg-center`}
                      />
                      <div>
                        DVB-T2 (
                        {lang === ELanguage.UA
                          ? 'Цифрове Ефірне ТБ'
                          : 'Digital Terrestrial TV'}
                        )
                      </div>
                    </li>
                  )}
                  {compress || mode[0] ? (
                    <li>
                      <HintItemList
                        itemList={[compress, ...modeList]}
                        title="Mode"
                      />
                    </li>
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
                  <li>
                    <HintItemList itemList={aPidList} title="Audio" />
                  </li>
                  <li>
                    <HintItemList
                      itemList={encryptionList}
                      title="Encryption"
                    />
                  </li>
                </ul>
              }
            >
              {is_radio === 1 ? (
                <ul className="flex flex-row flex-wrap gap-2 justify-center">
                  <li className={`${radioIconBg} sm:inline-block hidden`} />
                  <li className="bg-slate-50 border border-dotted border-gray-600 rounded-sm px-1 text-lg m-1 inline-block sm:hidden">
                    🎼
                  </li>
                </ul>
              ) : (
                <ul>
                  {t2_stream && (
                    <>
                      <li
                        className={`${t2IconBg} inline-block sm:hidden h-8 w-8 bg-slate-50 p-1 bg-no-repeat bg-center border border-dotted border-gray-600 rounded-sm`}
                      />
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

          <td
            style={borderStyle}
            className="text-sm p-0.5 hidden sm:table-cell"
          >
            {sid || v_pid ? (
              <ul>
                {sid && <li>{sid}</li>}
                {v_pid && <li> ({v_pid})</li>}
              </ul>
            ) : null}
          </td>

          <td
            style={borderStyle}
            className="text-sm p-0.5 text-left hidden sm:table-cell"
          >
            {aPidLength > 2 ? (
              <Tooltip
                wrapperTagName="ul"
                hintHtml={<HintItemList itemList={aPidList} title="Audio" />}
              >
                {aPidList.slice(0, 2).map((aPid, i) => (
                  <li
                    key={`${i}${aPid}`}
                    className={i % 2 ? 'bg-white/30' : 'bg-white/50'}
                  >
                    {aPid}
                  </li>
                ))}
                <li>
                  ...
                  {lang === ELanguage.UA
                    ? ` ще ${aPidLength - 2}`
                    : ` ${aPidLength - 2} more`}
                </li>
              </Tooltip>
            ) : aPidLength > 1 ? (
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

          <td
            style={borderStyle}
            className="text-sm p-0.5 hidden sm:table-cell"
          >
            {t2_stream && <div className={`${t2IconBg} h-6 w-6 m-auto`} />}
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

          <td
            style={borderStyle}
            className={is_radio === 1 ? 'text-left p-0.5' : 'p-0.5'}
          >
            <div className={`flex items-center gap-2 px-2 sm:justify-between`}>
              <SeoLink
                title={
                  lang === ELanguage.UA
                    ? `Перейти до сторінки з детальним описом каналу "${title}"`
                    : `Go to the detailed page of channel "${title}"`
                }
                className={`${is_radio === 1 ? 'text-slate-500 text-sm' : 'text-blue-800 font-bold'} text-left flex flex-row items-center gap-2 hover:text-purple-500`}
                id={slug}
                href={`/${lang}/${EUrlBaseParam.KANAL}/${slug}`}
              >
                {is_radio === 1 && <div className={radioIconBg} />}
                {/* <RadioIcon is_radio={is_radio} lang={lang} /> */}
                {title}
              </SeoLink>
              {genreImgSrc && !is_radio ? (
                <div
                  title={genre_description}
                  className="w-6 h-6 hidden sm:block"
                  style={{
                    backgroundImage: `url(${genreImage.path}${genreImgSrc})`,
                  }}
                ></div>
              ) : null}
            </div>
            {biss && (
              <p className="md:text-sm text-xs bg-gray-100/30">{biss}</p>
            )}
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
                // alternativeImgString={h2SatListImage.alternativeString}
                alt={`${h2SatListImage.alt[lang]} ${sat[0][0].sat_title}`}
                isFillParent
              />
            </h2>
          )}
          <table className="w-full max-w-4xl mx-auto text-center border-collapse">
            <thead>
              <tr
                className="bg-violet-200 hidden sm:table-row"
                style={borderStyle}
              >
                <th style={borderStyle}>Frequency / Beam / Mode</th>
                <th style={borderStyle}>Compress.</th>
                <th style={borderStyle}>Sid (v.pid)</th>
                <th style={borderStyle}>A.pid</th>
                <th style={borderStyle}>Code</th>
                <th style={borderStyle}>Title</th>
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

const HintItemList = ({
  itemList,
  title,
}: {
  itemList: string[];
  title: string;
}) =>
  itemList.length && itemList[0] ? (
    <section className="w-60">
      <h3>-= {title} =-</h3>
      <ul className="text-sm border border-gray-300 border-groove p-2 rounded-md grid grid-cols-[repeat(auto-fit,minmax(70px,1fr))] gap-2">
        {itemList.map((item) => (
          <li key={item} className="bg-indigo-900">
            {item}
          </li>
        ))}
      </ul>
    </section>
  ) : null;

export default FlyChannelsTable;
