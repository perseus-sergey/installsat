import { Title } from '@/components/ui/Titles/Title';
import { sendMail } from '@/libs/mail/sendMail';
import { validSearchParam } from '@/libs/utils/validSearchParam';
import { EDBTableTitles, getDbTableLink } from '@/models/dbTblNames.model';
import { EUrlAdminParam } from '@/models/url/urlAdmin.model';
import { EUrlSearchParam, TSearchParams } from '@/models/url/urlSearch.model';
import { translateChannels } from '@cron/libs/channelTranslate.controller.mjs';

export const dynamic = 'force-dynamic';

const BASE_URL = process.env.BASE_URL;

const sendReportMail = async (errorMessages: string[], quantity: string) => {
  const { renderAsync } = await import('@react-email/render');
  const { ParseTransNews } = await import(
    '@/components/EmailTemplates/parseTransNews.template'
  );

  await sendMail({
    subject: `AI translating "${quantity}" OLD channels`,
    body: await renderAsync(
      <ParseTransNews
        title={`AI translating "${quantity}" OLD channels`}
        pathToMainParsePage={`${BASE_URL}/en/${EUrlAdminParam.BASE_PATH}/${EUrlAdminParam.PARSE}`}
        errorMessages={errorMessages}
        dbTableHref={getDbTableLink(EDBTableTitles.CHANNELS)}
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
  const quantity = validSearchParam(EUrlSearchParam.INTERVAL, searchParams);

  const messages = await translateChannels(quantity, true);

  await sendReportMail(messages, quantity);

  return (
    <>
      <Title>{`AI translating ${quantity} channels`}</Title>

      <h2 className="font-bold text-blue-700 text-xl">Messages:</h2>
      <ul>
        {messages.map((message, i) => (
          <li key={i}>{message}</li>
        ))}
      </ul>
    </>
  );
}
