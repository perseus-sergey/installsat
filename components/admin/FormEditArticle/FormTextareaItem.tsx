'use client';

import { EArticleEditFields } from '@/models/articles.model';
import CopyClipboard from '@/components/CopyClipboard/CopyClipboard';
import { IFormState } from '@/controllers/toast.controller';
import FieldError from '@/components/comments/FieldError/FieldError';
import { EChannelEditFields } from '@/models/channel.model';

interface IFormTextareaItem {
  itemName: EArticleEditFields | EChannelEditFields;
  labelTitle: string;
  description?: React.ReactNode;
  value: string;
  formState: IFormState;
  cols?: number;
  rows?: number;
  handleChange: (
    e: EventTarget &
      (HTMLTextAreaElement | HTMLInputElement | HTMLSelectElement)
  ) => void;
  isCopyClipboard?: boolean;
  required?: boolean;
}

const FormTextareaItem = ({
  itemName,
  labelTitle,
  description,
  value,
  formState,
  cols,
  rows,
  handleChange,
  isCopyClipboard = false,
  required = false,
}: IFormTextareaItem) => (
  <section className="flex flex-col items-start">
    <label htmlFor={itemName} className="text-xl">
      <b>{labelTitle}</b>
    </label>
    {description && <p>{description}</p>}
    <div className="flex items-start gap-1">
      <textarea
        className="p-2 w-full rounded-md"
        name={itemName}
        id={itemName}
        cols={cols || Math.min(value.length + 20, 80)}
        rows={rows || Math.ceil(value.length / 40) || 1}
        value={value}
        onChange={(e) => handleChange(e.target)}
        required={required}
      />
      {isCopyClipboard && (
        <CopyClipboard
          value={value}
          className="text-sky-700 hover:text-sky-500 w-6 h-6"
        />
      )}
    </div>
    <FieldError
      formState={formState}
      name={itemName}
      errorFieldId={`${itemName}-error`}
      className="text-red-700"
    />
  </section>
);

export default FormTextareaItem;
