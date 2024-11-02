'use client';

import { EDBTableTitles } from '@/models/dbTblNames.model';
import TooltipSimple from '../../ui/tooltips/TooltipSimple/TooltipSimple';
import { useEffect, useState } from 'react';
import BaseButton from '../../ui/buttons/BaseButton/BaseButton';
import { getComments } from '@/controllers/comments.controller';
import { COMMENTS_MODEL, ICommentsModel } from '@/models/ui/comments.model';
import { getFormattedDateStrYearFirst } from '@/libs/utils/dates';
import Image from 'next/image';
import commentTitleImg from 'public/Images/mail_post_to_5295.png';
import { getPageNumbers } from '@/controllers/pagination.controller';
import { ARTICLE_PAGINATION_PARAMS } from '@/models/articles/articleList.model';
import { ELanguage } from '@/models/language.model';

const { commentList } = COMMENTS_MODEL;

const {
  nextPageTitle,
  previousPageTitle,
  firstPageTitle,
  lastPageTitle,
  linkTitle,
} = ARTICLE_PAGINATION_PARAMS;

interface IPaginationProps {
  offsetNumber: number;
  numberOfComments: number;
  commentsPerPage: number;
  commentsDBTblName: EDBTableTitles;
  articleId: string | number;
  lang: ELanguage;
}

const minSizeSmallStyle = 'min-w-7 min-h-7';
const minSizeBigStyle = 'sm:min-w-9 sm:min-h-9';
const listItemBaseStyle = `${minSizeSmallStyle} ${minSizeBigStyle} flex flex-wrap justify-center items-center font-normal no-underline border border-solid border-black/25 border-l-0`;
const listItemStyle = `${listItemBaseStyle} text-white/85 hover:bg-white/20 active:border-l-[1px] active:shadow shadow-[inset_0px_1px_0px_0px_rgba(255,255,255,0.35)]`;
const currentPageNStyle = `${listItemBaseStyle} pt-0.5 sm:pt-1 text-white bg-white/35 cursor-default pointer-events-none shadow-[inset_0px_2px_1px_0px_rgba(0,0,0,0.25)]`;
const commentTextShadow = { textShadow: '1px 1px 0px black' };

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
      setNumbersOfPages(
        getPageNumbers({ offsetNumber, totalPages, currentPage: pageNumber })
      );
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
        <h3
          className="flex items-center justify-center gap-4 p-2 text-2xl italic font-bold font-verdana border-t-4 border-double"
          style={commentTextShadow}
        >
          <Image src={commentTitleImg} alt={commentList.image.alt[lang]} />
          {commentList.title[lang]} ({numberOfComments})
        </h3>
        <ul>
          {comments.map((comment) => {
            const country = comment.country ? `(${comment.country})` : '';

            return (
              <li
                key={comment.id}
                className="pb-2 font-verdana"
                style={{ borderTop: '2px groove #777777' }}
              >
                <span className="text-stone-300 text-sm">{`(${getFormattedDateStrYearFirst(comment.date, lang)})  `}</span>
                <span
                  className="text-stone-300 font-georgia"
                  style={commentTextShadow}
                >{`${comment.author} ${country}`}</span>
                <p className="p-2 font-bold text-sm" style={commentTextShadow}>
                  ... {comment.text}
                </p>
              </li>
            );
          })}
        </ul>

        {totalPages > 1 && (
          <nav className="flex justify-center py-4" data-testid="Pagination">
            <ul
              className={`shadow-[0px_3px_5px_rgba(0,0,0,0.25)] w-fit p-0 sm:p-2 bg-white/60 flex justify-center items-center border`}
            >
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
                  ariaLabel={
                    numb === pageNumber
                      ? `${linkTitle.currentPage[lang]}${numb}`
                      : `${linkTitle.pageStartStr[lang]}${numb}`
                  }
                  onClick={() => setPageNumber(numb)}
                  innerText={numb}
                  className={
                    numb === pageNumber ? currentPageNStyle : listItemStyle
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
  <li className="bg-cyan-600">
    <TooltipSimple tooltipText={ariaLabel}>
      <BaseButton
        className={className || listItemStyle}
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
      className={`${listItemStyle} bg-stone-500/70 text-stone-200 cursor-default pointer-events-none`}
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
