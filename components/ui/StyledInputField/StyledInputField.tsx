import { ChangeEvent, RefObject } from 'react';
import TooltipSimple from '../tooltips/TooltipSimple/TooltipSimple';
import BaseButton from '../buttons/BaseButton/BaseButton';
import styles from './StyledInputField.module.scss';

interface IStyledInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  idName: string;
  handleOnChange: (term: string) => void;
  value: string | undefined;
  placeholder: string;
  hiddenLabelTitle: string;
  cancelBtnAriaLabel: string;
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
  cancelBtnAriaLabel,
  searchIconStr,
  inputRef,
  className,
  widthPx = 270,
  ...rest
}: IStyledInputProps) => {
  const basesAttributes = {
    id: idName,
    name: idName,
    className: className
      ? `${styles.inputField} ${className}`
      : styles.inputField,
    style: { width: `${widthPx - 40}px`, height: '2.3rem' },
    placeholder: placeholder,
    onChange: (e: ChangeEvent<HTMLInputElement>) => {
      handleOnChange(e.target.value);
    },
  };

  return (
    <>
      <label htmlFor={idName} className="sr-only">
        {hiddenLabelTitle}
      </label>
      <div
        className={styles.inputWrapper}
        style={{ width: `${widthPx}px`, height: '2.85rem' }}
        data-testid="StyledInputField"
      >
        <div className={styles.inputBlock}>
          {inputRef ? (
            <input
              ref={inputRef}
              defaultValue={value}
              {...basesAttributes}
              {...rest}
            />
          ) : (
            <input value={value} {...basesAttributes} {...rest} />
          )}
          {searchIconStr && (
            <span className={styles.searchIcon}>{searchIconStr}</span>
          )}
        </div>
        <TooltipSimple tooltipText={cancelBtnAriaLabel}>
          <BaseButton
            onClick={cancelClick}
            className={styles.cancelButton}
            ariaLabel={cancelBtnAriaLabel}
          />
        </TooltipSimple>
      </div>
    </>
  );
};

export default StyledInputField;
