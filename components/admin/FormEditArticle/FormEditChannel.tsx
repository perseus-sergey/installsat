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
import {
  EChannelEditFields,
  TChannelEditModel,
} from '@/models/channels/channel.model';
import { EUrlBaseParam } from '@/models/url/url.model';
import CopyClipboard from '@/components/CopyClipboard/CopyClipboard';
import DependentSelects from '@/components/DependentSelects/DependentSelects';
import SelectControlled from '@/components/admin/FormEditArticle/SelectControlled';
import Link from 'next/link';
import Fieldset from '@/components/ui/Fieldset/Fieldset';
import CheckboxEditForm from './CheckboxEditForm';

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
  text_en,
  description_en,
  keywords,
  keywords_en,
  canonical,
  parent_cat_id,
  sat_id,
  frequency_id,
  beam_id,
  genre_id,
  lang_id,
  compress_id,
  country_id,
  url,
  biss,
  ip_deny,
  no_googlads,
  encryption_id,
  vsetv,
  vipiko,
  potok,
  pars_uppod,
  pattern,
  tvforsite_net,
  other_stream,
  mark,
} = EChannelEditFields;

interface IProps {
  channelId: string;
  revalidateUrl: string[];
  initialData: [
    IInputData[],
    TChannelEditModel[],
    IInputData[],
    IInputData[],
    IInputData[],
    IInputData[],
    IInputData[],
    IInputData[],
    IInputData[],
  ];
  editorApiKey: string;
}

const FormEditChannel = ({
  initialData,
  channelId,
  revalidateUrl,
  editorApiKey,
}: IProps) => {
  const [
    satellites,
    initArticleData,
    parentCategories,
    compressList,
    encryptionList,
    genreList,
    languareList,
    vipikoChannels,
    allowedCountries,
  ] = initialData;

  const [formData, setFormData] = useState<
    Record<EChannelEditFields, string | number>
  >({
    logo: initArticleData[0].logo || '',
    title: initArticleData[0].title,
    chan_slug: initArticleData[0].chan_slug,
    description: initArticleData[0].description.replace(/"/g, ''),
    text: initArticleData[0].text,
    text_en: initArticleData[0].text_en,
    description_en: initArticleData[0].description_en,
    keywords: initArticleData[0].keywords,
    keywords_en: initArticleData[0].keywords_en,
    canonical: initArticleData[0].canonical,
    compress_id: initArticleData[0].compress_id,
    encryption_id: initArticleData[0].encryption_id,
    biss: initArticleData[0].biss,
    genre_id: initArticleData[0].genre_id,
    lang_id: initArticleData[0].lang_id,
    url: initArticleData[0].url,
    tvforsite_net: initArticleData[0].tvforsite_net,
    vsetv: initArticleData[0].vsetv,
    vipiko: initArticleData[0].vipiko,
    country_id: initArticleData[0].country_id,
    ip_deny: initArticleData[0].ip_deny,
    no_googlads: initArticleData[0].no_googlads,
    potok: initArticleData[0].potok,
    pars_uppod: initArticleData[0].pars_uppod,
    pattern: initArticleData[0].pattern,
    other_stream: initArticleData[0].other_stream,
    mark: initArticleData[0].mark,
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

  const onChBoxChanged = ({
    checked,
    id,
    name,
  }: EventTarget & HTMLInputElement) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: checked ? 1 : 0,
      [id]: checked ? 1 : 0,
    }));
  };

  const handleEditorChange = (content: string, name: EChannelEditFields) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: content,
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
    formData[text_en] as string,
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

      <Fieldset legendText="Description" className="p-4">
        <FormTextareaItem
          itemName={description}
          labelTitle="Short Ukrainian Description:"
          description="(Enter text only without tags, replace double quotes
          with «», it will be written in meta_description)"
          value={formData[description] as string}
          handleChange={handleChange}
          formState={formState}
          isCopyClipboard
          required
        />

        <FormTextareaItem
          itemName={description_en}
          labelTitle="Short English Description:"
          description="(Enter text only without tags, replace double quotes
          with «», it will be written in meta_description)"
          value={formData[description_en] as string}
          handleChange={handleChange}
          formState={formState}
          isCopyClipboard
          required
        />
      </Fieldset>

      <Fieldset legendText="Keywords" className="p-4">
        <FormTextareaItem
          itemName={keywords}
          labelTitle="Short Ukrainian Keywords:"
          description="(Enter text only without tags, replace double quotes
          with «», it will be written in meta_keywords)"
          value={formData[keywords] as string}
          handleChange={handleChange}
          formState={formState}
          isCopyClipboard
          required
        />

        <FormTextareaItem
          itemName={keywords_en}
          labelTitle="Short English Keywords:"
          description="(Enter text only without tags, replace double quotes
          with «», it will be written in meta_keywords)"
          value={formData[keywords_en] as string}
          handleChange={handleChange}
          formState={formState}
          isCopyClipboard
          required
        />
      </Fieldset>

      <Fieldset legendText="Main TEXT" className="w-full inline-block p-4">
        <h2 className="text-center text-xl">
          <b>Main Text Ukrainian</b>
        </h2>
        <TinyEditor
          onEditorChange={(content) => handleEditorChange(content, text)}
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

        <h2 className="text-center text-xl">
          <b>Main Text English</b>
        </h2>
        <TinyEditor
          onEditorChange={(content) => handleEditorChange(content, text_en)}
          id={text_en}
          editorApiKey={editorApiKey}
          initialValue={initArticleData[0].text_en}
          editorRef={editorEnRef}
        />
        <FieldError
          formState={formState}
          name={text_en}
          className="text-red-700"
        />
      </Fieldset>

      <DependentSelects
        selectId={cat_id}
        parentValueTitle={parent_cat_id}
        labelTitle="Category:"
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
        labelTitle="Satellite, Beam, Frequency:"
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

      <SelectControlled
        labelTitle="Compression:"
        handleChange={handleChange}
        selectIdName={compress_id}
        formState={formState}
        selectValue={formData[compress_id]}
        optionValues={compressList}
      />

      <SelectControlled
        labelTitle="Encryption:"
        handleChange={handleChange}
        selectIdName={encryption_id}
        formState={formState}
        selectValue={formData[encryption_id]}
        optionValues={encryptionList}
      />

      <FormTextareaItem
        itemName={biss}
        labelTitle="(B I S S)"
        description={
          <>
            65 43 21 C9 12 34 56 9C / ID: 3 (0003)
            <CopyClipboard
              value={'65 43 21 C9 12 34 56 9C / ID: 3 (0003)'}
              className="text-sky-700 hover:text-sky-500 w-4 h-4 ml-1"
            />
          </>
        }
        value={formData[biss] as string}
        handleChange={handleChange}
        formState={formState}
      />

      <SelectControlled
        labelTitle="Genre:"
        handleChange={handleChange}
        selectIdName={genre_id}
        formState={formState}
        selectValue={formData[genre_id]}
        optionValues={genreList}
      />

      <SelectControlled
        labelTitle="Language:"
        handleChange={handleChange}
        selectIdName={lang_id}
        formState={formState}
        selectValue={formData[lang_id]}
        optionValues={languareList}
      />

      <FormTextareaItem
        itemName={url}
        labelTitle="Official site:"
        value={formData[url] as string}
        handleChange={handleChange}
        formState={formState}
      />

      <FormTextareaItem
        itemName={tvforsite_net}
        labelTitle="Page with online broadcasting: (DB - field: `tvforsite_net`)"
        value={formData[tvforsite_net] as string}
        handleChange={handleChange}
        formState={formState}
      />

      <Fieldset legendText="Channel Schedule" className="p-4">
        <p>
          For refresh it999 channel titles list, use --== pars/set_chan_edem.php
          ==--
        </p>

        <div className="flex flex-wrap items-center gap-4">
          <FormTextareaItem
            itemName={vsetv}
            labelTitle={
              <Link
                className="text-blue-600 underline"
                href="http://www.vsetv.com/"
                target="_blank"
                rel="noopener noreferrer nofollow"
              >
                vsetv.com
              </Link>
            }
            value={`${formData[vsetv]}`}
            handleChange={handleChange}
            formState={formState}
          />
          <SelectControlled
            labelTitle={
              <Link
                className="text-blue-600 underline"
                href="http://epg.it999.ru/edem.xml.gz"
                target="_blank"
                rel="noopener noreferrer"
              >
                it999
              </Link>
            }
            handleChange={handleChange}
            selectIdName={vipiko}
            formState={formState}
            selectValue={formData[vipiko]}
            optionValues={vipikoChannels}
          />
        </div>
      </Fieldset>

      <Fieldset legendText="O N L I N E" className="p-4 flex flex-col gap-4">
        <Fieldset
          legendText="Country Filter"
          className="p-4 flex flex-wrap items-center gap-4"
        >
          <SelectControlled
            labelTitle="ALLOWED only ✅ in:"
            description="Leave empty if all countries allowed"
            handleChange={handleChange}
            selectIdName={country_id}
            formState={formState}
            selectValue={formData[country_id]}
            optionValues={allowedCountries}
          />
          <SelectControlled
            labelTitle="FORBIDDEN 🚫 in:"
            description="Leave empty if all countries allowed"
            handleChange={handleChange}
            selectIdName={ip_deny}
            formState={formState}
            selectValue={formData[ip_deny]}
            optionValues={allowedCountries}
          />
        </Fieldset>

        <CheckboxEditForm
          labelTitle="Hide Google Absence"
          chBoxIdName={no_googlads}
          chBoxValue={formData[no_googlads] as number}
          handleChange={onChBoxChanged}
          formState={formState}
        />

        <div className="p-4 flex flex-wrap gap-4">
          <FormTextareaItem
            itemName={potok}
            labelTitle="Stream for the player"
            value={formData[potok] as string}
            handleChange={handleChange}
            formState={formState}
          />

          <FormTextareaItem
            itemName={pars_uppod}
            labelTitle="URL of grabbing stream for the player"
            value={formData[pars_uppod] as string}
            handleChange={handleChange}
            formState={formState}
          />

          <FormTextareaItem
            itemName={pattern}
            labelTitle="Pattern (set 1 if it need the flow doesn't change)"
            value={formData[pattern] as string}
            handleChange={handleChange}
            formState={formState}
          />

          <FormTextareaItem
            itemName={other_stream}
            labelTitle="Player from other source (IFrame)"
            value={formData[other_stream] as string}
            handleChange={handleChange}
            formState={formState}
          />
        </div>
      </Fieldset>

      <FormTextareaItem
        itemName={mark}
        labelTitle="Notes"
        value={formData[mark] as string}
        handleChange={handleChange}
        formState={formState}
      />

      <FormTextareaItem
        itemName={logo}
        labelTitle="Article Logo:"
        value={formData[logo] as string}
        handleChange={handleChange}
        formState={formState}
        required
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

export default FormEditChannel;
