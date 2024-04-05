'use client';

import { usePathname, useRouter } from 'next/navigation';
import styles from './Filter.module.scss';
import { EUrlSearchParam } from '@/models/url.model';
import { META_ALL_SAT_CHANNEL_LIST } from '@/models/channelList.model';
import BaseButton from '../buttons/BaseButton/BaseButton';
import { LANGUAGE } from '@/models/ui.model';
import TooltipSimple from '../TooltipSimple/TooltipSimple';
import SearchInput from '../SearchInput/SearchInput';
import useSearch from '@/libs/hooks/useSearch';

const { ariaLabel, imgStr, searchIconStr } =
  META_ALL_SAT_CHANNEL_LIST.filtering.filterByChannelName.cancelButton;

interface IFilterProps {
  placeholder: string;
  labelTitle: string;
  searchQueryTitle: EUrlSearchParam;
  resetButton?: { ariaLabel: string; content: string };
}

export default function Filter({
  placeholder,
  labelTitle,
  searchQueryTitle,
  resetButton,
}: IFilterProps) {
  const pathname = usePathname();
  const { replace } = useRouter();

  const {
    searchValue,
    setSearchValue,
    handleSearchDebounced,
    cancelClickHandler,
  } = useSearch(searchQueryTitle);

  const resetAll = () => {
    setSearchValue('');
    replace(pathname);
  };

  return (
    <div className={styles.filterInputBlock}>
      <SearchInput
        handleSearch={handleSearchDebounced}
        cancelClick={cancelClickHandler}
        searchValue={searchValue}
        placeholder={placeholder}
        labelTitle={labelTitle}
        tooltipText={ariaLabel[LANGUAGE]}
        searchIconStr={searchIconStr}
        cancelButton={{
          ariaLabel: ariaLabel[LANGUAGE],
          content: imgStr,
        }}
      />
      {resetButton && (
        <TooltipSimple tooltipText={resetButton.ariaLabel}>
          <BaseButton
            className={styles.ResetAllButton}
            data-testid="ResetFiltersButton"
            ariaLabel={resetButton.ariaLabel}
            onClick={resetAll}
          >
            {resetButton.content}
          </BaseButton>
        </TooltipSimple>
      )}
    </div>
  );
}
