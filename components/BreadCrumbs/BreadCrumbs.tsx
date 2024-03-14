'use client';

import React, { ReactNode, useEffect, useState } from 'react';
import styles from './BreadCrumbs.module.scss';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { capitalizedWord } from '@/libs/utils';
import { BREAD_SEPARATOR, MBreadCrumbs } from '@/models/breadCrumbs.model';
import { EUrlBaseParam } from '@/models/url.model';
import { ILang } from '@/models/ui.model';

interface IBreadCrumbProps extends React.HTMLAttributes<HTMLElement> {
  language?: keyof ILang;
  homeElement?: ReactNode;
  separator?: ReactNode;
  activeLinkColor?: string;
  isCapitalizeLinks?: boolean;
}

const BreadCrumb = ({
  language = 'ua',
  className,
  activeLinkColor,
  isCapitalizeLinks = true,
  separator = BREAD_SEPARATOR,
}: IBreadCrumbProps) => {
  const paths = usePathname();
  const [homeElement, setHomeElement] = useState<string>('');
  const [pathNames, setPathNames] = useState<string[]>([]);
  const [handledPaths, setHandledPaths] = useState<string[]>([]);

  useEffect(() => {
    const homeObj = MBreadCrumbs.get(EUrlBaseParam.BASE_PATH);
    setHomeElement(homeObj ? homeObj[language] : 'Home');

    const pathTitles = paths.split('/').filter((path) => path);
    setPathNames(pathTitles);
    setHandledPaths(
      pathTitles.map((segment) => {
        const mappedSegment = MBreadCrumbs.get(segment as EUrlBaseParam);
        const findSegment = mappedSegment ? mappedSegment[language] : segment;

        return isCapitalizeLinks ? capitalizedWord(findSegment) : findSegment;
      })
    );
  }, []);

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
          <Link href={EUrlBaseParam.BASE_PATH}>{homeElement}</Link>
        </li>
        {pathNames.length > 0 && (
          <span className={styles.separator}> {separator} </span>
        )}
        {handledPaths.map((link, index) => {
          const href = `/${pathNames.slice(0, index + 1).join('/')}`;
          const itemStyle =
            paths === href && activeLinkColor
              ? { color: activeLinkColor }
              : undefined;
          const itemClassName =
            paths === href
              ? `${styles.item} ${styles.activeItem}`
              : styles.item;

          return (
            <React.Fragment key={index}>
              <li className={itemClassName} style={itemStyle}>
                <Link href={href}>{link}</Link>
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
