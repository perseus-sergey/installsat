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
    <div className="flex p-4 items-center flex-wrap gap-4 justify-center sm:justify-between">
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
            className={`${styles.ResetAllButton} text-4xl text-green-600 w-10 h-10 rounded-full hover:text-red-700`}
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
