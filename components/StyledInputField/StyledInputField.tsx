import { RefObject } from 'react';
import TooltipSimple from '../TooltipSimple/TooltipSimple';
import BaseButton from '../buttons/BaseButton/BaseButton';
import styles from './StyledInputField.module.scss';

interface IStyledInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  idName: string;
  cancelButton: { ariaLabel: string; content: string };
  handleOnChange: (term: string) => void;
  value: string | undefined;
  placeholder: string;
  hiddenLabelTitle: string;
  cancelTooltipText: string;
  cancelClick: () => void;
  inputRef?: RefObject<HTMLInputElement>;
  searchIconStr?: string;
  widthPx?: number;
}

const StyledInputField = ({
  idName,
  handleOnChange,
  cancelClick,
  value,
  placeholder,
  hiddenLabelTitle,
  cancelTooltipText,
  cancelButton: { ariaLabel: cancelAriaLab, content: cancelContent },
  searchIconStr,
  inputRef,
  widthPx = 270,
  ...rest
}: IStyledInputProps) => (
  <>
    <label htmlFor={idName} className="sr-only">
      {hiddenLabelTitle}
    </label>
    <div
      className={styles.inputWrapper}
      style={{ width: `${widthPx}px` }}
      data-testid="StyledInputField"
    >
      <div className={styles.inputBlock}>
        {inputRef ? (
          <input
            id={idName}
            name={idName}
            ref={inputRef}
            className={styles.inputField}
            style={{ width: `${widthPx - 40}px` }}
            placeholder={placeholder}
            onChange={(e) => {
              handleOnChange(e.target.value);
            }}
            defaultValue={value}
            {...rest}
          />
        ) : (
          <input
            id={idName}
            name={idName}
            className={styles.inputField}
            placeholder={placeholder}
            onChange={(e) => {
              handleOnChange(e.target.value);
            }}
            style={{ width: `${widthPx - 40}px` }}
            value={value}
            {...rest}
          />
        )}
        {searchIconStr && (
          <span className={styles.searchIcon}>{searchIconStr}</span>
        )}
      </div>
      <TooltipSimple tooltipText={cancelTooltipText}>
        <BaseButton
          onClick={cancelClick}
          className={styles.cancelButton}
          ariaLabel={cancelAriaLab}
        >
          {cancelContent}
        </BaseButton>
      </TooltipSimple>
    </div>
  </>
);

export default StyledInputField;
