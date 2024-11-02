'use client';

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
import {
  EArticleEditFields,
  IArticleCategory,
  TArticleTableModel,
} from '@/models/articles/articleEdit.model';
import { DEFAULT_LANG } from '@/models/language.model';

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
    [EArticleEditFields.date]:
      getFormattedDateStrYearFirst(initArticleData[0].date, DEFAULT_LANG) || '',
    [EArticleEditFields.cat]: initArticleData[0].cat || '',
    [EArticleEditFields.folder]: initArticleData[0].folder || '',
    [EArticleEditFields.text]: initArticleData[0].text || '',
    [EArticleEditFields.title_en]: initArticleData[0].title_en || '',
    [EArticleEditFields.description_en]:
      initArticleData[0].description_en || '',
    [EArticleEditFields.keywords]: initArticleData[0].keywords || '',
    [EArticleEditFields.keywords_en]: initArticleData[0].keywords_en || '',
    [EArticleEditFields.text_en]: initArticleData[0].text_en || '',
  });

  const editorUaRef = useRef<CoreEditor | null>(null);
  const editorEnRef = useRef<CoreEditor | null>(null);

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

  const handleEditorChange = (content: string, name: EArticleEditFields) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: content,
    }));
  };

  // const handleEditorChange = (content: string, name: EArticleEditFields) => {
  //   setFormData((prevData) => ({
  //     ...prevData,
  //     [EArticleEditFields.text]: content,
  //   }));
  // };

  const editArticleHandler = editArticleAction.bind(
    null,
    articleId,
    formData[EArticleEditFields.text],
    formData[EArticleEditFields.text_en],
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
        labelTitle="Article Title UA:"
        value={formData.title}
        handleChange={handleChange}
        formState={formState}
        required
      />
      <FormTextareaItem
        itemName={EArticleEditFields.title_en}
        labelTitle="Article Title EN:"
        value={formData.title_en}
        handleChange={handleChange}
        formState={formState}
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
        labelTitle="Short Description UA:"
        description="(Enter text only without tags, replace double quotes
          with «», it will be written in meta_description)"
        value={formData.description}
        handleChange={handleChange}
        formState={formState}
        required
      />
      <FormTextareaItem
        itemName={EArticleEditFields.description_en}
        labelTitle="Short Description EN:"
        description="(Enter text only without tags, replace double quotes
          with «», it will be written in meta_description)"
        value={formData.description_en}
        handleChange={handleChange}
        formState={formState}
      />
      <FormTextareaItem
        itemName={EArticleEditFields.keywords}
        labelTitle="Keywords UA:"
        description="(Enter text only without tags, replace double quotes
          with «», it will be written in meta_keywords)"
        value={formData.keywords}
        handleChange={handleChange}
        formState={formState}
      />
      <FormTextareaItem
        itemName={EArticleEditFields.keywords_en}
        labelTitle="Keywords EN:"
        description="(Enter text only without tags, replace double quotes
          with «», it will be written in meta_keywords)"
        value={formData.keywords_en}
        handleChange={handleChange}
        formState={formState}
      />
      <section className="w-full inline-block">
        <h2 className="text-center text-xl">
          <b>Main Text UA</b>
        </h2>
        <TinyEditor
          onEditorChange={(content) =>
            handleEditorChange(content, EArticleEditFields.text)
          }
          id={EArticleEditFields.text}
          editorApiKey={editorApiKey}
          initialValue={initArticleData[0].text}
          editorRef={editorUaRef}
        />
        <FieldError
          formState={formState}
          name={EArticleEditFields.text}
          className="text-red-700"
        />
      </section>
      <section className="w-full inline-block">
        <h2 className="text-center text-xl">
          <b>Main Text EN</b>
        </h2>
        <TinyEditor
          onEditorChange={(content) =>
            handleEditorChange(content, EArticleEditFields.text_en)
          }
          id={EArticleEditFields.text_en}
          editorApiKey={editorApiKey}
          initialValue={initArticleData[0].text_en || ''}
          editorRef={editorEnRef}
        />
        <FieldError
          formState={formState}
          name={EArticleEditFields.text_en}
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
        value={formData.date}
        // value={getFormattedDateStrYearFirst(formData.date)}
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
