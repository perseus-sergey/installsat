import ClientInputWithSubmit from '@/components/ClientInputWithSubmit/ClientInputWithSubmit';
import { Title } from '@/components/ui/Titles/Title';
import { EUrlAdminParam, EUrlSearchParam } from '@/models/url.model';
import Link from 'next/link';

export default async function Page() {
  return (
    <>
      <Title>Parse Page</Title>
      <ClientInputWithSubmit
        inputId="vse-tv"
        buttonTitle="Schedule VseTv"
        inputDefaultValue={346}
        inputType="number"
        inputBaseHref={`${EUrlAdminParam.PARSE}/${EUrlAdminParam.PARSE_SCHEDULE_VSETV}`}
        searchParamName={EUrlSearchParam.COMMENT_ID}
        fieldSetTitle="Schedule VseTv"
        labelHtml={
          <>
            Choose channel id for find time traps{' '}
            <Link
              className="text-blue-600 underline"
              href="http://www.vsetv.com/schedule_channel_346_week.html"
              target="_blank"
              rel="noopener noreferrer nofollow"
            >
              vsetv.com/schedule_channel_346_week
            </Link>
          </>
        }
      />
      <ClientInputWithSubmit
        inputId="trans-news"
        buttonTitle="Transponder News"
        inputDefaultValue={4}
        inputType="number"
        inputBaseHref={`${EUrlAdminParam.PARSE}/${EUrlAdminParam.PARSE_SAT_DIGEST}`}
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
    </>
  );
}
