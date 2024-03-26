import Link from 'next/link';
import styles from './Pagination.module.scss';
import { EUrlSearchParam } from '@/models/url.model';
import { ARTICLES } from '@/models/articles.model';
// import { URLSearchParams } from 'url';

interface IPaginationProps {
  page: number;
  offsetNumber: number;
  totalPages: number;
  searchParams: { [key: string]: string | string[] | undefined };
}

const getPageNumbers = (
  page: number,
  offsetNumber: number,
  totalPages: number
): number[] => {
  const pageNumbers = [];

  for (let i = page - offsetNumber; i <= page + offsetNumber; i += 1) {
    if (i >= 1 && i <= totalPages) {
      pageNumbers.push(i);
    }
  }

  return pageNumbers;
};

const Pagination = ({
  page,
  offsetNumber,
  totalPages,
  searchParams,
}: IPaginationProps) => {
  const makeUrlSearchParams = (): URLSearchParams => {
    const params = new URLSearchParams();
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value !== undefined) {
        if (Array.isArray(value)) {
          value.forEach((v) => params.append(key, v));
        } else {
          params.set(key, value);
        }
      }
    });

    return params;
  };

  const urlSearchParams = makeUrlSearchParams();

  const makeUrlSearchParamsStr = (value: string | number): string => {
    urlSearchParams.set(EUrlSearchParam.PAGE, `${value}`);

    return `?${urlSearchParams.toString()}`;
  };

  const firstPage = makeUrlSearchParamsStr('1');

  const prevPage = makeUrlSearchParamsStr(`${page - 1 || 1}`);

  const nextPage = makeUrlSearchParamsStr(`${page + 1}`);

  const lastPage = makeUrlSearchParamsStr(`${totalPages}`);

  const pageNumbers = getPageNumbers(page, offsetNumber, totalPages);

  return (
    <div className={styles.Pagination} data-testid="Pagination">
      <div className="flex border-[1px] gap-4 rounded-[10px] border-light-green p-4">
        {page === 1 ? (
          <>
            <div className="opacity-60" aria-disabled="true">
              {ARTICLES.articleList.pagination.firstPageTitle}
            </div>
            <div className="opacity-60" aria-disabled="true">
              {ARTICLES.articleList.pagination.previousPageTitle}
            </div>
          </>
        ) : (
          <>
            <Link href={firstPage} aria-label="Previous Page">
              {ARTICLES.articleList.pagination.firstPageTitle}
            </Link>
            <Link href={prevPage} aria-label="Previous Page">
              {ARTICLES.articleList.pagination.previousPageTitle}
            </Link>
          </>
        )}

        {pageNumbers.map((pageNumber, index) => (
          <Link
            key={index}
            className={
              page === pageNumber
                ? 'bg-green-500 fw-bold px-2 rounded-md text-black'
                : 'hover:bg-green-500 px-1 rounded-md'
            }
            href={makeUrlSearchParamsStr(pageNumber)}
          >
            {pageNumber}
          </Link>
        ))}

        {page === totalPages ? (
          <>
            <div className="opacity-60" aria-disabled="true">
              {ARTICLES.articleList.pagination.nextPageTitle}
            </div>
            <div className="opacity-60" aria-disabled="true">
              {ARTICLES.articleList.pagination.lastPageTitle}
            </div>
          </>
        ) : (
          <>
            <Link href={nextPage} aria-label="Next Page">
              {ARTICLES.articleList.pagination.nextPageTitle}
            </Link>
            <Link href={lastPage} aria-label="Next Page">
              {ARTICLES.articleList.pagination.lastPageTitle}
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default Pagination;
