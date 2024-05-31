import { IFormState } from '@/controllers/toast.controller';
import FieldError from '../../comments/FieldError/FieldError';

interface ICheckBoxProps {
  labelTitle: React.ReactNode;
  handleChange: (e: EventTarget & HTMLInputElement) => void;
  formState?: IFormState;
  chBoxValue: number;
  chBoxIdName: string;
}

const CheckboxEditForm = ({
  labelTitle,
  chBoxIdName,
  chBoxValue,
  formState,
  handleChange,
}: ICheckBoxProps) => {
  return (
    <>
      <div className="flex items-center flex-wrap gap-4">
        <input
          className="cursor-pointer"
          type="checkbox"
          id={chBoxIdName}
          name={chBoxIdName}
          checked={chBoxValue === 1}
          value={chBoxValue}
          onChange={(e) => handleChange(e.target)}
        />
        <label htmlFor={chBoxIdName} className="cursor-pointer text-xl">
          <b>{labelTitle}</b>
        </label>
      </div>
      {formState && (
        <FieldError
          formState={formState}
          name={chBoxIdName}
          className="text-red-700"
        />
      )}
    </>
  );
};

export default CheckboxEditForm;
