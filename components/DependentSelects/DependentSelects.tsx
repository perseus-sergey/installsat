import { ReactNode, useEffect, useState } from 'react';
import FieldError from '@/components/comments/FieldError/FieldError';
import { IChannelCategory } from '@/models/channel.model';
import { EChannelEditFields } from '@/models/channel.model';
import { IFormState } from '@/controllers/toast.controller';

const { cat_id } = EChannelEditFields;

interface IProps {
  selectId: EChannelEditFields;
  labelTitle: ReactNode;
  parentValueTitle: string;
  categories: IChannelCategory[];
  formData: Record<string, string | number>;
  setFormData: React.Dispatch<
    React.SetStateAction<Record<string, string | number>>
  >;
  formState: IFormState;
  finalValue: number;
  setFinalValue: React.Dispatch<React.SetStateAction<number>>;
}

const DependentSelects = ({
  selectId,
  labelTitle,
  parentValueTitle,
  categories,
  formData,
  setFormData,
  formState,
  finalValue,
  setFinalValue,
}: IProps) => {
  const [filteredList, setFilteredList] = useState<IChannelCategory[]>([]);
  const [isFirstRender, setIsFirstRender] = useState(true);

  useEffect(() => {
    setFinalValue(formData[cat_id] as number);
  }, [formData[cat_id]]);

  useEffect(() => {
    const filteredList = categories.filter(
      (cat) => cat.parent === +formData[parentValueTitle]
    );
    setFilteredList(filteredList);

    if (isFirstRender) {
      setIsFirstRender(false);

      return;
    }

    setFinalValue(
      filteredList.length
        ? filteredList[0].id
        : (formData[parentValueTitle] as number)
    );
  }, [formData[parentValueTitle]]);

  const handleChange = ({
    name,
    id,
    value,
  }: EventTarget &
    (HTMLTextAreaElement | HTMLInputElement | HTMLSelectElement)) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
      [id]: value,
    }));
  };

  return (
    <section className="flex flex-col items-start">
      <label htmlFor={cat_id} className="text-xl">
        {labelTitle}
      </label>
      <div className="flex gap-4">
        {/* <p>{parentValueTitle}: {formData[parentValueTitle]}</p> */}
        {(formData[parentValueTitle] as number) > 0 && (
          <select
            className="p-2"
            name={parentValueTitle}
            id={parentValueTitle}
            value={formData[parentValueTitle] as number}
            onChange={(e) => handleChange(e.target)}
          >
            {categories
              .filter((cat) => cat.parent === 0)
              .map((category) => (
                <option key={category.id} value={category.id}>
                  {category.title} {category.id}
                </option>
              ))}
          </select>
        )}

        <p>finalValue: {finalValue}</p>
        {filteredList && filteredList.length > 0 && (
          <select
            className="p-2"
            name={selectId}
            id={selectId}
            value={finalValue}
            onChange={(e) => handleChange(e.target)}
          >
            <option value={0}></option>
            {filteredList.map((category) => (
              <option key={category.id} value={category.id}>
                {category.title} {category.id}
              </option>
            ))}
          </select>
        )}
      </div>
      <FieldError
        formState={formState}
        name={selectId}
        errorFieldId={`${selectId}-error`}
        className="text-red-700"
      />
    </section>
  );
};

export default DependentSelects;
