import { ReactNode, useEffect, useState } from 'react';
import FieldError from '@/components/comments/FieldError/FieldError';
import { EChannelEditFields } from '@/models/channel.model';
import { IFormState } from '@/controllers/toast.controller';
import { IInputData } from '../admin/FormEditArticle/FormEditChannel';

interface IProps {
  selectId: EChannelEditFields;
  labelTitle: ReactNode;
  parentValueTitle: EChannelEditFields;
  formData: Record<EChannelEditFields, string | number>;
  handleChange: (
    e: EventTarget &
      (HTMLTextAreaElement | HTMLInputElement | HTMLSelectElement)
  ) => void;
  formState: IFormState;
  finalValue: string;
  setFinalValue: React.Dispatch<React.SetStateAction<string>>;
  parentList: IInputData[];
  getDependantList: (parentId: number | string) => Promise<IInputData[]>;
}

const DependentSelects = ({
  selectId,
  labelTitle,
  parentValueTitle,
  formData,
  handleChange,
  formState,
  finalValue,
  setFinalValue,
  parentList,
  getDependantList,
}: IProps) => {
  const [filteredList, setFilteredList] = useState<IInputData[]>([]);
  const [isFirstRender, setIsFirstRender] = useState(true);

  useEffect(() => {
    setFinalValue(`${formData[selectId]}`);
  }, [formData[selectId]]);

  useEffect(() => {
    const fetchFilteredList = async () => {
      const filteredList = await getDependantList(formData[parentValueTitle]);
      setFilteredList(filteredList);

      if (isFirstRender) {
        setIsFirstRender(false);

        return;
      }

      setFinalValue(
        filteredList.length
          ? filteredList[0].id
          : `${formData[parentValueTitle]}`
      );
    };

    fetchFilteredList();
  }, [formData[parentValueTitle]]);

  return (
    <section className="flex flex-col items-start">
      <label htmlFor={selectId} className="text-xl">
        {labelTitle}
      </label>
      <div className="flex gap-4">
        {/* <p>
          {parentValueTitle}: {formData[parentValueTitle]}
        </p> */}
        {(formData[parentValueTitle] as number) > 0 && (
          <select
            className="p-2"
            name={parentValueTitle}
            id={parentValueTitle}
            value={formData[parentValueTitle] as number}
            onChange={(e) => handleChange(e.target)}
          >
            {parentList.map((item) => (
              <option key={item.id} value={item.id}>
                {item.title}
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
            {/* <option value={0}></option> */}
            {filteredList.map((item) => (
              <option key={item.id} value={item.id}>
                {item.title} * {item.id}
              </option>
            ))}
          </select>
        )}
      </div>
      <FieldError
        formState={formState}
        name={selectId}
        className="text-red-700"
      />
    </section>
  );
};

export default DependentSelects;
