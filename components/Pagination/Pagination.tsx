import Link from 'next/link';
import styles from './Pagination.module.scss';
import { EUrlSearchParam } from '@/models/url.model';
import { ARTICLES } from '@/models/articles.model';
import { LANGUAGE, TSearchParams } from '@/models/ui.model';
import { makeUrlSearchParams } from '@/libs/utils';
import TooltipSimple from '../TooltipSimple/TooltipSimple';

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

  const setUrlPage = (value: string | number): string => {
    urlSearchParams.set(EUrlSearchParam.PAGE, `${value}`);

    return `?${urlSearchParams.toString()}`;
  };

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
              <TooltipSimple tooltipText={linkTitle.firstPage[LANGUAGE]}>
                <Link
                  className={styles.listItem}
                  href={setUrlPage('1')}
                  aria-label={linkTitle.firstPage[LANGUAGE]}
                  title={linkTitle.firstPage[LANGUAGE]}
                >
                  {firstPageTitle}
                </Link>
              </TooltipSimple>
            </li>
            <li>
              <TooltipSimple tooltipText={linkTitle.previousPage[LANGUAGE]}>
                <Link
                  className={styles.listItem}
                  href={setUrlPage(`${page - 1 || 1}`)}
                  aria-label={linkTitle.previousPage[LANGUAGE]}
                  title={linkTitle.previousPage[LANGUAGE]}
                >
                  {previousPageTitle}
                </Link>
              </TooltipSimple>
            </li>
          </>
        )}

        {pageNumbers.map((pageNumber, index) => (
          <li key={index}>
            <TooltipSimple
              tooltipText={`${linkTitle.pageStartStr[LANGUAGE]}${pageNumber}`}
            >
              <Link
                className={
                  page === pageNumber
                    ? styles.currentPageNumber
                    : styles.listItem
                }
                href={setUrlPage(pageNumber)}
                aria-label={`${linkTitle.pageStartStr[LANGUAGE]}${pageNumber}`}
                title={`${linkTitle.pageStartStr[LANGUAGE]}${pageNumber}`}
              >
                {pageNumber}
              </Link>
            </TooltipSimple>
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
              <TooltipSimple tooltipText={linkTitle.nextPage[LANGUAGE]}>
                <Link
                  className={styles.listItem}
                  href={setUrlPage(`${page + 1}`)}
                  aria-label={linkTitle.nextPage[LANGUAGE]}
                  title={linkTitle.nextPage[LANGUAGE]}
                >
                  {nextPageTitle}
                </Link>
              </TooltipSimple>
            </li>
            <li>
              <TooltipSimple tooltipText={linkTitle.lastPage[LANGUAGE]}>
                <Link
                  className={styles.listItem}
                  href={setUrlPage(`${totalPages}`)}
                  aria-label={linkTitle.lastPage[LANGUAGE]}
                  title={linkTitle.lastPage[LANGUAGE]}
                >
                  {lastPageTitle}
                </Link>
              </TooltipSimple>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Pagination;
