import { Title } from '@/components/ui/Titles/Title';
import { getDbIdAmount } from '@/controllers/schedule.controller';
import { createURLWithParams } from '@/libs/utils/utils';
import { validSearchParamArray } from '@/libs/utils/validSearchParam';
import { TSearchParams } from '@/models/ui.model';
import { EUrlAdminParam, EUrlSearchParam } from '@/models/url.model';
import Link from 'next/link';

const BASE_URL = process.env.BASE_URL;

export default async function Page({
  searchParams,
}: {
  searchParams?: TSearchParams;
}) {
  const searchQueryArray = validSearchParamArray(
    EUrlSearchParam.CHANNEL,
    searchParams
  );

  const res = await getDbIdAmount();

  return (
    <>
      <Title>Parse Page</Title>
      {res instanceof Error ? (
        <p>{res.message}</p>
      ) : (
        <p>
          The number of records in the database table:{' '}
          {res[0].count.toLocaleString('en-US')}
        </p>
      )}
      {searchQueryArray && searchQueryArray.length > 0 ? (
        <>
          <Link
            href={createURLWithParams(
              `${BASE_URL}/${EUrlAdminParam.BASE_PATH}/${EUrlAdminParam.PARSE}/${EUrlAdminParam.PARSE_SCHEDULE_VSETV}`,
              searchParams
            )}
          >
            Parse again the all failed channels
          </Link>
          <h2>Parse again failed channels:</h2>
          <ul>
            {searchQueryArray.map((vseTvId, i) => (
              <li key={i}>
                <Link
                  href={createURLWithParams(
                    `${BASE_URL}/${EUrlAdminParam.BASE_PATH}/${EUrlAdminParam.PARSE}/${EUrlAdminParam.PARSE_SCHEDULE_VSETV}`,
                    { [EUrlSearchParam.CHANNEL]: vseTvId }
                  )}
                >
                  {vseTvId}
                </Link>
              </li>
            ))}
          </ul>
        </>
      ) : null}
    </>
  );
}
