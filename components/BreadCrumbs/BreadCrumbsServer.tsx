import React, { ReactNode } from 'react';
import styles from './BreadCrumbs.module.scss';
import {
  BREAD_CRUMBS,
  BREAD_SEPARATOR,
  CUT_LAST_ELEMENT,
  FIRST_ELEMENT_SIZE,
} from '@/models/breadCrumbs.model';
import { ELanguage } from '@/models/ui.model';
import { cutMiddleOfText } from '@/libs/utils/utils';
import TooltipSimple from '../ui/tooltips/TooltipSimple/TooltipSimple';
import SeoLink from '../ui/SeoLink/SeoLink';

const { lengthThreshold, numberOfEndWords, numberOfStartWords } =
  CUT_LAST_ELEMENT;

export interface IBreadCrumbLink {
  title: { [ELanguage.UA]: string; [ELanguage.EN]: string } | string;
  href?: string;
}

interface IProps extends React.HTMLAttributes<HTMLElement> {
  lang: ELanguage;
  breadCrumbList?: (IBreadCrumbLink | string)[];
  homeTitle?: ReactNode;
  separator?: ReactNode;
  activeLinkColor?: string;
  hasHomeLink?: boolean;
}

const BreadCrumbServer = ({
  lang,
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
            <SeoLink
              href={`/${lang}${BREAD_CRUMBS.BASE_PATH.href}`}
              style={{ fontSize: FIRST_ELEMENT_SIZE }}
              className="hover:underline"
              title={
                lang === ELanguage.UA
                  ? `Перейти до початкової сторінки`
                  : `Go to the home page`
              }
            >
              {homeTitle || BREAD_CRUMBS.BASE_PATH.title[lang]}
            </SeoLink>
          </li>
        )}
        {breadCrumbList && breadCrumbList.length > 0 && (
          <>
            {hasHomeLink && <li className={styles.separator}> {separator} </li>}
            {breadCrumbList.map((item, index) => {
              if (!item) return;

              const isCurrentUrl = breadCrumbList.length === index + 1;
              const linkText =
                typeof item === 'string'
                  ? item
                  : typeof item.title === 'string'
                    ? item.title
                    : item.title[lang];
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
                      <SeoLink
                        href={`/${lang}/${item.href}`}
                        className="hover:underline"
                        title={
                          lang === ELanguage.UA
                            ? `Перейти до сторінки "${linkText}"`
                            : `Go to page "${linkText}"`
                        }
                      >
                        {linkText}
                      </SeoLink>
                    ) : (
                      <div>{linkText}</div>
                    )}
                  </li>
                  <li className={styles.separator}> {separator} </li>
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
                          <SeoLink
                            href={`/${lang}/${item.href}`}
                            className="hover:underline"
                            title={
                              lang === ELanguage.UA
                                ? `Перейти до сторінки "${truncatedLinkText}"`
                                : `Go to page "${truncatedLinkText}"`
                            }
                          >
                            {truncatedLinkText}
                          </SeoLink>
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
