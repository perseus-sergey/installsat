import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

import DeleteItemButton from '@/components/admin/DeleteItemButton/DeleteItemButton';
import EmptyData from '@/components/errors/EmptyData/EmptyData';
import Filter from '@/components/ui/Filter/Filter';
import Pagination from '@/components/ui/Pagination/Pagination';
import { Title } from '@/components/ui/Titles/Title';
import { getAdminChunkOfNews } from '@/controllers/admin.controller';
import { getFormattedDateStrYearFirst } from '@/libs/utils/dates';
import { validSearchParam } from '@/libs/utils/validSearchParam';
import { ARTICLE_LIST_MODEL } from '@/models/articles/articleList.model';
import { SEARCH_FIELD } from '@/models/ui/searchField.model';
import { EUrlAdminParam } from '@/models/url/urlAdmin.model';
import { EUrlBaseParam } from '@/models/url/url.model';
import { EUrlSearchParam, TSearchParams } from '@/models/url/urlSearch.model';
import { getELangKey } from '@/libs/utils/getLanguage';
import { EDBTableTitles } from '@/models/dbTblNames.model';

const { BASE_PATH, ARTICLES_EDIT } = EUrlAdminParam;

const { articlesCountCaption } = ARTICLE_LIST_MODEL;

const { placeholder, labelTitle } = SEARCH_FIELD;

const PAGINATION = {
  perPage: 30,
  offsetNumber: 3,
};

export interface IPageParams {
  params: { [key in EUrlAdminParam | EUrlBaseParam]: string };
  searchParams?: TSearchParams;
}

export default async function Page({ searchParams, params }: IPageParams) {
  const lang = getELangKey(params[EUrlBaseParam.LANG]);
  const page = validSearchParam(EUrlSearchParam.PAGE, searchParams) || '1';

  const searchQuery = validSearchParam(EUrlSearchParam.ARTICLE, searchParams);

  const pageNumber = parseInt(page, 10);
  if (isNaN(pageNumber)) notFound();

  const allNews = await getAdminChunkOfNews(
    PAGINATION.perPage,
    (pageNumber - 1) * PAGINATION.perPage,
    searchQuery
  );

  const articlesCount = !allNews.length ? 0 : allNews[0].total_count;

  const totalPages = Math.ceil(articlesCount / PAGINATION.perPage);

  return (
    <>
      <Title>List of Articles for Edit</Title>
      <Suspense>
        <Filter
          lang={lang}
          idName="article-search-input"
          placeholder={placeholder[lang]}
          labelTitle={labelTitle[lang]}
          searchQueryTitle={EUrlSearchParam.ARTICLE}
        />
      </Suspense>
      <p className="text-blue-600 font-bold text-center text-lg">{`${articlesCountCaption[lang]}${articlesCount}`}</p>
      <Pagination
        lang={lang}
        page={pageNumber || 1}
        offsetNumber={PAGINATION.offsetNumber}
        totalPages={totalPages}
        searchParams={searchParams}
      />

      <table>
        <tbody>
          {allNews.length ? (
            allNews.map((article) => (
              <tr key={article.id}>
                <td className="border border-slate-400 py-px px-2">
                  {article.category_title}
                </td>
                <td className="border border-slate-400 py-px px-2">
                  {getFormattedDateStrYearFirst(article.date_upd)}
                </td>
                <td className="border border-slate-400 py-px px-2">
                  <Link
                    href={`/${lang}/${BASE_PATH}/${ARTICLES_EDIT}/edit/${article.id}`}
                    className="flex items-center gap-2"
                  >
                    ✐ <span className="text-blue-800">{article.title}</span>
                  </Link>
                </td>
                <td className="border border-slate-400 py-px px-2 text-center">
                  {article.category_title === 'deleted' && (
                    <DeleteItemButton
                      itemID={`${article.id}`}
                      dbTableName={EDBTableTitles.ARTICLE}
                      revalidateUrl={`/${lang}/${EUrlAdminParam.BASE_PATH}/${EUrlAdminParam.ARTICLES_EDIT}`}
                    />
                  )}
                </td>
              </tr>
            ))
          ) : (
            <EmptyData lang={lang} />
          )}
        </tbody>
      </table>
    </>
  );
}
