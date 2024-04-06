import { EUrlSearchParam } from '@/models/url.model';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useRef, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';

const useSearch = (searchQueryTitle: EUrlSearchParam, debounceDelay = 300) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const [searchValue] = useState(
    searchParams.get(searchQueryTitle)?.toString()
  );
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSearch = (term: string) => {
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
    debounceDelay
  );

  const cancelClickHandler = () => {
    if (!inputRef.current) return;

    handleSearch('');
    inputRef.current.value = '';
  };

  return {
    searchValue,
    inputRef,
    handleSearchDebounced,
    cancelClickHandler,
  };
};

export default useSearch;
