import { IChannel, IFlyChannel, META_CHANNEL } from '@/models/channel.model';
import { EUrlBaseParam } from '@/models/url.model';
import { DB_ARRAY_SEPARATOR, ELanguage } from '@/models/ui.model';
import { TitleH2 } from '../ui/Titles/TitleH2';
import TooltipSimple from '../ui/tooltips/TooltipSimple/TooltipSimple';
import { getLanguageList } from '@/controllers/channelList.controller';
import SeoLink from '../ui/SeoLink/SeoLink';

interface IChannelParamsProps {
  channelDBParams: IChannel;
  lang: ELanguage;
}

const { UA } = ELanguage;

const {
  getParamsTitle,
  paramsLanguage,
  paramsFormat,
  paramsSatellite,
  paramsFrequency,
  paramsFEC,
  paramsEncryption,
  getParamsSite,
} = META_CHANNEL.chanParamsBlock;

const getPolarDescription = (polarization: string, lang: ELanguage) => {
  switch (polarization.toLowerCase()) {
    case 'h':
      return lang === UA ? 'Горизонтальна' : 'Horizontal';
    case 'v':
      return lang === UA ? 'Вертикальна' : 'Vertical';
    case 'r':
      return lang === UA ? 'Права' : 'Right';
    case 'l':
      return lang === UA ? 'Ліва' : 'Left';
    default:
      return '';
  }
};

const ChannelParams = ({
  channelDBParams: {
    title,
    // compression,
    // sat_title,
    // freq,
    // fec,
    // polar,
    // sr,
    url,
    chan_lang,
    // encryption,
    // sat_slug,
    // chan_slug,
  },
  lang,
}: IChannelParamsProps) => {
  // const bissLink =
  //   encryption.toLowerCase() === 'biss'
  //     ? `/${lang}/${EUrlBaseParam.SAT_CHANNEL_LIST}/${sat_slug}#${chan_slug}`
  //     : '';

  return (
    <section>
      <TitleH2>{getParamsTitle(title)[lang]}</TitleH2>
      <ul>
        {chan_lang && (
          <li>
            {paramsLanguage[lang]}
            <strong>{chan_lang}</strong>
          </li>
        )}
        {/* {compression && (
          <li>
            {paramsFormat[lang]}
            <strong>{compression}</strong>
          </li>
        )}
        {sat_title && (
          <li>
            {paramsSatellite[lang]}
            <Link
              href={`/${lang}/${EUrlBaseParam.SAT_COVERAGE_MAP}/${sat_slug}`}
            >
              <strong>{sat_title}</strong>
            </Link>
          </li>
        )}
        {freq && (
          <li>
            {paramsFrequency[lang]}
            <strong>
              {freq} {polar} {sr}
            </strong>
          </li>
        )}
        {fec && (
          <li>
            {paramsFEC[lang]}
            <strong>{fec}</strong>
          </li>
        )}
        {encryption && (
          <li>
            {bissLink ? (
              <>
                {paramsEncryption[lang]}
                <Link href={bissLink}>
                  <strong>{encryption}</strong>
                </Link>
              </>
            ) : (
              <>
                {paramsEncryption[lang]}
                <strong>{encryption}</strong>
              </>
            )}
          </li>
        )} */}
        {url && (
          <li>
            {getParamsSite(title)[lang]} - <strong>{url}</strong>
          </li>
        )}
      </ul>
    </section>
  );
};

interface IFlyChannelParamsProps {
  channelDBParams: IFlyChannel;
  lang: ELanguage;
}

export const FlyChannelParams = ({
  channelDBParams: {
    title,
    sat_position,
    compress,
    sat_title,
    frequency,
    beam,
    fec,
    polarization,
    sr,
    official_broadcast_url,
    official_site_url,
    a_pid,
    encryption,
    is_biss,
    biss,
    sat_slug,
    mode,
    sid,
    v_pid,
    is_radio,
    t2_stream,
  },
  lang,
}: IFlyChannelParamsProps) => {
  const aPidList = !a_pid ? [] : a_pid.split(DB_ARRAY_SEPARATOR);
  const encryptions = !encryption ? [] : encryption.split(DB_ARRAY_SEPARATOR);
  if (biss && is_biss) encryptions.push(biss);

  const languages = getLanguageList(aPidList);
  const modeList = mode.split(DB_ARRAY_SEPARATOR);
  const isCBand = frequency < 10700;

  return (
    <section className="py-4">
      <h2
        className="font-bold block text-base sm:text-xl text-blue-900 text-center py-2"
        style={{
          fontFamily: 'Verdana, Geneva, sans-serif',
          textShadow: '1px 1px 1px #ffffff',
        }}
      >
        {getParamsTitle(title)[lang]}
      </h2>
      <ul
        style={{
          listStyleImage: 'url(/Images/galka_blue.png)',
          marginLeft: '1.5rem',
        }}
        className="text-xl flex flex-col gap-2"
      >
        <Item
          param={is_radio ? 'Radio' : 'TV'}
          title={lang === ELanguage.UA ? 'Тип : ' : 'Type : '}
        />

        {languages.length > 0 && (
          <li className="text-xl">
            <span>{lang === UA ? 'Мова : ' : 'Languages : '}</span>
            {languages.length > 1 ? (
              <ul
                style={{ listStyleImage: 'none', maxWidth: '500px' }}
                className="text-center flex flex-wrap gap-2 ml-2 text-base"
              >
                {languages.map((item, i) => (
                  <li
                    key={`${i}${item.value}`}
                    className="bg-white/50 px-2 py-1 text-gray-500 font-bold"
                  >
                    {item.label}
                  </li>
                ))}
              </ul>
            ) : (
              <span className="bg-white/50 px-2 py-1 text-gray-500 font-bold">
                {' '}
                {languages[0].label}
              </span>
            )}
          </li>
        )}

        <TooltipSimple
          className="w-fit"
          tooltipText={
            lang === ELanguage.UA
              ? 'Потік для цифрового ефірного телебачення'
              : 'For second Generation Terrestrial'
          }
        >
          <Item
            param={t2_stream}
            title={
              lang === ELanguage.UA
                ? 'Потік для DVB-T2 : '
                : 'Stream for DVB-T2 : '
            }
          />
        </TooltipSimple>

        <ListItem itemList={encryptions} title={paramsEncryption[lang]} />

        {compress && (
          <li>
            {paramsFormat[lang]}
            <strong>{compress} </strong>
            {modeList.length === 1 ? (
              `(${modeList[0]})`
            ) : (
              <ul style={{ listStyleImage: 'none', margin: 0 }}>
                <ListItem title="" itemList={modeList} />
              </ul>
            )}
          </li>
        )}

        {sat_title && (
          <li>
            {paramsSatellite[lang]}
            <SeoLink
              className="text-blue-800 hover:text-red-600"
              href={`/${lang}/${EUrlBaseParam.SAT_CHANNEL_LIST}/${sat_slug}`}
              title={
                lang === ELanguage.UA
                  ? `Перейти до перегляду списку каналів, що транслюються з супутника "${sat_title} / ${sat_position}"`
                  : `Go to view the list of channels broadcast from the "${sat_title} / ${sat_position}" satellite`
              }
            >
              <strong>
                {sat_title} / {sat_position}
              </strong>
            </SeoLink>{' '}
            ({beam})
          </li>
        )}

        <Item
          param={isCBand ? 'C' : 'Ku'}
          title={lang === ELanguage.UA ? 'Діапазон : ' : 'Band : '}
        />

        <Item
          param={frequency.toLocaleString('en-US')}
          title={paramsFrequency[lang]}
          description={lang === ELanguage.UA ? 'ГГц' : 'GHz'}
        />

        <Item
          param={polarization}
          title={lang === UA ? 'Поляризація : ' : 'Polarization : '}
          description={getPolarDescription(polarization, lang)}
        />

        <TooltipSimple
          className="w-fit"
          tooltipText={lang === UA ? 'Символьна швидкість' : 'Symbol Rate'}
        >
          <Item
            param={sr}
            title="SR : "
            description={lang === UA ? 'с/сек' : 's/sec'}
          />
        </TooltipSimple>

        <TooltipSimple
          className="w-fit"
          tooltipText={
            lang === UA
              ? 'Коефіцієнт корекції помилок'
              : 'Forward Error Correction'
          }
        >
          <Item param={fec} title={paramsFEC[lang]} />
        </TooltipSimple>

        <TooltipSimple className="w-fit" tooltipText="Service ID">
          <Item param={sid} title="SID : " />
        </TooltipSimple>

        <TooltipSimple
          className="w-fit"
          tooltipText={
            lang === UA
              ? 'Унікальний ідентифікатор потоку відео'
              : 'Video Packet Identifier'
          }
        >
          <Item param={v_pid} title="Video PId : " />
        </TooltipSimple>

        <TooltipSimple
          tooltipText={
            lang === UA
              ? 'Унікальний ідентифікатор потоку аудіо'
              : 'Audio Packet Identifier'
          }
        >
          <ListItem itemList={aPidList} title="Audio PId:" />
        </TooltipSimple>

        <Item
          param={official_broadcast_url}
          title={
            <>
              {getParamsSite(title)[lang]} -<b> {official_broadcast_url}</b>
            </>
          }
        />

        <Item param={official_site_url} title={getParamsSite(title)[lang]} />
      </ul>
    </section>
  );
};

const ListItem = ({
  itemList,
  title,
}: {
  itemList: string[];
  title: string;
}) =>
  itemList && itemList.length > 0 ? (
    <li className="text-xl">
      <span>{title}</span>
      {itemList.length > 1 ? (
        <ul
          style={{ listStyleImage: 'none', maxWidth: '500px' }}
          className="text-center flex flex-wrap gap-2 ml-2 text-base"
        >
          {itemList.map((item, i) => (
            <li
              key={`${i}${item}`}
              className="bg-white/50 px-2 py-1 text-gray-500 font-bold"
            >
              <strong>{item}</strong>
            </li>
          ))}
        </ul>
      ) : (
        <strong className="bg-white/50 px-2 py-1 text-gray-500 font-bold">
          {' '}
          {itemList[0]}
        </strong>
      )}
    </li>
  ) : null;

const Item = ({
  param,
  title,
  description,
}: {
  param?: string | number | null | React.ReactNode;
  title: string | React.ReactNode;
  description?: string;
}) =>
  param ? (
    <li>
      {title}
      <strong>{param} </strong>
      {description && <span className="text-base">({description})</span>}
    </li>
  ) : null;

export default ChannelParams;
