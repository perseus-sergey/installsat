'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import styles from './Filter.module.scss';
import { EUrlSearchParam } from '@/models/url.model';
import { META_ALL_SAT_CHANNEL_LIST } from '@/models/channelList.model';
import BaseButton from '../buttons/BaseButton/BaseButton';
import { useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { CURRENT_LANGUAGE } from '@/models/ui.model';

const { ariaLabel, imgStr, searchIconStr } =
  META_ALL_SAT_CHANNEL_LIST.filtering.filterByChannelName.cancelButton;

interface IFilterProps {
  placeholder: string;
  labelTitle: string;
  searchQueryTitle: EUrlSearchParam;
}

export default function Filter({
  placeholder,
  labelTitle,
  searchQueryTitle,
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

  return (
    <div className={styles.filterInputBlock}>
      <label htmlFor="search" className="sr-only">
        {labelTitle}
      </label>
      <div className={styles.inputWrapper}>
        <input
          className={styles.inputField}
          placeholder={placeholder}
          onChange={(e) => {
            handleSearchDebounced(e.target.value);
          }}
          value={searchValue}
        />
        <span className={styles.searchIcon}>{searchIconStr}</span>
        <BaseButton
          onClick={cancelClick}
          className={styles.cancelButton}
          ariaLabel={ariaLabel[CURRENT_LANGUAGE]}
        >
          {imgStr}
        </BaseButton>
      </div>
    </div>
  );
}
