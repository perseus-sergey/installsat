'use client';

import { useEffect, useRef, useState } from 'react';
import { Editor as CoreEditor } from 'tinymce';
import { SubmitPendingButton } from '@/components/ui/buttons/SubmitPendingBtn';
import { useToastMessage } from '@/libs/hooks/useToastMessage';
import { useFormState } from 'react-dom';
import { EMPTY_FORM_STATE } from '@/controllers/toast.controller';
import { editChannelAction } from '@/libs/actions/admin.action';
import FieldError from '@/components/comments/FieldError/FieldError';
import TinyEditor from '@/components/TinyEditor/TinyEditor';
import FormTextareaItem from './FormTextareaItem';
import {
  EChannelEditFields,
  IChannelCategory,
  TChannelEditModel,
} from '@/models/channel.model';
import { EUrlBaseParam } from '@/models/url.model';
import CopyClipboard from '@/components/CopyClipboard/CopyClipboard';

const {
  title,
  logo,
  chan_slug,
  description,
  cat_id,
  text,
  canonical,
  // sat_id,
  // frequency_id,
  // beam_id,
  // genre_id,
  // lang_id,
  // compress_id,
  // country_id,
  // url,
  // biss,
  // ip_deny,
  // no_googlads,
  // encryption_id,
  // vsetv,
  // vipiko,
  // potok,
  // pars_uppod,
  // pattern,
  // tvforsite_net,
  // other_stream,
  // mark,
} = EChannelEditFields;

interface IProps {
  articleId: string;
  revalidateUrl: string[];
  initialData: [TChannelEditModel[], IChannelCategory[]];
  editorApiKey: string;
}

const FormEditChannel = ({
  initialData,
  articleId,
  revalidateUrl,
  editorApiKey,
}: IProps) => {
  const [initArticleData, categories] = initialData;

  const [formData, setFormData] = useState({
    [logo]: initArticleData[0].logo,
    [title]: initArticleData[0].title,
    [chan_slug]: initArticleData[0].chan_slug,
    [description]: initArticleData[0].description.replace(/"/g, ''),
    [cat_id]: initArticleData[0].cat_id,
    catParentId:
      categories.find((cat) => cat.id === initArticleData[0].cat_id)?.parent ||
      initArticleData[0].cat_id,
    [text]: initArticleData[0].text,
    [canonical]: initArticleData[0].canonical,
  });

  const [filteredCats, setFilteredCats] = useState<IChannelCategory[]>([]);
  const [catFinal, setCatFinal] = useState(initArticleData[0].cat_id);
  const [isFirstRender, setIsFirstRender] = useState(true);

  useEffect(() => {
    setCatFinal(formData[cat_id]);
  }, [formData[cat_id]]);

  useEffect(() => {
    const filteredCats = categories.filter(
      (cat) => cat.parent === +formData.catParentId
    );
    setFilteredCats(filteredCats);

    if (isFirstRender) {
      setIsFirstRender(false);

      return;
    }

    setCatFinal(
      filteredCats.length ? filteredCats[0].id : formData.catParentId
    );
  }, [formData.catParentId]);

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
      [text]: content,
    }));
  };

  const editArticleHandler = editChannelAction.bind(
    null,
    articleId,
    formData[text],
    filteredCats.length && catFinal === formData.catParentId ? -1 : catFinal,
    revalidateUrl
  );

  const [formState, formAction] = useFormState(
    editArticleHandler,
    EMPTY_FORM_STATE
  );

  const noScriptFallback = useToastMessage(formState);

  return (
    <form action={formAction} className="flex flex-col items-start gap-6 py-4">
      <FormTextareaItem
        itemName={title}
        labelTitle="Channel name:"
        value={formData.title}
        handleChange={handleChange}
        formState={formState}
        required
      />
      <FormTextareaItem
        itemName={chan_slug}
        labelTitle="Slug:"
        description="(Human-readable URL) (Enter only English characters without tags,
          use «-» instead of spaces, it will be the URL)"
        value={formData.chan_slug}
        handleChange={handleChange}
        formState={formState}
        isCopyClipboard
        required
      />
      <FormTextareaItem
        itemName={canonical}
        labelTitle="Canonical URL:"
        description={
          <>
            (Path to the priority page if the channel duplicates an existing
            one.)
            <br />
            {`/${EUrlBaseParam.CHANNEL_PARAMS}//`}
            <CopyClipboard
              value={`/${EUrlBaseParam.CHANNEL_PARAMS}//`}
              className="text-sky-700 hover:text-sky-500 w-4 h-4 ml-1"
            />
            <br />
            FOR ONLINE CHANNEL:
            <br />
            {`/${EUrlBaseParam.ONLINE_CHANNEL_LIST}//`}
            <CopyClipboard
              value={`/${EUrlBaseParam.ONLINE_CHANNEL_LIST}//`}
              className="text-sky-700 hover:text-sky-500 w-4 h-4 ml-1"
            />
          </>
        }
        value={formData.canonical}
        handleChange={handleChange}
        formState={formState}
        isCopyClipboard
        required
      />

      <FormTextareaItem
        itemName={description}
        labelTitle="Short Description:"
        description="(Enter text only without tags, replace double quotes
          with «», it will be written in meta_description)"
        value={formData.description}
        handleChange={handleChange}
        formState={formState}
        isCopyClipboard
        required
      />
      <section className="w-full inline-block">
        <h2 className="text-center text-xl">
          <b>Main Text</b>
        </h2>
        <TinyEditor
          onEditorChange={handleEditorChange}
          id={text}
          editorApiKey={editorApiKey}
          initialValue={initArticleData[0].text}
          editorRef={editorRef}
        />
        <FieldError
          formState={formState}
          name={text}
          errorFieldId={`${text}-error`}
          className="text-red-700"
        />
      </section>

      {/* ================================================================ */}

      <section className="flex flex-col items-start">
        <label htmlFor={cat_id} className="text-xl">
          <b>Category:</b>
        </label>
        <div className="flex gap-4">
          <p>catParentId: {formData.catParentId}</p>
          {formData.catParentId > 0 && (
            <select
              className="p-2"
              name={'catParentId'}
              id={'catParentId'}
              value={formData.catParentId}
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

          <p>catFinal: {catFinal}</p>
          {filteredCats && filteredCats.length > 0 && (
            <select
              className="p-2"
              name={cat_id}
              id={cat_id}
              value={catFinal}
              onChange={(e) => handleChange(e.target)}
            >
              <option value={0}></option>
              {filteredCats.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.title} {category.id}
                </option>
              ))}
            </select>
          )}
        </div>
        <FieldError
          formState={formState}
          name={cat_id}
          errorFieldId={`${cat_id}-error`}
          className="text-red-700"
        />
      </section>

      {/* ================================================================ */}

      <div className="flex flex-wrap gap-4 items-center">
        <FormTextareaItem
          itemName={logo}
          labelTitle="Article Logo:"
          value={formData.logo || ''}
          handleChange={handleChange}
          formState={formState}
          required
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

export default FormEditChannel;
