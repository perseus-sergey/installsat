import { IFormState } from '@/controllers/toast.controller';
import FieldError from '../../comments/FieldError/FieldError';
import { IInputData } from './FormEditChannel';

interface ISelectProps {
  labelTitle: React.ReactNode;
  description?: React.ReactNode;
  handleChange: (e: EventTarget & HTMLSelectElement) => void;
  formState: IFormState;
  optionValues: IInputData[];
  selectValue: string | number;
  selectIdName: string;
}

const SelectControlled = ({
  labelTitle,
  description,
  optionValues,
  selectIdName,
  selectValue,
  formState,
  handleChange,
}: ISelectProps) => {
  return (
    <section className="flex flex-col items-start">
      <label htmlFor={selectIdName} className="text-xl">
        <b>{labelTitle}</b>
      </label>
      {description && <p>{description}</p>}

      {/* <p>finalValue: {selectValue}</p> */}
      {optionValues.length > 0 && (
        <select
          className="px-2 py-1"
          name={selectIdName}
          id={selectIdName}
          value={selectValue}
          onChange={(e) => handleChange(e.target)}
        >
          {optionValues.map((item) => (
            <option key={item.id} value={item.id}>
              {item.title}
            </option>
          ))}
        </select>
      )}
      <FieldError
        formState={formState}
        name={selectIdName}
        className="text-red-700"
      />
    </section>
  );
};

export default SelectControlled;
