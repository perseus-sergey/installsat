import ClientInputWithSubmit, {
  ClientSelectWithSubmit,
  ClientTwoInputsWithSubmit,
} from '@/components/ClientInputWithSubmit/ClientInputWithSubmit';
import { Title } from '@/components/ui/Titles/Title';
import { poolExecute } from '@/libs/db/mysqldb';
import { getELangKey } from '@/libs/utils/getLanguage';
import { EDBTableTitles } from '@/models/dbTblNames.model';
import { EUrlBaseParam } from '@/models/url/url.model';
import { EUrlAdminParam } from '@/models/url/urlAdmin.model';
import { EUrlSearchParam } from '@/models/url/urlSearch.model';
import Link from 'next/link';

const { FLY_SATELLITES } = EDBTableTitles;

interface IParams {
  params: { [key in EUrlAdminParam | EUrlBaseParam]: string };
}

export default async function Page({ params }: IParams) {
  const lang = getELangKey(params[EUrlBaseParam.LANG]);
  const BASE_PARSE_HREF = `/${lang}/${EUrlAdminParam.BASE_PATH}/${EUrlAdminParam.PARSE}`;
  const VSE_TV_DEFAULT_ID = 346;
  const IT999_DEFAULT_BATCH = 8096;
  const FLYSAT_SATELLITES_HREF = 'https://flysat.com/en/satellitelist';

  const flySatRes = await poolExecute<
    { title: string; slug: string; position: string }[]
  >(`SELECT title, slug, position FROM ${FLY_SATELLITES} ORDER BY grade`);
  const flySatOptions =
    flySatRes instanceof Error
      ? [{ title: '', value: '' }]
      : flySatRes.map((sat) => ({
          title: `${sat.title} ${sat.position}`,
          value: sat.slug,
        }));

  return (
    <>
      <Title>Parse Page</Title>

      <ClientTwoInputsWithSubmit
        inputId={EUrlAdminParam.PARSE_FLY_CHANNEL_ABOUT}
        searchParamNames={[
          EUrlSearchParam.CHANNEL,
          EUrlSearchParam.LANGUAGE_URL,
        ]}
        buttonTitle="Generate"
        inputBaseHref={`${BASE_PARSE_HREF}/${EUrlAdminParam.PARSE_FLY_CHANNEL_ABOUT}`}
        fieldSetTitle="Generate AI Descriptions to FLY channel"
        labelHtml="Insert Channel Name & Channel Broadcast Language"
      />

      <ClientSelectWithSubmit
        selectOptions={flySatOptions}
        inputId={EUrlAdminParam.CHANNEL_ABOUT_ONE_SAT}
        searchParamName={EUrlSearchParam.SAT}
        buttonTitle="generate"
        inputBaseHref={`${BASE_PARSE_HREF}/${EUrlAdminParam.CHANNEL_ABOUT_ONE_SAT}`}
        fieldSetTitle="Generate Channel description for one satellite"
        labelHtml="Choose Satellite for generate DESCRIPTIONS FOR CHANNELS:"
      />

      <ClientInputWithSubmit
        inputId={EUrlAdminParam.PARSE_FLY_SATELLITES}
        inputDefaultValue={2}
        inputType="number"
        searchParamName={EUrlSearchParam.INTERVAL}
        buttonTitle="Parse"
        inputBaseHref={`${BASE_PARSE_HREF}/${EUrlAdminParam.PARSE_FLY_SATELLITES}`}
        fieldSetTitle="Flysat Satellites Table"
        labelHtml={
          <>
            Parse main{' '}
            <Link
              className="text-blue-600 underline"
              href={FLYSAT_SATELLITES_HREF}
              target="_blank"
              rel="noopener noreferrer nofollow"
            >
              Flysat Satellites Page.
            </Link>{' '}
            Choose interval from last update:
          </>
        }
      />

      <ClientSelectWithSubmit
        selectOptions={flySatOptions}
        inputId={EUrlAdminParam.PARSE_FLY_CHANNELS}
        searchParamName={EUrlSearchParam.SAT}
        buttonTitle="Parse"
        inputBaseHref={`${BASE_PARSE_HREF}/${EUrlAdminParam.PARSE_FLY_CHANNELS}`}
        fieldSetTitle="Flysat Channels Table"
        labelHtml="Choose Satellite for parsing CHANNELS:"
      />

      <ClientInputWithSubmit
        buttonTitle="Parse News"
        inputBaseHref={`${BASE_PARSE_HREF}/${EUrlAdminParam.PARSE_SAT_NEWS}`}
        fieldSetTitle="Satellite News"
        labelHtml="Parse Satellite News"
      />

      <ClientInputWithSubmit
        buttonTitle="Translate"
        inputBaseHref={`${BASE_PARSE_HREF}/old-channel-translate`}
        fieldSetTitle="Translate old channels"
        labelHtml="Translate old channels"
      />

      <ClientInputWithSubmit
        buttonTitle="Translate"
        inputBaseHref={`${BASE_PARSE_HREF}/old-articles-translate`}
        fieldSetTitle="Translate old articles"
        labelHtml="Translate old articles"
        inputId="add-slug-grade"
        inputDefaultValue={20}
        inputType="number"
        searchParamName={EUrlSearchParam.INTERVAL}
      />

      <ClientInputWithSubmit
        inputId="vse-tv"
        buttonTitle="Schedule VseTv"
        inputDefaultValue={VSE_TV_DEFAULT_ID}
        inputType="number"
        inputBaseHref={`${BASE_PARSE_HREF}/${EUrlAdminParam.PARSE_SCHEDULE_VSETV}`}
        searchParamName={EUrlSearchParam.COMMENT_ID}
        fieldSetTitle="Schedule VseTv"
        labelHtml={
          <>
            Choose channel id for find time traps{' '}
            <Link
              className="text-blue-600 underline"
              href={`http://www.vsetv.com/schedule_channel_${VSE_TV_DEFAULT_ID}_week.html`}
              target="_blank"
              rel="noopener noreferrer nofollow"
            >
              vsetv.com/schedule_channel_{VSE_TV_DEFAULT_ID}_week
            </Link>
          </>
        }
      />
      <ClientInputWithSubmit
        inputId="it999"
        buttonTitle="Schedule Vipiko"
        inputDefaultValue={IT999_DEFAULT_BATCH}
        inputType="number"
        inputBaseHref={`${BASE_PARSE_HREF}/${EUrlAdminParam.PARSE_SCHEDULE_VIPIKO}`}
        searchParamName={EUrlSearchParam.INTERVAL}
        fieldSetTitle="Schedule Vipiko"
        labelHtml={
          <>
            Set batch size for DB inserting{' '}
            <Link
              className="text-blue-600 underline"
              href="https://epg.one/"
              target="_blank"
              rel="noopener noreferrer nofollow"
            >
              EPG SOURCE
            </Link>
          </>
        }
      />
      <ClientInputWithSubmit
        inputId={EUrlAdminParam.PARSE_SAT_DIGEST}
        buttonTitle="Transponder News"
        inputDefaultValue={4}
        inputType="number"
        inputBaseHref={`${BASE_PARSE_HREF}/${EUrlAdminParam.PARSE_SAT_DIGEST}`}
        searchParamName={EUrlSearchParam.INTERVAL}
        fieldSetTitle="Transponder News"
        labelHtml={
          <>
            Choose the number of Updates from{' '}
            <Link
              className="text-blue-600 underline"
              href="https://www.flysat.com/en/news"
              target="_blank"
              rel="noopener noreferrer nofollow"
            >
              flysat.com/en/news
            </Link>
          </>
        }
      />
      {/* <ClientInputWithSubmit
        inputId="add-en-news"
        buttonTitle="Add English Text for sat digest news"
        inputDefaultValue={0}
        inputType="number"
        inputBaseHref={`${BASE_PARSE_HREF}/add-en-news`}
        searchParamName={EUrlSearchParam.INTERVAL}
        fieldSetTitle="Transponder News"
        labelHtml={'Choose the Year or leave empty for current year.'}
      /> */}
      <ClientInputWithSubmit
        inputId="add-slug-grade"
        buttonTitle="Add sat_slug & sat_grade for sat digest news"
        inputDefaultValue={0}
        inputType="number"
        inputBaseHref={`${BASE_PARSE_HREF}/add-grade-trans`}
        searchParamName={EUrlSearchParam.INTERVAL}
        fieldSetTitle="Trans News Add SAT_GRADE & SAT_SLUG"
        labelHtml={'Choose the Year or leave empty for current year.'}
      />
    </>
  );
}
