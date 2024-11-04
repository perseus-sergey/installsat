import {
  DB_ARRAY_SEPARATOR,
  IChannel,
  IFlyChannel,
} from '@/models/channels/channel.model';
import { EUrlBaseParam } from '@/models/url/url.model';
import { TitleH2 } from '../ui/Titles/TitleH2';
import TooltipSimple from '../ui/tooltips/TooltipSimple/TooltipSimple';
import SeoLink from '../ui/SeoLink/SeoLink';
import { getLanguageList } from '@/controllers/languageList.controller';
import { ELanguage } from '@/models/language.model';
import {
  CHANNEL_PARAMS_BLOCK,
  getPolarDescription,
} from '@/models/channels/channelParams.model';
import { localeStringMaker } from '@/libs/utils/localeStringMaker';

interface IChannelParamsProps {
  channelDBParams: IChannel;
  lang: ELanguage;
}

const {
  getParamsTitle,
  paramsLanguage,
  paramsFormat,
  paramsStandard,
  paramsSatellite,
  paramsFrequency,
  paramsFEC,
  paramsEncryption,
  paramsTypeTitle,
  paramsLangTitle,
  paramsT2,
  paramsBandTitle,
  paramsFreqDescription,
  paramsPolarizationTitle,
  paramsSR,
  paramsFecTooltip,
  paramsAPid,
  paramsVPid,
  getParamsSite,
  getSatLinkTitle,
} = CHANNEL_PARAMS_BLOCK;

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
    'flex items-center gap-2 sm:gap-4 bg-slate-100 shadow-md rounded py-2 sm:px-4 px-1 mb-2 bg-gradient-to-b from-blue-100/70 via-blue-300/30 to-blue-200/90 from-50% via-45% to-100% ';

  const aPidList = !a_pid ? [] : a_pid.split(DB_ARRAY_SEPARATOR);
  const encryptions = !encryption ? [] : encryption.split(DB_ARRAY_SEPARATOR);
  if (biss && is_biss) encryptions.push(biss);

  const languages = getLanguageList(aPidList);
  const modeList = mode.split(DB_ARRAY_SEPARATOR);
  const isCBand = frequency < 10700;

  return (
    <section className="py-4 max-w-3xl mx-auto">
      <h2
        className="font-bold block text-base sm:text-xl text-blue-900 text-center py-2"
        style={{
          fontFamily: 'Verdana, Geneva, sans-serif',
          textShadow: '1px 1px 1px #ffffff',
        }}
      >
        {getParamsTitle(title)[lang]}
      </h2>

      {/* <p>aPidList: {JSON.stringify(aPidList, null, 2)}</p> */}

      <ul className="font-georgia" role="list">
        <li className={rowStyle}>
          <Item
            param={is_radio ? 'Radio' : 'TV'}
            title={paramsTypeTitle[lang]}
          />
        </li>

        {languages.length > 0 && (
          <li className={rowStyle}>
            <Item
              param={languages.map((item) => item.label)}
              title={paramsLangTitle[lang]}
            />
          </li>
        )}

        {t2_stream && (
          <TooltipSimple
            wrapperTagName="li"
            className={rowStyle}
            tooltipText={paramsT2.tooltipText[lang]}
          >
            <Item param={t2_stream} title={paramsT2.title[lang]} hasTip />
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
                      getSatLinkTitle(`${sat_title} / ${sat_position}`)[lang]
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
          <Item param={isCBand ? 'C' : 'Ku'} title={paramsBandTitle[lang]} />
        </li>

        {frequency && (
          <li className={rowStyle}>
            <Item
              param={localeStringMaker(frequency, 'coma')}
              title={paramsFrequency[lang]}
              description={paramsFreqDescription[lang]}
            />
          </li>
        )}

        {polarization && (
          <li className={rowStyle}>
            <Item
              param={polarization}
              title={paramsPolarizationTitle[lang]}
              description={getPolarDescription(polarization, lang)}
            />
          </li>
        )}

        {sr && (
          <TooltipSimple
            className={rowStyle}
            tooltipText={paramsSR.tooltipText[lang]}
            wrapperTagName="li"
          >
            <Item
              param={localeStringMaker(sr)}
              title="SR"
              description={paramsSR.description[lang]}
              hasTip
            />
          </TooltipSimple>
        )}

        {fec && (
          <TooltipSimple
            wrapperTagName="li"
            className={rowStyle}
            tooltipText={paramsFecTooltip[lang]}
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
            <Item param={localeStringMaker(sid)} title="SID" hasTip />
          </TooltipSimple>
        )}

        {v_pid && (
          <TooltipSimple
            wrapperTagName="li"
            className={rowStyle}
            tooltipText={paramsVPid.tooltip[lang]}
          >
            <Item
              param={localeStringMaker(v_pid)}
              title={paramsVPid.title[lang]}
              hasTip
            />
          </TooltipSimple>
        )}

        {aPidList.length > 0 && (
          <TooltipSimple
            wrapperTagName="li"
            className={rowStyle}
            tooltipText={paramsAPid.tooltip[lang]}
          >
            <Item param={aPidList} title={paramsAPid.title[lang]} hasTip />
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
        </div>
      )}
      {hasTip && (
        <div className="bg-[url('/Images/external-link_12.png')] w-4 h-4 inline-block shrink-0 bg-no-repeat bg-right" />
      )}
    </>
  ) : null;
};

export default ChannelParams;
