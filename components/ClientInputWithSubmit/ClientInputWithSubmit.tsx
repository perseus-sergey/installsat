'use client';

import { makeUrlSearchParams } from '@/libs/utils/utils';
import { EUrlSearchParam } from '@/models/url.model';
import { HTMLInputTypeAttribute, ReactNode, useState } from 'react';
import Fieldset from '../ui/Fieldset/Fieldset';

interface IProps {
  inputId?: string;
  inputType?: HTMLInputTypeAttribute;
  inputDefaultValue?: string | number;
  inputBaseHref: string;
  searchParamName?: EUrlSearchParam;
  fieldSetTitle: string;
  buttonTitle: string;
  labelHtml: ReactNode;
}

const ClientInputWithSubmit = ({
  inputId,
  inputType,
  inputDefaultValue,
  inputBaseHref,
  searchParamName,
  fieldSetTitle,
  labelHtml,
  buttonTitle,
}: IProps) => {
  const [val, setVal] = useState(inputDefaultValue);
  const isInput = inputId !== undefined;
  const handleSubmit = () => {
    const url = searchParamName
      ? `${inputBaseHref}?${makeUrlSearchParams({ [searchParamName]: `${val}` })}`
      : inputBaseHref;
    window.open(url, '_blank');
  };

  return (
    <form onSubmit={handleSubmit}>
      <Fieldset className="p-4" legendText={fieldSetTitle}>
        {isInput ? (
          <label htmlFor={inputId}>{labelHtml}</label>
        ) : (
          <p>{labelHtml}</p>
        )}
        <div className="flex gap-4 mt-4">
          {isInput && (
            <input
              id={inputId}
              type={inputType}
              value={val}
              onChange={(e) => setVal(parseInt(e.target.value, 10))}
              className="p-2 rounded"
            />
          )}
          <button
            type="submit"
            className="bg-blue-500 text-white font-bold py-2 px-4 w-fit rounded hover:bg-blue-400"
          >
            {buttonTitle}
          </button>
        </div>
      </Fieldset>
    </form>
  );
};

interface ISelectOptions {
  title: string;
  value: string;
}

interface ISelectProps extends IProps {
  selectOptions: ISelectOptions[];
}

export const ClientSelectWithSubmit = ({
  inputId,
  selectOptions,
  inputDefaultValue,
  inputBaseHref,
  searchParamName,
  fieldSetTitle,
  labelHtml,
  buttonTitle,
}: ISelectProps) => {
  const [val, setVal] = useState(inputDefaultValue);
  const isInput = inputId !== undefined;
  const handleSubmit = () => {
    const url = searchParamName
      ? `${inputBaseHref}?${makeUrlSearchParams({ [searchParamName]: `${val}` })}`
      : inputBaseHref;
    window.open(url, '_blank');
  };

  return (
    <form onSubmit={handleSubmit}>
      <Fieldset className="p-4" legendText={fieldSetTitle}>
        {isInput ? (
          <label htmlFor={inputId}>{labelHtml}</label>
        ) : (
          <p>{labelHtml}</p>
        )}
        <div className="flex gap-4 mt-4">
          <select
            className="p-2 rounded"
            name={inputId}
            id={inputId}
            value={val}
            onChange={(e) => setVal(e.target.value)}
          >
            {selectOptions.map((item) => (
              <option key={item.value} value={item.value}>
                {item.title}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="bg-blue-500 text-white font-bold py-2 px-4 w-fit rounded hover:bg-blue-400"
          >
            {buttonTitle}
          </button>
        </div>
      </Fieldset>
    </form>
  );
};

export default ClientInputWithSubmit;
