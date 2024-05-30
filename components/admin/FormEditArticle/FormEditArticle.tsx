'use client';

import {
  EArticleEditFields,
  IArticleCategory,
  TArticleTableModel,
} from '@/models/articles.model';
import { useRef, useState } from 'react';
import { Editor as CoreEditor } from 'tinymce';
import Link from 'next/link';
import { getFormattedDateStrYearFirst } from '@/libs/utils/dates';
import { SubmitPendingButton } from '@/components/ui/buttons/SubmitPendingBtn';
import { useToastMessage } from '@/libs/hooks/useToastMessage';
import { useFormState } from 'react-dom';
import { EMPTY_FORM_STATE } from '@/controllers/toast.controller';
import { editArticleAction } from '@/libs/actions/admin.action';
import FieldError from '@/components/comments/FieldError/FieldError';
import TinyEditor from '@/components/TinyEditor/TinyEditor';
import FormTextareaItem from './FormTextareaItem';

interface IProps {
  articleId: string;
  revalidateUrl: string;
  initialData: [TArticleTableModel[], IArticleCategory[]];
  editorApiKey: string;
}

const FormEditArticle = ({
  initialData,
  articleId,
  revalidateUrl,
  editorApiKey,
}: IProps) => {
  const [initArticleData, categories] = initialData;

  const [formData, setFormData] = useState({
    [EArticleEditFields.logo]: initArticleData[0].logo || '',
    [EArticleEditFields.title]: initArticleData[0].title || '',
    [EArticleEditFields.cpu]: initArticleData[0].cpu || '',
    [EArticleEditFields.description]:
      initArticleData[0].description.replace(/"/g, '') || '',
    [EArticleEditFields.author]: initArticleData[0].author || '',
    [EArticleEditFields.date]: initArticleData[0].date || '',
    [EArticleEditFields.cat]: initArticleData[0].cat || '',
    [EArticleEditFields.folder]: initArticleData[0].folder || '',
    [EArticleEditFields.text]: initArticleData[0].text || '',
  });

  const editorRef = useRef<CoreEditor | null>(null);

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

  const handleEditorChange = (content: string) => {
    setFormData((prevData) => ({
      ...prevData,
      [EArticleEditFields.text]: content,
    }));
  };

  const editArticleHandler = editArticleAction.bind(
    null,
    articleId,
    formData[EArticleEditFields.text],
    revalidateUrl
  );

  const [formState, formAction] = useFormState(
    editArticleHandler,
    EMPTY_FORM_STATE
  );

  const noScriptFallback = useToastMessage(formState);

  return (
    <form action={formAction} className="flex flex-col items-start gap-6 py-4">
      <p>
        Source:{' '}
        <Link
          className="text-blue-600 text-xl"
          target="_blank"
          rel="noopener noreferrer"
          href={initArticleData[0].source || ''}
        >
          {initArticleData[0].source} 🔗
        </Link>
      </p>
      <FormTextareaItem
        itemName={EArticleEditFields.title}
        labelTitle="Article Title:"
        value={formData.title}
        handleChange={handleChange}
        formState={formState}
        required
      />
      <FormTextareaItem
        itemName={EArticleEditFields.cpu}
        labelTitle="Slug:"
        description="(Human-readable URL) (Enter only English characters without tags,
          use hyphens instead of spaces, it will be the URL)"
        value={formData.cpu}
        handleChange={handleChange}
        formState={formState}
        required
      />

      <FormTextareaItem
        itemName={EArticleEditFields.description}
        labelTitle="Short Description:"
        description="(Enter text only without tags, replace double quotes
          with «», it will be written in meta_description)"
        value={formData.description}
        handleChange={handleChange}
        formState={formState}
        required
      />
      <section className="w-full inline-block">
        <h2 className="text-center text-xl">
          <b>Main Text</b>
        </h2>
        <TinyEditor
          onEditorChange={handleEditorChange}
          id={EArticleEditFields.text}
          editorApiKey={editorApiKey}
          initialValue={initArticleData[0].text}
          editorRef={editorRef}
        />
        <FieldError
          formState={formState}
          name={EArticleEditFields.text}
          className="text-red-700"
        />
      </section>
      <FormTextareaItem
        itemName={EArticleEditFields.author}
        labelTitle="Author:"
        value={formData.author}
        handleChange={handleChange}
        formState={formState}
      />
      <FormTextareaItem
        itemName={EArticleEditFields.date}
        labelTitle="Date:"
        value={getFormattedDateStrYearFirst(formData.date)}
        handleChange={handleChange}
        formState={formState}
        required
      />

      <section className="flex flex-col items-start">
        <label htmlFor={EArticleEditFields.cat} className="text-xl">
          <b>Category:</b>
        </label>
        <select
          className="p-2"
          name={EArticleEditFields.cat}
          id={EArticleEditFields.cat}
          value={formData.cat}
          onChange={(e) => handleChange(e.target)}
        >
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.title}
            </option>
          ))}
        </select>
        <FieldError
          formState={formState}
          name={EArticleEditFields.cat}
          className="text-red-700"
        />
      </section>

      <div className="flex flex-wrap gap-4 items-center">
        <FormTextareaItem
          itemName={EArticleEditFields.logo}
          labelTitle="Article Logo:"
          value={formData.logo}
          handleChange={handleChange}
          formState={formState}
        />
        <FormTextareaItem
          itemName={EArticleEditFields.folder}
          labelTitle="Folder Name for this Article Images:"
          value={formData.folder}
          handleChange={handleChange}
          formState={formState}
        />
      </div>

      <SubmitPendingButton
        ariaLabel="Save Changes"
        pendingInnerHtml="Saving Changes ..."
        className="MovingButton"
      >
        Save Changes
      </SubmitPendingButton>
      {noScriptFallback}
    </form>
  );
};

export default FormEditArticle;
