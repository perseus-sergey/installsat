'use client';

import Link from 'next/link';
import styles from './AnchorListItem.module.scss';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { EUrlSearchParam } from '@/models/url.model';
import TooltipSimple from '../TooltipSimple/TooltipSimple';

interface IAnchorListItemProps {
  linkParams: {
    title: string;
    href: string;
  };
  inputAttributes: {
    id: string;
    name: string;
    value: string;
  };
  searchQueryName: EUrlSearchParam;
}

const AnchorListItem = ({
  linkParams,
  inputAttributes,
  searchQueryName,
}: IAnchorListItemProps) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const isSearchQuerySatExist = searchParams.get(searchQueryName);

  const isChecked =
    searchParams.getAll(searchQueryName)?.includes(inputAttributes.value) ||
    false;

  const onChange = (isChecked: boolean) => {
    const params = new URLSearchParams(searchParams);
    if (isChecked) {
      params.append(searchQueryName, inputAttributes.value);
    } else {
      params.delete(searchQueryName, inputAttributes.value);
    }
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className={styles.AnchorListItem}>
      <TooltipSimple tooltipText="Обрати супутник">
        <div className={styles.checkboxWrapper}>
          <input
            type="checkbox"
            {...inputAttributes}
            checked={isChecked}
            onChange={(e) => onChange(e.target.checked)}
          />
          <label htmlFor={inputAttributes.id}></label>
        </div>
      </TooltipSimple>
      {!isSearchQuerySatExist || (isSearchQuerySatExist && isChecked) ? (
        <TooltipSimple tooltipText="Перейти до супутника">
          <Link href={linkParams.href} className={styles.linkText}>
            {linkParams.title}
          </Link>
        </TooltipSimple>
      ) : (
        <span className={styles.notLinkText}>{linkParams.title}</span>
      )}
    </div>
  );
};

export default AnchorListItem;
