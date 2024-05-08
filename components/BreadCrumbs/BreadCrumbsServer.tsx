import React, { ReactNode } from 'react';
import styles from './BreadCrumbs.module.scss';
import Link from 'next/link';
import {
  BREAD_SEPARATOR,
  BREAD_START_ELEMENT_TITLE,
  FIRST_ELEMENT_SIZE,
  MBreadCrumbs,
} from '@/models/breadCrumbs.model';
import { EUrlBaseParam } from '@/models/url.model';
import { ELanguage, LANGUAGE } from '@/models/ui.model';
import { cutMiddleOfText } from '@/libs/utils/utils';

export interface IBreadCrumbLink {
  title: { [ELanguage.UA]: string; [ELanguage.EN]: string } | string;
  href?: string;
}

interface IProps extends React.HTMLAttributes<HTMLElement> {
  breadCrumbList?: (IBreadCrumbLink | string)[];
  homeTitle?: ReactNode;
  separator?: ReactNode;
  activeLinkColor?: string;
}

const BreadCrumbServer = ({
  breadCrumbList,
  className,
  activeLinkColor,
  homeTitle,
  separator = BREAD_SEPARATOR,
}: IProps) => {
  const homeObj = MBreadCrumbs.get(EUrlBaseParam.BASE_PATH);
  const homeElement = homeTitle
    ? homeTitle
    : homeObj
      ? homeObj[LANGUAGE]
      : BREAD_START_ELEMENT_TITLE;

  return (
    <nav
      aria-label="Breadcrumb"
      className={
        className ? `${styles.BreadCrumb} ${className}` : styles.BreadCrumb
      }
      data-testid="BreadCrumb"
    >
      <ol className={styles.container}>
        <li className={`${styles.item} ${styles.firstItem}`}>
          <Link
            href={EUrlBaseParam.BASE_PATH}
            style={{ fontSize: FIRST_ELEMENT_SIZE }}
            className="hover:underline"
          >
            {homeElement}
          </Link>
        </li>
        {breadCrumbList && breadCrumbList.length > 0 && (
          <>
            <span className={styles.separator}> {separator} </span>
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

              const truncatedLinkText = cutMiddleOfText(linkText, 35, 2, 1);

              return (
                <React.Fragment key={index}>
                  <li className={itemClassName} style={itemStyle}>
                    {typeof item !== 'string' && item.href ? (
                      <Link href={`/${item.href}`} className="hover:underline">
                        {linkText}
                      </Link>
                    ) : (
                      <div>{truncatedLinkText}</div>
                    )}
                  </li>
                  {!isCurrentUrl && (
                    <span className={styles.separator}> {separator} </span>
                  )}
                </React.Fragment>
              );
            })}
          </>
        )}
      </ol>
    </nav>
  );
};

export default BreadCrumbServer;
