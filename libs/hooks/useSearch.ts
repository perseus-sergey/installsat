import { EUrlSearchParam } from '@/models/url.model';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';

const useSearch = (
  searchQueryTitle: EUrlSearchParam,
  debounceTimeInterval = 300
) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const [searchValue, setSearchValue] = useState(
    searchParams.get(searchQueryTitle)?.toString()
  );

  const handleSearch = (term: string) => {
    setSearchValue(term);

    const params = new URLSearchParams(searchParams);
    if (params.has(EUrlSearchParam.PAGE)) params.set(EUrlSearchParam.PAGE, '1');

    if (term) {
      params.set(searchQueryTitle, term);
    } else {
      params.delete(searchQueryTitle);
    }
    replace(`${pathname}?${params.toString()}`);
  };

  const handleSearchDebounced = useDebouncedCallback(
    handleSearch,
    debounceTimeInterval
  );

  const cancelClickHandler = () => {
    if (!searchValue) return;

    handleSearch('');
    setSearchValue('');
  };

  return {
    searchValue,
    setSearchValue,
    handleSearchDebounced,
    cancelClickHandler,
  };
};

export default useSearch;
