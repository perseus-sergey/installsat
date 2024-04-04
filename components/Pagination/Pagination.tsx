import Link from 'next/link';
import styles from './Pagination.module.scss';
import { EUrlSearchParam } from '@/models/url.model';
import { ARTICLES } from '@/models/articles.model';
import { CURRENT_LANGUAGE, TSearchParams } from '@/models/ui.model';
import { makeUrlSearchParams } from '@/libs/utils';

interface IPaginationProps {
  page: number;
  offsetNumber: number;
  totalPages: number;
  searchParams: TSearchParams;
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
  const urlSearchParams = makeUrlSearchParams(searchParams);

  const setUrlSearchParamsStr = (value: string | number): string => {
    urlSearchParams.set(EUrlSearchParam.PAGE, `${value}`);

    return `?${urlSearchParams.toString()}`;
  };

  const firstPage = setUrlSearchParamsStr('1');

  const prevPage = setUrlSearchParamsStr(`${page - 1 || 1}`);

  const nextPage = setUrlSearchParamsStr(`${page + 1}`);

  const lastPage = setUrlSearchParamsStr(`${totalPages}`);

  const pageNumbers = getPageNumbers(page, offsetNumber, totalPages);

  const {
    nextPageTitle,
    previousPageTitle,
    firstPageTitle,
    lastPageTitle,
    linkTitle,
  } = ARTICLES.articleList.pagination;

  return (
    <nav className={styles.Pagination} data-testid="Pagination">
      <ul className={styles.paginationList}>
        {page === 1 ? (
          <>
            <li>
              <div
                className={`${styles.listItem} ${styles.disabled}`}
                aria-disabled="true"
              >
                {firstPageTitle}
              </div>
            </li>
            <li>
              <div
                className={`${styles.listItem} ${styles.disabled}`}
                aria-disabled="true"
              >
                {previousPageTitle}
              </div>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link
                className={styles.listItem}
                href={firstPage}
                aria-label={linkTitle.firstPage[CURRENT_LANGUAGE]}
                title={linkTitle.firstPage[CURRENT_LANGUAGE]}
              >
                {firstPageTitle}
              </Link>
            </li>
            <li>
              <Link
                className={styles.listItem}
                href={prevPage}
                aria-label={linkTitle.previousPage[CURRENT_LANGUAGE]}
                title={linkTitle.previousPage[CURRENT_LANGUAGE]}
              >
                {previousPageTitle}
              </Link>
            </li>
          </>
        )}

        {pageNumbers.map((pageNumber, index) => (
          <li key={index}>
            <Link
              className={
                page === pageNumber ? styles.currentPageNumber : styles.listItem
              }
              href={setUrlSearchParamsStr(pageNumber)}
              aria-label={`${linkTitle.pageStartStr[CURRENT_LANGUAGE]}${pageNumber}`}
              title={`${linkTitle.pageStartStr[CURRENT_LANGUAGE]}${pageNumber}`}
            >
              {pageNumber}
            </Link>
          </li>
        ))}

        {page === totalPages ? (
          <>
            <li>
              <div
                className={`${styles.listItem} ${styles.disabled}`}
                aria-disabled="true"
              >
                {nextPageTitle}
              </div>
            </li>
            <li>
              <div
                className={`${styles.listItem} ${styles.disabled}`}
                aria-disabled="true"
              >
                {lastPageTitle}
              </div>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link
                className={styles.listItem}
                href={nextPage}
                aria-label={linkTitle.nextPage[CURRENT_LANGUAGE]}
                title={linkTitle.nextPage[CURRENT_LANGUAGE]}
              >
                {nextPageTitle}
              </Link>
            </li>
            <li>
              <Link
                className={styles.listItem}
                href={lastPage}
                aria-label={linkTitle.lastPage[CURRENT_LANGUAGE]}
                title={linkTitle.lastPage[CURRENT_LANGUAGE]}
              >
                {lastPageTitle}
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Pagination;
