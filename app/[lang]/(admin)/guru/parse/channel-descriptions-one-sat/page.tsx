import { Title } from '@/components/ui/Titles/Title';
import {
  EDBTableTitles,
  ELanguage,
  getDbTableLink,
  TSearchParams,
} from '@/models/ui.model';
import { validSearchParam } from '@/libs/utils/validSearchParam';
import { EUrlAdminParam, EUrlSearchParam } from '@/models/url.model';
import { addDescriptionForChannels } from '@/cron/libs/generateChanAboutForOneSat.controller.mjs';
import { sendMail } from '@/libs/mail/sendMail';

export const dynamic = 'force-dynamic';

// =================================================================
//
// Check comment user location in production (if successful, clean up the comments form //code comments)
// Split all models into smaller models
// Add separate tbl_comments for fly satellites
// Renew tbl_chan_categ by adding english language
// Mobile Accordion Lazy loading
// Maximum Tailwind
// Set indexes in DB
// Find approximate grades from search params for spysok-kanaliv-suputnyka
// Change all Link to SeoLink
// change all reactSelects
// Check SEO by removing elements from the page step by step
// Parse biss from lugasat (Or satsat.info) by sat grade & frequency & title
// add color description to channel filters
// improve similar channels & similar articles blocks
// add comment block to fly channels with separate db tbl (fly_comments_channel))
// add json-ld
// Add cluster choice
// add image generator
// =================================================================

// =================================================================
// Generate AI description for extracted from urlSearchParams sat_slug
//  for channels whose genre_id equals 0 and description_en is empty.
// If AI could not generate description, descriptions in db remains empty,
//  but genre_id assigned 0.
// =================================================================

const BASE_URL = process.env.BASE_URL;

const sendReportMail = async (errorMessages: string[], satTitle: string) => {
  const { renderAsync } = await import('@react-email/render');
  const { ParseTransNews } = await import(
    '@/components/EmailTemplates/parseTransNews.template'
  );

  await sendMail({
    subject: `Generate AI description for Satellite "${satTitle}"`,
    body: await renderAsync(
      <ParseTransNews
        title={`Generate AI description for Satellite "${satTitle}"`}
        pathToMainParsePage={`${BASE_URL}/${ELanguage.EN}/${EUrlAdminParam.BASE_PATH}/${EUrlAdminParam.PARSE}`}
        errorMessages={errorMessages}
        dbTableHref={getDbTableLink(EDBTableTitles.FLY_CHANNELS)}
        hrefSources=""
      />
    ),
  });
};

export default async function Page({
  searchParams,
}: {
  searchParams?: TSearchParams;
}) {
  const currentSatSlug = validSearchParam(EUrlSearchParam.SAT, searchParams);

  if (!currentSatSlug) {
    return (
      <p className="text-xl text-red-500 font-bold">
        ERROR: searchParams {EUrlSearchParam.SAT} ={' '}
        {searchParams?.[EUrlSearchParam.SAT]}
      </p>
    );
  }

  const messages = await addDescriptionForChannels(currentSatSlug);

  await sendReportMail(messages, currentSatSlug);

  return (
    <>
      <Title>
        {`Generate description channel data for satellite ${currentSatSlug}`}
      </Title>

      <h2 className="font-bold text-blue-700 text-xl">Messages:</h2>
      <ul>
        {messages.map((message, i) => (
          <li key={i}>{message}</li>
        ))}
      </ul>
    </>
  );
}
