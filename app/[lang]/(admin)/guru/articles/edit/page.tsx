import DeleteItemButton from '@/components/admin/DeleteItemButton/DeleteItemButton';
import EmptyData from '@/components/errors/EmptyData/EmptyData';
import Filter from '@/components/ui/Filter/Filter';
import Pagination from '@/components/ui/Pagination/Pagination';
import { Title } from '@/components/ui/Titles/Title';
import { getAdminChunkOfNews } from '@/controllers/admin.controller';
import { getFormattedDateStrYearFirst } from '@/libs/utils/dates';
import { getELangKey, validSearchParam } from '@/libs/utils/validSearchParam';
import { ARTICLES } from '@/models/articles.model';
import { EDBTableTitles, DEFAULT_LANG, TSearchParams } from '@/models/ui.model';
import {
  EUrlAdminParam,
  EUrlBaseParam,
  EUrlSearchParam,
} from '@/models/url.model';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

const { BASE_PATH, ARTICLES_EDIT } = EUrlAdminParam;

const {
  search: { placeholder, labelTitle },
  articleList: { articlesCountCaption },
} = ARTICLES;

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
          placeholder={placeholder[DEFAULT_LANG]}
          labelTitle={labelTitle[DEFAULT_LANG]}
          searchQueryTitle={EUrlSearchParam.ARTICLE}
        />
      </Suspense>
      <p className="text-blue-600 font-bold text-center text-lg">{`${articlesCountCaption[DEFAULT_LANG]}${articlesCount}`}</p>
      <Pagination
        lang={lang}
        page={pageNumber || 1}
        offsetNumber={PAGINATION.offsetNumber}
        totalPages={totalPages}
        searchParams={searchParams}
      />

      <table className="base-table">
        <tbody>
          {allNews.length ? (
            allNews.map((article) => (
              <tr key={article.id}>
                <td>{article.category_title}</td>
                <td>{getFormattedDateStrYearFirst(article.date_upd)}</td>
                <td>
                  <Link
                    href={`/${lang}/${BASE_PATH}/${ARTICLES_EDIT}/edit/${article.id}`}
                    className="flex items-center gap-2"
                  >
                    ✐ <span className="text-blue-800">{article.title}</span>
                  </Link>
                </td>
                <td className="text-center">
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
            <EmptyData />
          )}
        </tbody>
      </table>
    </>
  );
}
