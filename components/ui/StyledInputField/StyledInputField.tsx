import { ChangeEvent, RefObject } from 'react';
import BaseButton from '../buttons/BaseButton/BaseButton';

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
    className: `h-9 text-sm py-2 px-10 rounded-md font-verdana m-1 cursor-auto placeholder:font-georgia placeholder:border-transparent placeholder:border-l-gray-200 placeholder:border-solid text-stone-500 placeholder:pl-4 ${className ? ` ${className}` : ''}`,
    style: { width: `${widthPx - 40}px`, border: '1px inset #cccccc' },
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
        className={`bg-gradient-to-b from-stone-100 via-gray-200 via-40% to-neutral-400 shadow-[inset_0px_1px_1px_white,_0px_1px_3px_rgba(0,_0,_0,_0.5)]
          relative rounded-md flex items-center gap-0.5`}
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
          className={`relative w-5 h-5 bg-gray-400 rounded-3xl flex justify-center items-center hover:bg-red-300 hover:text-red-600
          before:absolute before:w-[2px] before:h-1/2 before:bg-white before:rotate-45 after:-rotate-45 after:absolute after:w-[2px] after:h-1/2 after:bg-white`}
          ariaLabel={cancelBtnAriaLabel}
        />
      </div>
    </>
  );
};

export default StyledInputField;
