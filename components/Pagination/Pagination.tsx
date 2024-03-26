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
                aria-label={linkTitle.firstPage.ua}
                title={linkTitle.firstPage.ua}
              >
                {firstPageTitle}
              </Link>
            </li>
            <li>
              <Link
                className={styles.listItem}
                href={prevPage}
                aria-label={linkTitle.previousPage.ua}
                title={linkTitle.previousPage.ua}
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
              href={makeUrlSearchParamsStr(pageNumber)}
              aria-label={`${linkTitle.pageStartStr.ua}${pageNumber}`}
              title={`${linkTitle.pageStartStr.ua}${pageNumber}`}
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
                aria-label={linkTitle.nextPage.ua}
                title={linkTitle.nextPage.ua}
              >
                {nextPageTitle}
              </Link>
            </li>
            <li>
              <Link
                className={styles.listItem}
                href={lastPage}
                aria-label={linkTitle.lastPage.ua}
                title={linkTitle.lastPage.ua}
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
