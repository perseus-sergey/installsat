import { RefObject } from 'react';
import StyledInputField from '../StyledInputField/StyledInputField';

interface ISearchInputProps {
  cancelButton: { ariaLabel: string; content: string };
  handleSearch: (term: string) => void;
  inputRef: RefObject<HTMLInputElement>;
  searchValue: string | undefined;
  placeholder: string;
  labelTitle: string;
  tooltipText: string;
  searchIconStr: string;
  cancelClick: () => void;
}

const SearchInput = ({
  handleSearch,
  cancelClick,
  inputRef,
  searchValue,
  placeholder,
  labelTitle,
  tooltipText,
  searchIconStr,
  cancelButton: { ariaLabel: cancelAriaLab, content: cancelContent },
}: ISearchInputProps) => {
  return (
    <StyledInputField
      idName="search"
      handleOnChange={handleSearch}
      cancelClick={cancelClick}
      inputRef={inputRef}
      value={searchValue}
      placeholder={placeholder}
      hiddenLabelTitle={labelTitle}
      cancelTooltipText={tooltipText}
      searchIconStr={searchIconStr}
      cancelButton={{ ariaLabel: cancelAriaLab, content: cancelContent }}
    />
  );
};

export default SearchInput;
