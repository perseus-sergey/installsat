'use client';

import {
  EArticleEditFields,
  TArticleTableModel,
} from '@/models/articles.model';
import { useRef, useState } from 'react';
import { Editor as CoreEditor } from 'tinymce';
import Link from 'next/link';
import { getFormattedDateStrYearFirst } from '@/libs/utils/dates';
import CopyClipboard from '@/components/CopyClipboard/CopyClipboard';
import { SubmitPendingButton } from '@/components/ui/buttons/SubmitPendingBtn';
import { useToastMessage } from '@/libs/hooks/useToastMessage';
import { useFormState } from 'react-dom';
import { EMPTY_FORM_STATE, IFormState } from '@/controllers/toast.controller';
import { editArticleAction } from '@/libs/actions/admin.action';
import FieldError from '@/components/comments/FieldError/FieldError';
import TinyEditor from '@/components/TinyEditor/TinyEditor';

interface Category {
  id: number;
  title: string;
}

interface IProps {
  articleId: string;
  revalidateUrl: string;
  initialData: [TArticleTableModel[], Category[]];
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

  // const editArticleHandler = editArticleAction.bind(
  //   null,
  //   articleId,
  //   editorRef.current ? editorRef.current.getContent() : '',
  //   revalidateUrl
  // );

  const [formState, formAction] = useFormState(
    editArticleHandler,
    EMPTY_FORM_STATE
  );

  const noScriptFallback = useToastMessage(formState);

  return (
    <form action={formAction} className="flex flex-col items-start gap-6 py-4">
      <FormTextareaItem
        itemName={EArticleEditFields.logo}
        labelTitle="Article Logo:"
        value={formData.logo}
        handleChange={handleChange}
        formState={formState}
      />
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
      />
      <FormTextareaItem
        itemName={EArticleEditFields.cpu}
        labelTitle="Slug:"
        description="(Human-readable URL) (Enter only English characters without tags,
          use hyphens instead of spaces, it will be the URL)"
        value={formData.cpu}
        handleChange={handleChange}
        formState={formState}
      />

      <FormTextareaItem
        itemName={EArticleEditFields.description}
        labelTitle="Short Description:"
        description="(Enter text only without tags, replace double quotes
          with «», it will be written in meta_description)"
        value={formData.description}
        handleChange={handleChange}
        formState={formState}
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
        {/* <Editor
          id={EArticleEditFields.text}
          apiKey={editorApiKey}
          onInit={(_evt, editor) => (editorRef.current = editor)}
          initialValue={initArticleData[0].text}
          init={{
            height: 500,
            // menubar: false,
            plugins: [
              'advlist',
              'autolink',
              'lists',
              'link',
              'image',
              'charmap',
              'codesample',
              'emoticons',
              'formatpainter',
              'linkchecker',
              'a11ychecker',
              'preview',
              'anchor',
              'searchreplace',
              'visualblocks',
              'code',
              'fullscreen',
              'tinymcespellchecker',
              'advcode',
              'editimage',
              'code',
              'autocorrect',
              ' typography',
              ' inlinecss',
              'markdown',
              'insertdatetime',
              'media',
              'table',
              'code',
              'help',
              'wordcount',
            ],
            toolbar:
              'code | visualblocks | undo redo | blocks fontfamily fontsize | ' +
              'bold italic forecolor | alignleft aligncenter ' +
              'alignright alignjustify | bullist numlist outdent indent | ' +
              'removeformat | help',
            content_style:
              'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
          }}
        /> */}
        <FieldError
          formState={formState}
          name={EArticleEditFields.text}
          errorFieldId={`${EArticleEditFields.text}-error`}
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
          errorFieldId={`${EArticleEditFields.cat}-error`}
          className="text-red-700"
        />
      </section>

      <FormTextareaItem
        itemName={EArticleEditFields.folder}
        labelTitle="Folder Name:"
        description="For Images for this Article"
        value={formData.folder}
        handleChange={handleChange}
        formState={formState}
      />

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

interface IFormTextareaItem {
  itemName: EArticleEditFields;
  labelTitle: string;
  description?: string;
  value: string;
  formState: IFormState;
  cols?: number;
  rows?: number;
  handleChange: (
    e: EventTarget &
      (HTMLTextAreaElement | HTMLInputElement | HTMLSelectElement)
  ) => void;
  isCopyClipboard?: boolean;
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
      />
      {isCopyClipboard && (
        <CopyClipboard
          value={value}
          classIconWrapper="text-sky-700 hover:text-sky-500"
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

export default FormEditArticle;

// =================================================================
// =================================================================
// =================================================================
