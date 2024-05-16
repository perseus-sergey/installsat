import { ChangeEvent, RefObject } from 'react';
import TooltipSimple from '../tooltips/TooltipSimple/TooltipSimple';
import BaseButton from '../buttons/BaseButton/BaseButton';
import styles from './StyledInputField.module.scss';

interface IStyledInputProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  idName: string;
  handleOnChange: (term: string) => void;
  value: string | undefined;
  placeholder: string;
  hiddenLabelTitle: string;
  cancelBtnAriaLabel: string;
  cancelClick: () => void;
  inputRef?: RefObject<HTMLTextAreaElement>;
  searchIconStr?: string;
  widthPx?: number;
}

const StyledTextArea = ({
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
    style: { width: `${widthPx - 40}px` },
    placeholder: placeholder,
    onChange: (e: ChangeEvent<HTMLTextAreaElement>) => {
      handleOnChange(e.target.value);
    },
  };

  return (
    <>
      <label htmlFor={idName} className="sr-only">
        {hiddenLabelTitle}
      </label>
      <div className={styles.inputWrapper} style={{ width: `${widthPx}px` }}>
        <div className={styles.inputBlock}>
          {inputRef ? (
            <textarea
              ref={inputRef}
              defaultValue={value}
              {...basesAttributes}
              {...rest}
            />
          ) : (
            <textarea value={value} {...basesAttributes} {...rest} />
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

export default StyledTextArea;
