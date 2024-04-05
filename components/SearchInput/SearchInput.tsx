import TooltipSimple from '../TooltipSimple/TooltipSimple';
import BaseButton from '../buttons/BaseButton/BaseButton';
import styles from './SearchInput.module.scss';

interface ISearchInputProps {
  cancelButton: { ariaLabel: string; content: string };
  handleSearch: (term: string) => void;
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
  searchValue,
  placeholder,
  labelTitle,
  tooltipText,
  searchIconStr,
  cancelButton: { ariaLabel: cancelAriaLab, content: cancelContent },
}: ISearchInputProps) => {
  return (
    <div className={styles.SearchInput} data-testid="SearchInput">
      <label htmlFor="search" className="sr-only">
        {labelTitle}
      </label>
      <div className={styles.inputWrapper}>
        <div className={styles.inputBlock}>
          <input
            className={styles.inputField}
            placeholder={placeholder}
            onChange={(e) => {
              handleSearch(e.target.value);
            }}
            value={searchValue}
          />
          <span className={styles.searchIcon}>{searchIconStr}</span>
        </div>
        <TooltipSimple tooltipText={tooltipText}>
          <BaseButton
            onClick={cancelClick}
            className={styles.cancelButton}
            ariaLabel={cancelAriaLab}
          >
            {cancelContent}
          </BaseButton>
        </TooltipSimple>
      </div>
    </div>
  );
};

export default SearchInput;
