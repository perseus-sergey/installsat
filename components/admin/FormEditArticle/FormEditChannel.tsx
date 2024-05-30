'use client';

import { useRef, useState } from 'react';
import { Editor as CoreEditor } from 'tinymce';
import { SubmitPendingButton } from '@/components/ui/buttons/SubmitPendingBtn';
import { useToastMessage } from '@/libs/hooks/useToastMessage';
import { useFormState } from 'react-dom';
import { EMPTY_FORM_STATE } from '@/controllers/toast.controller';
import {
  editChannelAction,
  getRelativeCatsAction,
  getRelativeFrequenciesAction,
} from '@/libs/actions/admin.action';
import FieldError from '@/components/comments/FieldError/FieldError';
import TinyEditor from '@/components/TinyEditor/TinyEditor';
import FormTextareaItem from './FormTextareaItem';
import { EChannelEditFields, TChannelEditModel } from '@/models/channel.model';
import { EUrlBaseParam } from '@/models/url.model';
import CopyClipboard from '@/components/CopyClipboard/CopyClipboard';
import DependentSelects from '@/components/DependentSelects/DependentSelects';

export interface IInputData {
  id: string;
  title: string;
}

const {
  title,
  logo,
  chan_slug,
  description,
  cat_id,
  text,
  canonical,
  parent_cat_id,
  sat_id,
  frequency_id,
  beam_id,
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
  channelId: string;
  revalidateUrl: string[];
  initialData: [IInputData[], TChannelEditModel[], IInputData[]];
  editorApiKey: string;
}

const FormEditChannel = ({
  initialData,
  channelId,
  revalidateUrl,
  editorApiKey,
}: IProps) => {
  const [satellites, initArticleData, parentCategories] = initialData;

  const [formData, setFormData] = useState<
    Record<EChannelEditFields, string | number>
  >({
    logo: initArticleData[0].logo || '',
    title: initArticleData[0].title,
    chan_slug: initArticleData[0].chan_slug,
    description: initArticleData[0].description.replace(/"/g, ''),
    text: initArticleData[0].text,
    canonical: initArticleData[0].canonical,
    cat_id: `${initArticleData[0].cat_id}`,
    sat_id: initArticleData[0].sat_id,
    frequency_id: `${initArticleData[0].sat_id}|${initArticleData[0].beam_id}|${initArticleData[0].frequency_id}`,
    parent_cat_id:
      initArticleData[0].parent_cat_id || initArticleData[0].cat_id,
  } as Record<EChannelEditFields, string | number>);

  const [catFinal, setCatFinal] = useState(`${initArticleData[0].cat_id}`);

  const [frequencyFinal, setFrequencyFinal] = useState(
    `${initArticleData[0].sat_id}|${initArticleData[0].beam_id}|${initArticleData[0].frequency_id}`
  );

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
  // =================================================================
  // remove handleEditorChange
  // =================================================================
  const handleEditorChange = (content: string) => {
    setFormData((prevData) => ({
      ...prevData,
      [text]: content,
    }));
  };

  const getDependantCatList = async (parentId: string | number) =>
    await getRelativeCatsAction(parentId);

  const getDependantFreqList = async (satId: string | number) =>
    await getRelativeFrequenciesAction(satId);

  const editArticleHandler = editChannelAction.bind(
    null,
    channelId,
    formData[text] as string,
    catFinal,
    formData[frequency_id] as string,
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
        value={formData[title] as string}
        handleChange={handleChange}
        formState={formState}
        required
      />
      <FormTextareaItem
        itemName={chan_slug}
        labelTitle="Slug:"
        description="(Human-readable URL) (Enter only English characters without tags,
          use «-» instead of spaces, it will be the URL)"
        value={formData[chan_slug] as string}
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
        value={formData[canonical] as string}
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
        value={formData[description] as string}
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
          className="text-red-700"
        />
      </section>

      <DependentSelects
        selectId={cat_id}
        parentValueTitle={parent_cat_id}
        labelTitle={<b>Category:</b>}
        formData={formData}
        formState={formState}
        finalValue={catFinal}
        setFinalValue={setCatFinal}
        parentList={parentCategories}
        getDependantList={getDependantCatList}
        handleChange={handleChange}
      />

      <DependentSelects
        selectId={frequency_id}
        parentValueTitle={sat_id}
        labelTitle={<b>Satellite, Beam, Frequency:</b>}
        formData={formData}
        formState={formState}
        finalValue={frequencyFinal}
        setFinalValue={setFrequencyFinal}
        parentList={satellites}
        getDependantList={getDependantFreqList}
        handleChange={handleChange}
      />
      <FieldError
        formState={formState}
        name={sat_id}
        className="text-red-700"
      />
      <FieldError
        formState={formState}
        name={beam_id}
        className="text-red-700"
      />
      {/* ================================================================ */}

      <div className="flex flex-wrap gap-4 items-center">
        <FormTextareaItem
          itemName={logo}
          labelTitle="Article Logo:"
          value={formData[logo] as string}
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
