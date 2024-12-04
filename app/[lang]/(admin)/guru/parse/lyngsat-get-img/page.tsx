import { Title } from '@/components/ui/Titles/Title';
import { EUrlSearchParam, TSearchParams } from '@/models/url/urlSearch.model';
import { validSearchParam } from '@/libs/utils/validSearchParam';
import { getLyngsatLogos } from '@cron/libs/logoLyngsat.controller.mjs';
import { sendMail } from '@/libs/mail/sendMail';
import { EDBTableTitles, getDbTableLink } from '@/models/dbTblNames.model';
import { ELanguage } from '@/models/language.model';
import { EUrlAdminParam } from '@/models/url/urlAdmin.model';

const { FLY_CHANNELS } = EDBTableTitles;

const BASE_URL = process.env.BASE_URL;

export const dynamic = 'force-dynamic';

// =================================================================
// Використовую віддалену бд на сервері з Локального!!! скрипту.
// з моєі бд дістаю канал у якого поле logo is null
// скрипт шукає логотип цього каналу на сайті lyngsat.com. На lyngsat.com існує тільки система пошуку від google search
// логотип завантажується в папку на моєму сайті Images
// в мою бд для каналів з такою ж назвою як і поточний записується назва цього логотипу наприклад ('channel1-logo.png')
// =================================================================

const sendReportMail = async (errorMessages: string[], quantity: string) => {
  const { renderAsync } = await import('@react-email/render');
  const { ParseTransNews } = await import(
    '@/components/EmailTemplates/parseTransNews.template'
  );

  await sendMail({
    subject: `Load and save ${quantity} logos from LyngSat`,
    body: await renderAsync(
      <ParseTransNews
        title={`Load and save ${quantity} logos from LyngSat`}
        pathToMainParsePage={`${BASE_URL}/${ELanguage.EN}/${EUrlAdminParam.BASE_PATH}/${EUrlAdminParam.PARSE}`}
        errorMessages={errorMessages}
        dbTableHref={getDbTableLink(FLY_CHANNELS)}
        hrefSources=""
      />
    ),
  });
};

export default async ({ searchParams }: { searchParams?: TSearchParams }) => {
  const quantity = validSearchParam(EUrlSearchParam.INTERVAL, searchParams);

  const messages = await getLyngsatLogos(quantity);
  // const messages = await getChannelsLogo(quantity);

  await sendReportMail(messages, quantity);

  return (
    <>
      <Title>{`Load and save ${quantity} logos from LyngSat WITH GOOGLE SEARCH`}</Title>

      <h2 className="font-bold text-blue-700 text-xl">Messages:</h2>
      <ul>
        {messages.map((message, i) => (
          <li key={i}>{message}</li>
        ))}
      </ul>
    </>
  );
};
