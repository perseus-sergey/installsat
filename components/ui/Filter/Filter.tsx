'use client';

import { usePathname, useRouter } from 'next/navigation';
import styles from './Filter.module.scss';
import { EUrlSearchParam } from '@/models/url.model';
import { META_ALL_SAT_CHANNEL_LIST } from '@/models/channelList.model';
import BaseButton from '../buttons/BaseButton/BaseButton';
import TooltipSimple from '../tooltips/TooltipSimple/TooltipSimple';
import useSearch from '@/libs/hooks/useSearch';
import StyledInputField from '../StyledInputField/StyledInputField';
import { ELanguage } from '@/models/ui.model';

const { cancelBtnAriaLabel, searchIconStr } =
  META_ALL_SAT_CHANNEL_LIST.filtering.filterByChannelName;

interface IFilterProps {
  lang: ELanguage;
  idName: string;
  placeholder: string;
  labelTitle: string;
  searchQueryTitle: EUrlSearchParam;
  resetButton?: { ariaLabel: string; content: string };
}

export default function Filter({
  lang,
  idName,
  placeholder,
  labelTitle,
  searchQueryTitle,
  resetButton,
}: IFilterProps) {
  const pathname = usePathname();
  const { replace, refresh } = useRouter();

  const { searchValue, inputRef, handleSearchDebounced, cancelClickHandler } =
    useSearch(searchQueryTitle, 700);

  const resetAll = () => {
    if (inputRef.current) inputRef.current.value = '';
    // setSearchValue('');
    replace(pathname);
    refresh();
  };

  return (
    <div className={styles.filterInputBlock}>
      <StyledInputField
        idName={idName}
        handleOnChange={handleSearchDebounced}
        cancelClick={cancelClickHandler}
        inputRef={inputRef}
        value={searchValue}
        placeholder={placeholder}
        hiddenLabelTitle={labelTitle}
        searchIconStr={searchIconStr}
        cancelBtnAriaLabel={cancelBtnAriaLabel[lang]}
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
