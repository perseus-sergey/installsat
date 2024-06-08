import React, { ReactNode } from 'react';
import styles from './BreadCrumbs.module.scss';
import Link from 'next/link';
import {
  BREAD_CRUMBS,
  BREAD_SEPARATOR,
  CUT_LAST_ELEMENT,
  FIRST_ELEMENT_SIZE,
} from '@/models/breadCrumbs.model';
import { ELanguage, LANGUAGE } from '@/models/ui.model';
import { cutMiddleOfText } from '@/libs/utils/utils';
import TooltipSimple from '../ui/tooltips/TooltipSimple/TooltipSimple';

const { lengthThreshold, numberOfEndWords, numberOfStartWords } =
  CUT_LAST_ELEMENT;

export interface IBreadCrumbLink {
  title: { [ELanguage.UA]: string; [ELanguage.EN]: string } | string;
  href?: string;
}

interface IProps extends React.HTMLAttributes<HTMLElement> {
  breadCrumbList?: (IBreadCrumbLink | string)[];
  homeTitle?: ReactNode;
  separator?: ReactNode;
  activeLinkColor?: string;
  hasHomeLink?: boolean;
}

const BreadCrumbServer = ({
  breadCrumbList,
  className,
  activeLinkColor,
  homeTitle,
  separator = BREAD_SEPARATOR,
  hasHomeLink = true,
}: IProps) => {
  return (
    <nav
      aria-label="Breadcrumb"
      className={
        className ? `${styles.BreadCrumb} ${className}` : styles.BreadCrumb
      }
      data-testid="BreadCrumb"
    >
      <ol className={styles.container}>
        {hasHomeLink && (
          <li className={`${styles.item} ${styles.firstItem}`}>
            <Link
              href={BREAD_CRUMBS.BASE_PATH.href}
              style={{ fontSize: FIRST_ELEMENT_SIZE }}
              className="hover:underline"
            >
              {homeTitle || BREAD_CRUMBS.BASE_PATH.title[LANGUAGE]}
            </Link>
          </li>
        )}
        {breadCrumbList && breadCrumbList.length > 0 && (
          <>
            {hasHomeLink && (
              <span className={styles.separator}> {separator} </span>
            )}
            {breadCrumbList.map((item, index) => {
              const isCurrentUrl = breadCrumbList.length === index + 1;
              const linkText =
                typeof item === 'string'
                  ? item
                  : typeof item.title === 'string'
                    ? item.title
                    : item.title[LANGUAGE];
              const itemStyle =
                isCurrentUrl && activeLinkColor
                  ? { color: activeLinkColor }
                  : undefined;
              const itemClassName = isCurrentUrl
                ? `${styles.item} ${styles.activeItem}`
                : styles.item;

              const truncatedLinkText = cutMiddleOfText(
                linkText,
                lengthThreshold,
                numberOfStartWords,
                numberOfEndWords
              );

              return !isCurrentUrl ? (
                <React.Fragment key={index}>
                  <li className={itemClassName} style={itemStyle}>
                    {typeof item !== 'string' && item.href ? (
                      <Link href={`/${item.href}`} className="hover:underline">
                        {linkText}
                      </Link>
                    ) : (
                      <div>{linkText}</div>
                    )}
                  </li>
                  <span className={styles.separator}> {separator} </span>
                </React.Fragment>
              ) : (
                <React.Fragment key={index}>
                  <li className={itemClassName} style={itemStyle}>
                    {typeof item !== 'string' && item.href ? (
                      <>
                        <LastBreadCrumbElement
                          tooltipText={linkText}
                          isTooltip={
                            linkText.length !== truncatedLinkText.length
                          }
                        >
                          <Link
                            href={`/${item.href}`}
                            className="hover:underline"
                          >
                            {truncatedLinkText}
                          </Link>
                        </LastBreadCrumbElement>
                      </>
                    ) : (
                      <LastBreadCrumbElement
                        tooltipText={linkText}
                        isTooltip={linkText.length !== truncatedLinkText.length}
                      >
                        <span>{truncatedLinkText}</span>
                      </LastBreadCrumbElement>
                    )}
                  </li>
                </React.Fragment>
              );
            })}
          </>
        )}
      </ol>
    </nav>
  );
};

const LastBreadCrumbElement = ({
  children,
  isTooltip = false,
  tooltipText,
}: {
  children: ReactNode;
  tooltipText?: string;
  isTooltip?: boolean;
}) => {
  return isTooltip ? (
    <TooltipSimple tooltipText={tooltipText} isTooltipBottomOfPage>
      {children}
    </TooltipSimple>
  ) : (
    <>{children}</>
  );
};

export default BreadCrumbServer;
