'use client';

import React, { ReactNode } from 'react';
import styles from './BreadCrumbs.module.scss';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { capitalizedWord } from '@/libs/utils';

interface IBreadCrumbProps extends React.HTMLAttributes<HTMLElement> {
  homeElement: ReactNode;
  separator?: ReactNode;
  activeLinkColor?: string;
  isCapitalizeLinks?: boolean;
}

const BreadCrumb = ({
  className,
  homeElement,
  activeLinkColor,
  isCapitalizeLinks,
  separator = '჻',
}: IBreadCrumbProps) => {
  const paths = usePathname();
  const pathNames = paths.split('/').filter((path) => path);

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
          <Link href={'/'}>{homeElement}</Link>
        </li>
        {pathNames.length > 0 && (
          <span className={styles.separator}> {separator} </span>
        )}
        {pathNames.map((link, index) => {
          const href = `/${pathNames.slice(0, index + 1).join('/')}`;
          const itemStyle =
            paths === href && activeLinkColor
              ? { color: activeLinkColor }
              : undefined;
          const itemClassName =
            paths === href
              ? `${styles.item} ${styles.activeItem}`
              : styles.item;
          const itemLink = isCapitalizeLinks ? capitalizedWord(link) : link;

          return (
            <React.Fragment key={index}>
              <li className={itemClassName} style={itemStyle}>
                <Link href={href}>{itemLink}</Link>
              </li>
              {pathNames.length !== index + 1 && (
                <span className={styles.separator}> {separator} </span>
              )}
            </React.Fragment>
          );
        })}
      </ol>
    </nav>
  );
};

export default React.memo(BreadCrumb);
