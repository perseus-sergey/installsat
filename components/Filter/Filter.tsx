'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import styles from './Filter.module.scss';
import { EUrlSearchParam } from '@/models/url.model';

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

  function handleSearch(term: string) {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set(searchQueryTitle, term);
    } else {
      params.delete(searchQueryTitle);
    }
    replace(`${pathname}?${params.toString()}`);
  }

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
            handleSearch(e.target.value);
          }}
          defaultValue={searchParams.get(searchQueryTitle)?.toString()}
        />
        <span className={styles.searchIcon}>⏿</span>
      </div>
    </div>
  );
}
