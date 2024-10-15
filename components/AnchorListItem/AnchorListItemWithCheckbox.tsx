'use client';

import Link from 'next/link';
import styles from './AnchorListItem.module.scss';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import TooltipSimple from '../ui/tooltips/TooltipSimple/TooltipSimple';
import { EUrlSearchParam } from '@/models/url/urlSearch.model';

interface IAnchorListItemProps {
  linkParams: {
    title: string;
    href: string;
    'aria-label': string;
  };
  inputAttributes: {
    id: string;
    name: string;
    value: string;
    'aria-label': string;
  };
  searchQueryName: EUrlSearchParam;
}

const AnchorListItemWithCheckbox = ({
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
    <div className={styles.AnchorListItemWithCheckbox}>
      <TooltipSimple tooltipText={inputAttributes['aria-label']}>
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
        <TooltipSimple tooltipText={linkParams['aria-label']}>
          <Link {...linkParams} className={styles.linkText}>
            {linkParams.title}
          </Link>
        </TooltipSimple>
      ) : (
        <span className={styles.notLinkText}>{linkParams.title}</span>
      )}
    </div>
  );
};

export default AnchorListItemWithCheckbox;
