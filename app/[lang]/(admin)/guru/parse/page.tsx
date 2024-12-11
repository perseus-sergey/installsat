import Link from 'next/link';

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

// =================================================================
// BEAM COVERAGE MAP WITH JSON-LD
// sitemap for images
// make carousel with article images when adv is not shown
// add similar trans news links for fly channel page
// fix comments get country by user-ip
// sat finder - not internet error handling
//
// Check comment user location in production (if successful, clean up the comments form //code comments)
// Add separate tbl_comments for fly satellites
// add comment block to fly channels with separate db tbl (fly_comments_channel))
// Parse biss from lugasat (Or satsat.info) by sat grade & frequency & title
// Find approximate grades from search params for spysok-kanaliv-suputnyka
// add color description to channel filters
// improve similar channels & similar articles blocks
// add json-ld
// Add cluster choice
// add image generator
// =================================================================

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
        fieldSetTitle="Generate AI Descriptions to FLY channel"
        labelHtml="Insert Channel Name & Channel Broadcast Language"
        inputId={EUrlAdminParam.PARSE_FLY_CHANNEL_ABOUT}
        searchParamNames={[
          EUrlSearchParam.CHANNEL,
          EUrlSearchParam.LANGUAGE_URL,
        ]}
        buttonTitle="Generate"
        inputBaseHref={`${BASE_PARSE_HREF}/${EUrlAdminParam.PARSE_FLY_CHANNEL_ABOUT}`}
      />

      <ClientSelectWithSubmit
        fieldSetTitle="Generate Channel description for one satellite"
        labelHtml="Choose Satellite for generate DESCRIPTIONS FOR CHANNELS:"
        selectOptions={flySatOptions}
        inputId={EUrlAdminParam.CHANNEL_ABOUT_ONE_SAT}
        searchParamName={EUrlSearchParam.SAT}
        buttonTitle="generate"
        inputBaseHref={`${BASE_PARSE_HREF}/${EUrlAdminParam.CHANNEL_ABOUT_ONE_SAT}`}
      />

      <ClientInputWithSubmit
        fieldSetTitle="Flysat Satellites Table"
        inputId={EUrlAdminParam.PARSE_FLY_SATELLITES}
        inputDefaultValue={2}
        inputType="number"
        searchParamName={EUrlSearchParam.INTERVAL}
        buttonTitle="Parse"
        inputBaseHref={`${BASE_PARSE_HREF}/${EUrlAdminParam.PARSE_FLY_SATELLITES}`}
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
        fieldSetTitle="Flysat Channels Table"
        labelHtml="Choose Satellite for parsing CHANNELS:"
        selectOptions={flySatOptions}
        inputId={EUrlAdminParam.PARSE_FLY_CHANNELS}
        searchParamName={EUrlSearchParam.SAT}
        buttonTitle="Parse"
        inputBaseHref={`${BASE_PARSE_HREF}/${EUrlAdminParam.PARSE_FLY_CHANNELS}`}
      />

      <ClientInputWithSubmit
        fieldSetTitle="Satellite News"
        labelHtml="Parse Satellite News"
        buttonTitle="Parse News"
        inputBaseHref={`${BASE_PARSE_HREF}/${EUrlAdminParam.PARSE_SAT_NEWS}`}
      />

      <ClientInputWithSubmit
        fieldSetTitle="Load LOGOS from LyngSat"
        labelHtml="Choose channels quantity"
        buttonTitle="Load"
        inputBaseHref={`${BASE_PARSE_HREF}/lyngsat-get-img`}
        inputId="lyngsat-get-img"
        inputDefaultValue={10}
        inputType="number"
        searchParamName={EUrlSearchParam.INTERVAL}
      />

      <ClientInputWithSubmit
        fieldSetTitle="Translate ARTICLES into all languages from English"
        labelHtml="Choose articles quantity for translations"
        buttonTitle="Translate & Update"
        inputBaseHref={`${BASE_PARSE_HREF}/articles-translate`}
        inputId="articles-translate"
        inputDefaultValue={10}
        inputType="number"
        searchParamName={EUrlSearchParam.INTERVAL}
      />

      {/* <ClientInputWithSubmit
        fieldSetTitle="Translate OLD CHANNELS into all languages from English"
        labelHtml="Choose channels quantity for translations"
        buttonTitle="Translate & Update"
        inputBaseHref={`${BASE_PARSE_HREF}/channels-translate`}
        inputId="channels-translate"
        inputDefaultValue={10}
        inputType="number"
        searchParamName={EUrlSearchParam.INTERVAL}
      /> */}

      <ClientInputWithSubmit
        fieldSetTitle="Translate FLY CHANNELS into all languages from English"
        labelHtml="Choose channels quantity for translations"
        buttonTitle="Translate & Update"
        inputBaseHref={`${BASE_PARSE_HREF}/channels-fly-translate`}
        inputId="channels-fly-translate"
        inputDefaultValue={10}
        inputType="number"
        searchParamName={EUrlSearchParam.INTERVAL}
      />

      {/* <ClientInputWithSubmit
        labelHtml="Translate old articles"
        buttonTitle="Translate"
        inputBaseHref={`${BASE_PARSE_HREF}/old-articles-translate`}
        fieldSetTitle="Translate old articles"
        inputId="old-articles-translate"
        inputDefaultValue={20}
        inputType="number"
        searchParamName={EUrlSearchParam.INTERVAL}
      /> */}

      <ClientInputWithSubmit
        fieldSetTitle="Schedule VseTv"
        buttonTitle="Schedule VseTv"
        inputId="vse-tv"
        inputDefaultValue={VSE_TV_DEFAULT_ID}
        inputType="number"
        inputBaseHref={`${BASE_PARSE_HREF}/${EUrlAdminParam.PARSE_SCHEDULE_VSETV}`}
        searchParamName={EUrlSearchParam.COMMENT_ID}
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
        fieldSetTitle="Schedule Vipiko"
        inputId="it999"
        buttonTitle="Schedule Vipiko"
        inputDefaultValue={IT999_DEFAULT_BATCH}
        inputType="number"
        inputBaseHref={`${BASE_PARSE_HREF}/${EUrlAdminParam.PARSE_SCHEDULE_VIPIKO}`}
        searchParamName={EUrlSearchParam.INTERVAL}
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
        fieldSetTitle="Transponder News"
        buttonTitle="Transponder News"
        inputId={EUrlAdminParam.PARSE_SAT_DIGEST}
        inputDefaultValue={4}
        inputType="number"
        inputBaseHref={`${BASE_PARSE_HREF}/${EUrlAdminParam.PARSE_SAT_DIGEST}`}
        searchParamName={EUrlSearchParam.INTERVAL}
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
        fieldSetTitle="Translate old channels"
        labelHtml="Translate old channels"
        buttonTitle="Translate"
        inputBaseHref={`${BASE_PARSE_HREF}/old-channel-translate`}
      /> */}

      {/* <ClientInputWithSubmit
        fieldSetTitle="Transponder News"
        labelHtml={'Choose the Year or leave empty for current year.'}
        buttonTitle="Add English Text for sat digest news"
        inputId="add-en-news"
        inputDefaultValue={0}
        inputType="number"
        inputBaseHref={`${BASE_PARSE_HREF}/add-en-news`}
        searchParamName={EUrlSearchParam.INTERVAL}
      /> */}

      {/* <ClientInputWithSubmit
        fieldSetTitle="All Language Texts for Transponder News"
        labelHtml={'Choose the Year or leave empty for current year.'}
        buttonTitle="Add All Language Texts for sat digest news"
        inputId="add-all-lang-digest-news"
        inputDefaultValue={0}
        inputType="number"
        inputBaseHref={`${BASE_PARSE_HREF}/add-all-lang-digest-news`}
        searchParamName={EUrlSearchParam.INTERVAL}
      /> */}

      {/* <ClientInputWithSubmit
        fieldSetTitle="Trans News Add SAT_GRADE & SAT_SLUG"
        labelHtml={'Choose the Year or leave empty for current year.'}
        buttonTitle="Add sat_slug & sat_grade for sat digest news"
        inputId="add-slug-grade"
        inputDefaultValue={0}
        inputType="number"
        inputBaseHref={`${BASE_PARSE_HREF}/add-grade-trans`}
        searchParamName={EUrlSearchParam.INTERVAL}
      /> */}
    </>
  );
}
