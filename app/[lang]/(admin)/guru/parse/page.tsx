import ClientInputWithSubmit from '@/components/ClientInputWithSubmit/ClientInputWithSubmit';
import { Title } from '@/components/ui/Titles/Title';
import { getELangKey } from '@/libs/utils/validSearchParam';
import {
  EUrlAdminParam,
  EUrlBaseParam,
  EUrlSearchParam,
} from '@/models/url.model';
import Link from 'next/link';

interface IParams {
  params: { [key in EUrlAdminParam | EUrlBaseParam]: string };
}

export default async function Page({ params }: IParams) {
  const lang = getELangKey(params[EUrlBaseParam.LANG]);
  const VSE_TV_DEFAULT_ID = 346;

  return (
    <>
      <Title>Parse Page</Title>
      <ClientInputWithSubmit
        inputId="vse-tv"
        buttonTitle="Schedule VseTv"
        inputDefaultValue={VSE_TV_DEFAULT_ID}
        inputType="number"
        inputBaseHref={`/${lang}/${EUrlAdminParam.BASE_PATH}/${EUrlAdminParam.PARSE}/${EUrlAdminParam.PARSE_SCHEDULE_VSETV}`}
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
        buttonTitle="Schedule Vipiko"
        inputBaseHref={`/${lang}/${EUrlAdminParam.BASE_PATH}/${EUrlAdminParam.PARSE}/${EUrlAdminParam.PARSE_SCHEDULE_VIPIKO}`}
        fieldSetTitle="Schedule Vipiko"
        labelHtml={
          <>
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
        inputId="trans-news"
        buttonTitle="Transponder News"
        inputDefaultValue={4}
        inputType="number"
        inputBaseHref={`/${lang}/${EUrlAdminParam.BASE_PATH}/${EUrlAdminParam.PARSE}/${EUrlAdminParam.PARSE_SAT_DIGEST}`}
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
      <ClientInputWithSubmit
        inputId="trans-news-en-column"
        buttonTitle="Add English Text"
        inputDefaultValue={0}
        inputType="number"
        inputBaseHref={`/${lang}/${EUrlAdminParam.BASE_PATH}/${EUrlAdminParam.PARSE}/add-en-news`}
        searchParamName={EUrlSearchParam.INTERVAL}
        fieldSetTitle="Transponder News"
        labelHtml={'Choose the Year or leave empty for current year.'}
      />
    </>
  );
}
