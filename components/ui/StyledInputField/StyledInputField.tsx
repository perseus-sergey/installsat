import { ChangeEvent, RefObject } from 'react';
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
    className: `${styles.inputField} py-2 px-10 rounded-md font-verdana m-1 cursor-auto placeholder:font-georgia text-stone-400 placeholder:pl-4 ${className ? ` ${className}` : ''}`,
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
        className={`${styles.inputWrapper} relative rounded-md flex items-center gap-0.5`}
        style={{ width: `${widthPx}px`, height: '2.85rem' }}
        data-testid="StyledInputField"
      >
        <div>
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
            <span className="text-3xl absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400">
              {searchIconStr}
            </span>
          )}
        </div>
        <BaseButton
          onClick={cancelClick}
          className={`${styles.cancelButton} relative w-5 h-5 bg-gray-400 rounded-3xl flex justify-center items-center hover:bg-red-300 hover:text-red-600`}
          ariaLabel={cancelBtnAriaLabel}
        />
      </div>
    </>
  );
};

export default StyledInputField;
