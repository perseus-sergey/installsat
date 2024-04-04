'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import styles from './Filter.module.scss';
import { EUrlSearchParam } from '@/models/url.model';
import { META_ALL_SAT_CHANNEL_LIST } from '@/models/channelList.model';
import BaseButton from '../buttons/BaseButton/BaseButton';
import { useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { CURRENT_LANGUAGE } from '@/models/ui.model';
import TooltipSimple from '../TooltipSimple/TooltipSimple';

const { ariaLabel, imgStr, searchIconStr } =
  META_ALL_SAT_CHANNEL_LIST.filtering.filterByChannelName.cancelButton;

interface IFilterProps {
  placeholder: string;
  labelTitle: string;
  searchQueryTitle: EUrlSearchParam;
  resetButton: { ariaLabel: string; content: string };
}

export default function Filter({
  placeholder,
  labelTitle,
  searchQueryTitle,
  resetButton: { ariaLabel: resetBtnAriaL, content: resetBtnContent },
}: IFilterProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const [searchValue, setSearchValue] = useState(
    searchParams.get(searchQueryTitle)?.toString()
  );

  const handleSearch = (term: string) => {
    setSearchValue(term);

    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set(searchQueryTitle, term);
    } else {
      params.delete(searchQueryTitle);
    }
    replace(`${pathname}?${params.toString()}`);
  };

  const handleSearchDebounced = useDebouncedCallback(handleSearch, 300);

  const cancelClick = () => {
    if (!searchValue) return;

    handleSearch('');
    setSearchValue('');
  };

  const resetAll = () => {
    setSearchValue('');
    replace(pathname);
  };

  return (
    <div className={styles.filterInputBlock}>
      <label htmlFor="search" className="sr-only">
        {labelTitle}
      </label>
      <div className={styles.inputWrapper}>
        <div className={styles.inputBlock}>
          <input
            className={styles.inputField}
            placeholder={placeholder}
            onChange={(e) => {
              handleSearchDebounced(e.target.value);
            }}
            value={searchValue}
          />
          <span className={styles.searchIcon}>{searchIconStr}</span>
        </div>
        <TooltipSimple tooltipText={ariaLabel[CURRENT_LANGUAGE]}>
          <BaseButton
            onClick={cancelClick}
            className={styles.cancelButton}
            ariaLabel={ariaLabel[CURRENT_LANGUAGE]}
          >
            {imgStr}
          </BaseButton>
        </TooltipSimple>
      </div>
      <TooltipSimple tooltipText={resetBtnAriaL}>
        <BaseButton
          className={styles.ResetAllButton}
          data-testid="ResetFiltersButton"
          ariaLabel={resetBtnAriaL}
          onClick={resetAll}
        >
          {resetBtnContent}
        </BaseButton>
      </TooltipSimple>
    </div>
  );
}
