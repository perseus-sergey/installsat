import {
  CHANNEL_PARAMS_BLOCK,
  IChannel,
  IFlyChannel,
} from '@/models/channel.model';
import { EUrlBaseParam } from '@/models/url.model';
import { DB_ARRAY_SEPARATOR, ELanguage } from '@/models/ui.model';
import { TitleH2 } from '../ui/Titles/TitleH2';
import TooltipSimple from '../ui/tooltips/TooltipSimple/TooltipSimple';
import SeoLink from '../ui/SeoLink/SeoLink';
import { getLanguageList } from '@/controllers/languageList.controller';

interface IChannelParamsProps {
  channelDBParams: IChannel;
  lang: ELanguage;
}

const { UA } = ELanguage;

const {
  getParamsTitle,
  paramsLanguage,
  paramsFormat,
  paramsStandard,
  paramsSatellite,
  paramsFrequency,
  paramsFEC,
  paramsEncryption,
  getParamsSite,
} = CHANNEL_PARAMS_BLOCK;

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
  channelDBParams: { title, url, chan_lang },
  lang,
}: IChannelParamsProps) => {
  return (
    <section className="article-text">
      <TitleH2>{getParamsTitle(title)[lang]}</TitleH2>
      <ul>
        {chan_lang && (
          <li>
            {paramsLanguage[lang]}
            <strong>{chan_lang}</strong>
          </li>
        )}
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
  const rowStyle =
    'flex items-center gap-2 sm:gap-4 bg-slate-100 shadow-md rounded py-2 sm:px-4 px-1 mb-2';

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

      <ul className="font-georgia" role="list">
        <li className={rowStyle}>
          <Item
            param={is_radio ? 'Radio' : 'TV'}
            title={lang === ELanguage.UA ? 'Тип' : 'Type'}
          />
        </li>

        {languages.length > 0 && (
          <li className={rowStyle}>
            <Item
              param={languages.map((item) => item.label)}
              title={lang === UA ? 'Мова' : 'Languages'}
            />
          </li>
        )}

        {t2_stream && (
          <TooltipSimple
            wrapperTagName="li"
            className={rowStyle}
            tooltipText={
              lang === ELanguage.UA
                ? 'Потік для цифрового ефірного телебачення'
                : 'For second Generation Terrestrial'
            }
          >
            <Item
              param={t2_stream}
              title={
                lang === ELanguage.UA ? 'Потік для DVB-T2' : 'Stream for DVB-T2'
              }
              hasTip
            />
          </TooltipSimple>
        )}

        {encryptions.length > 0 && (
          <li className={rowStyle}>
            <Item param={encryptions} title={paramsEncryption[lang]} />
          </li>
        )}

        {compress && (
          <li className={rowStyle}>
            <Item param={compress} title={paramsFormat[lang]} />
          </li>
        )}

        {modeList.length > 1 ? (
          <li className={rowStyle}>
            <Item title={paramsStandard[lang]} param={modeList} />
          </li>
        ) : (
          <li className={rowStyle}>
            <Item param={modeList[0]} title={paramsStandard[lang]} />
          </li>
        )}

        {sat_title && (
          <li className={rowStyle}>
            <Item
              param={
                <>
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
                </>
              }
              title={paramsSatellite[lang]}
            />
          </li>
        )}

        <li className={rowStyle}>
          <Item
            param={isCBand ? 'C' : 'Ku'}
            title={lang === ELanguage.UA ? 'Діапазон' : 'Band'}
          />
        </li>

        {frequency && (
          <li className={rowStyle}>
            <Item
              param={frequency.toLocaleString('en-US')}
              title={paramsFrequency[lang]}
              description={lang === ELanguage.UA ? 'ГГц' : 'GHz'}
            />
          </li>
        )}

        {polarization && (
          <li className={rowStyle}>
            <Item
              param={polarization}
              title={lang === UA ? 'Поляризація' : 'Polarization'}
              description={getPolarDescription(polarization, lang)}
            />
          </li>
        )}

        {sr && (
          <TooltipSimple
            className={rowStyle}
            tooltipText={lang === UA ? 'Символьна швидкість' : 'Symbol Rate'}
            wrapperTagName="li"
          >
            <Item
              param={sr}
              title="SR"
              description={lang === UA ? 'с/сек' : 's/sec'}
              hasTip
            />
          </TooltipSimple>
        )}

        {fec && (
          <TooltipSimple
            wrapperTagName="li"
            className={rowStyle}
            tooltipText={
              lang === UA
                ? 'Коефіцієнт корекції помилок'
                : 'Forward Error Correction'
            }
          >
            <Item param={fec} title={paramsFEC[lang]} hasTip />
          </TooltipSimple>
        )}

        {sid && (
          <TooltipSimple
            className={rowStyle}
            tooltipText="Service ID"
            wrapperTagName="li"
          >
            <Item param={sid} title="SID" hasTip />
          </TooltipSimple>
        )}

        {v_pid && (
          <TooltipSimple
            wrapperTagName="li"
            className={rowStyle}
            tooltipText={
              lang === UA
                ? 'Унікальний ідентифікатор потоку відео'
                : 'Video Packet Identifier'
            }
          >
            <Item param={v_pid} title="Video PId" hasTip />
          </TooltipSimple>
        )}

        {aPidList.length > 0 && (
          <TooltipSimple
            wrapperTagName="li"
            className={rowStyle}
            tooltipText={
              lang === UA
                ? 'Унікальний ідентифікатор потоку аудіо'
                : 'Audio Packet Identifier'
            }
          >
            <Item param={aPidList} title="Audio PId" hasTip />
          </TooltipSimple>
        )}

        {official_broadcast_url && (
          <li className={rowStyle}>
            <Item
              param={official_broadcast_url}
              title={
                <>
                  {getParamsSite(title)[lang]} -<b> {official_broadcast_url}</b>
                </>
              }
            />
          </li>
        )}

        {official_site_url && (
          <li className={rowStyle}>
            <Item
              param={official_site_url}
              title={getParamsSite(title)[lang]}
            />
          </li>
        )}
      </ul>
    </section>
  );
};

interface IItem {
  param?: string[] | string | number | null | React.ReactNode;
  title: string | React.ReactNode;
  description?: string;
  hasTip?: boolean;
}

const Item = ({ param, title, description, hasTip = false }: IItem) => {
  const isItemArray = Array.isArray(param);

  return param ? (
    <>
      <span className="shrink-0 w-1/3 sm:w-1/4 sm:pr-4 pr-2 text-right border-r border-slate-300">
        {title}
      </span>
      {isItemArray && param.length > 1 ? (
        <ul
          style={{ listStyleImage: 'none', maxWidth: '500px' }}
          className="text-center flex flex-wrap gap-2 text-base"
        >
          {param.map((item, i) => (
            <li
              key={`${i}${item}`}
              className="bg-indigo-100 px-2 py-1 text-gray-500 font-bold"
            >
              <strong>{item}</strong>
            </li>
          ))}
        </ul>
      ) : (
        <div className="font-bold">
          {isItemArray ? param[0] : param}{' '}
          {description && <span className="text-base">({description})</span>}
          {hasTip && (
            <span className="bg-[url('/Images/external-link_12.png')] w-4 h-4 inline-block bg-no-repeat bg-right" />
          )}
        </div>
      )}
    </>
  ) : null;
};

export default ChannelParams;
