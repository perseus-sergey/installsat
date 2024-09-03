import { Title } from '@/components/ui/Titles/Title';
import {
  EDBTableTitles,
  ELanguage,
  getDbTableLink,
  TSearchParams,
} from '@/models/ui.model';
import { validSearchParam } from '@/libs/utils/validSearchParam';
import { EUrlAdminParam, EUrlSearchParam } from '@/models/url.model';
import React from 'react';
import { addDescriptionForChannels } from '@/cron/libs/generateChanAboutForOneSat.controller.mjs';
import { sendMail } from '@/libs/mail/sendMail';
import { renderAsync } from '@react-email/render';
import { ParseTransNews } from '@/components/EmailTemplates/parseTransNews.template';

export const dynamic = 'force-dynamic';

// =================================================================
// - Change select languages for satellite
// - Create info about channel and it genre from gpt
// - Make channel search for all satellites  from 2 characters
//
// Check SEO by removing elements from the page step by step
// Remove console logging from production parsers (mjs & tsx)
// Change all Link to SeoLink
// change fieldset legend css
// Add cluster choice
// add valid description to StartArticleSections
// change all reactSelects
// add color description to channel filters
// improve similar channels & similar articles blocks
// add comment block to fly channels with separate db tbl (fly_comments_channel))
// Parse biss from lugasat (Or satsat.info) by sat grade & frequency & title
// refresh email in production
// add json-ld
// add image generator
// =================================================================

const BASE_URL = process.env.BASE_URL;

const sendReportMail = async (errorMessages: string[], satTitle: string) => {
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
