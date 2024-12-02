import { Title } from '@/components/ui/Titles/Title';
import { validSearchParam } from '@/libs/utils/validSearchParam';
import { addDescriptionForChannels } from '@/cron/libs/generateChanAboutForOneSat.controller.mjs';
import { sendMail } from '@/libs/mail/sendMail';
import { ELanguage } from '@/models/language.model';
import { EDBTableTitles, getDbTableLink } from '@/models/dbTblNames.model';
import { EUrlSearchParam, TSearchParams } from '@/models/url/urlSearch.model';
import { EUrlAdminParam } from '@/models/url/urlAdmin.model';

export const dynamic = 'force-dynamic';

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
