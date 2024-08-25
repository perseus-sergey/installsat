'use client';

import styles from './PaginationComments.module.scss';
import { ARTICLES } from '@/models/articles.model';
import { EDBTableTitles, ELanguage } from '@/models/ui.model';
import TooltipSimple from '../../ui/tooltips/TooltipSimple/TooltipSimple';
import { useEffect, useState } from 'react';
import BaseButton from '../../ui/buttons/BaseButton/BaseButton';
import { getComments } from '@/controllers/comments.controller';
import FillingImg from '@/components/ui/Images/FillingImage';
import { COMMENTS_MODEL, ICommentsModel } from '@/models/comments.model';
import { getFormattedDateStr } from '@/libs/utils/dates';

const { commentList } = COMMENTS_MODEL;

const {
  nextPageTitle,
  previousPageTitle,
  firstPageTitle,
  lastPageTitle,
  linkTitle,
} = ARTICLES.articleList.pagination;

interface IPaginationProps {
  offsetNumber: number;
  numberOfComments: number;
  commentsPerPage: number;
  commentsDBTblName: EDBTableTitles;
  articleId: string | number;
  lang: ELanguage;
}

const getPageNumbers = (
  offsetNumber: number,
  totalPages: number,
  page: number
): number[] => {
  const pageNumbers = [];

  for (let i = page - offsetNumber; i <= page + offsetNumber; i += 1) {
    if (i >= 1 && i <= totalPages) {
      pageNumbers.push(i);
    }
  }

  return pageNumbers;
};

const PaginationComments = ({
  offsetNumber,
  commentsPerPage,
  commentsDBTblName,
  articleId,
  numberOfComments,
  lang,
}: IPaginationProps) => {
  const [comments, setComments] = useState<ICommentsModel[]>();
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [numbersOfPages, setNumbersOfPages] = useState([1]);

  useEffect(() => {
    const setCommentsParams = async () => {
      setTotalPages(Math.ceil(numberOfComments / commentsPerPage));
      setPageNumber(1);
    };

    setCommentsParams();
  }, [articleId, commentsDBTblName, commentsPerPage, numberOfComments]);

  useEffect(() => {
    const getCommentsChunk = async () => {
      const resp = await getComments(
        commentsDBTblName,
        articleId,
        (pageNumber - 1) * commentsPerPage,
        commentsPerPage
      );

      setComments(resp instanceof Error ? [] : resp);
      setNumbersOfPages(getPageNumbers(offsetNumber, totalPages, pageNumber));
    };

    getCommentsChunk();
  }, [
    numberOfComments,
    articleId,
    commentsDBTblName,
    commentsPerPage,
    offsetNumber,
    pageNumber,
    totalPages,
  ]);

  return (
    comments &&
    comments.length > 0 && (
      <>
        <h3 className={styles.commentsTitle}>
          <FillingImg
            {...commentList.image}
            alt={commentList.image.alt[lang]}
          />
          {commentList.title[lang]} ({numberOfComments})
        </h3>
        <ul className={styles.CommentList}>
          {comments.map((comment) => {
            const country = comment.country ? `(${comment.country})` : '';

            return (
              <li key={comment.id} className={styles.commentContainer}>
                <span
                  className={styles.commentDate}
                >{`(${getFormattedDateStr(comment.date)})  `}</span>
                <span
                  className={styles.commentAuthor}
                >{`${comment.author} ${country}`}</span>
                <p className={styles.commentText}>... {comment.text}</p>
              </li>
            );
          })}
        </ul>

        {totalPages > 1 && (
          <nav className={styles.Pagination} data-testid="Pagination">
            <ul className={styles.paginationList}>
              <Controls
                isDisabled={pageNumber === 1}
                controls={[
                  {
                    ariaLabel: linkTitle.firstPage[lang],
                    onClick: () => setPageNumber(1),
                    innerText: firstPageTitle,
                  },
                  {
                    ariaLabel: linkTitle.previousPage[lang],
                    onClick: () => setPageNumber((page) => page - 1 || 1),
                    innerText: previousPageTitle,
                  },
                ]}
              />

              {numbersOfPages.map((numb) => (
                <ControlButton
                  key={numb}
                  ariaLabel={`${linkTitle.pageStartStr[lang]}${numb}`}
                  onClick={() => setPageNumber(numb)}
                  innerText={numb}
                  className={
                    numb === pageNumber
                      ? styles.currentPageNumber
                      : styles.listItem
                  }
                />
              ))}

              <Controls
                isDisabled={pageNumber === totalPages}
                controls={[
                  {
                    ariaLabel: linkTitle.nextPage[lang],
                    onClick: () => setPageNumber((page) => page + 1),
                    innerText: nextPageTitle,
                  },
                  {
                    ariaLabel: linkTitle.lastPage[lang],
                    onClick: () => setPageNumber(totalPages),
                    innerText: lastPageTitle,
                  },
                ]}
              />
            </ul>
          </nav>
        )}
      </>
    )
  );
};

interface IPrps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  ariaLabel: string;
  innerText: string | number;
}

const ControlButton = ({
  ariaLabel,
  innerText,
  className,
  ...attributes
}: IPrps) => (
  <li>
    <TooltipSimple tooltipText={ariaLabel}>
      <BaseButton
        className={className || styles.listItem}
        ariaLabel={ariaLabel}
        title={ariaLabel}
        {...attributes}
      >
        {innerText}
      </BaseButton>
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

export default PaginationComments;
