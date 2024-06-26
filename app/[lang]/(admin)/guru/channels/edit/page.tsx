import EmptyData from '@/components/errors/EmptyData/EmptyData';
import Filter from '@/components/ui/Filter/Filter';
import { Title } from '@/components/ui/Titles/Title';
import { getEditDbChannels } from '@/controllers/admin.controller';
import { validSearchParam } from '@/libs/utils/validSearchParam';
import { ARTICLES } from '@/models/articles.model';
import { DEFAULT_LANG, TSearchParams } from '@/models/ui.model';
import { EUrlAdminParam, EUrlSearchParam } from '@/models/url.model';
import Link from 'next/link';

const { BASE_PATH, CHANNELS_EDIT } = EUrlAdminParam;

const { placeholder, labelTitle } = ARTICLES.search;

export default async function Page({
  searchParams,
}: {
  searchParams?: TSearchParams;
}) {
  const searchQuery = validSearchParam(EUrlSearchParam.ARTICLE, searchParams);

  const dbResult = searchQuery ? await getEditDbChannels(searchQuery) : [];
  if (dbResult instanceof Error)
    return <EmptyData description={dbResult.message} />;

  return (
    <>
      <Title>Channel list for Edit</Title>
      <Filter
        idName="channel-search-input"
        placeholder={placeholder[DEFAULT_LANG]}
        labelTitle={labelTitle[DEFAULT_LANG]}
        searchQueryTitle={EUrlSearchParam.ARTICLE}
      />

      {dbResult.length ? (
        <table className="base-table">
          <tbody>
            {dbResult.map((channel, i) => (
              <tr
                key={channel.id}
                className={i % 2 ? 'bg-indigo-100' : undefined}
              >
                <td>
                  <Link
                    className="text-blue-800 block"
                    href={`/${BASE_PATH}/${CHANNELS_EDIT}/edit/${channel.id}`}
                    title={channel.canonical}
                  >
                    {channel.title}
                  </Link>
                </td>
                <td>
                  {channel.sat_title} {channel.sat_position}
                </td>
                <td>{channel.category}</td>
                <td>{channel.cat_parent_title}</td>
                <td>{channel.compr}</td>
                <td>{channel.frequency}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <EmptyData />
      )}
    </>
  );
}
