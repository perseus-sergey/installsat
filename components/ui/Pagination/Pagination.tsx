import styles from './Pagination.module.scss';
import { EUrlSearchParam } from '@/models/url.model';
import { ELanguage, TSearchParams } from '@/models/ui.model';
import { makeUrlSearchParams } from '@/libs/utils/utils';
import TooltipSimple from '../tooltips/TooltipSimple/TooltipSimple';
import SeoLink from '../SeoLink/SeoLink';
import { ARTICLE_PAGINATION_PARAMS } from '@/models/articles.model';

const {
  nextPageTitle,
  previousPageTitle,
  firstPageTitle,
  lastPageTitle,
  linkTitle,
} = ARTICLE_PAGINATION_PARAMS;

interface IPaginationProps {
  page: number;
  offsetNumber: number;
  totalPages: number;
  searchParams?: TSearchParams;
  lang: ELanguage;
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
  lang,
}: IPaginationProps) => {
  if (!searchParams) return null;

  const urlSearchParams = makeUrlSearchParams(searchParams);

  const setUrlPage = (value: string | number): string => {
    urlSearchParams.set(EUrlSearchParam.PAGE, `${value}`);

    return `?${urlSearchParams.toString()}`;
  };

  const pageNumbers = getPageNumbers(page, offsetNumber, totalPages);

  return (
    totalPages > 1 && (
      <nav className={styles.Pagination} data-testid="Pagination">
        <ul className={styles.paginationList}>
          <Controls
            isDisabled={page === 1}
            controls={[
              {
                ariaLabel: linkTitle.firstPage[lang],
                href: setUrlPage('1'),
                innerText: firstPageTitle,
              },
              {
                ariaLabel: linkTitle.previousPage[lang],
                href: setUrlPage(`${page - 1 || 1}`),
                innerText: previousPageTitle,
              },
            ]}
          />

          {pageNumbers.map((pageNumber, index) => (
            <ControlButton
              key={index}
              ariaLabel={
                page === pageNumber
                  ? `${linkTitle.currentPage[lang]}${pageNumber}`
                  : `${linkTitle.pageStartStr[lang]}${pageNumber}`
              }
              href={setUrlPage(pageNumber)}
              innerText={pageNumber}
              className={
                page === pageNumber ? styles.currentPageNumber : styles.listItem
              }
            />
          ))}

          <Controls
            isDisabled={page === totalPages}
            controls={[
              {
                ariaLabel: linkTitle.nextPage[lang],
                href: setUrlPage(`${page + 1}`),
                innerText: nextPageTitle,
              },
              {
                ariaLabel: linkTitle.lastPage[lang],
                href: setUrlPage(`${totalPages}`),
                innerText: lastPageTitle,
              },
            ]}
          />
        </ul>
      </nav>
    )
  );
};

interface IPrps extends React.HTMLAttributes<HTMLElement> {
  ariaLabel: string;
  href: string;
  innerText: string | number;
}

const ControlButton = ({ ariaLabel, href, innerText, className }: IPrps) => (
  <li>
    <TooltipSimple tooltipText={ariaLabel}>
      <SeoLink
        className={className || styles.listItem}
        href={href}
        title={ariaLabel}
      >
        {innerText}
      </SeoLink>
    </TooltipSimple>
  </li>
);

const ControlDisabled = ({ innerText }: { innerText: string | number }) => (
  <li>
    <div
      className={`${styles.listItem} ${styles.disabled}`}
      aria-disabled="true"
    >
      {innerText}
    </div>
  </li>
);

interface IControlsProps extends React.HTMLAttributes<HTMLElement> {
  controls: IPrps[];
  isDisabled: boolean;
}

const Controls = ({ controls, isDisabled }: IControlsProps) =>
  isDisabled
    ? controls.map((contr) => (
        <ControlDisabled key={contr.innerText} innerText={contr.innerText} />
      ))
    : controls.map((attr) => <ControlButton {...attr} key={attr.innerText} />);

export default Pagination;
