'use client';

import { useFormState } from 'react-dom';

import { SubmitPendingButton } from '@/components/ui/buttons/SubmitPendingBtn';
import { COMMENTS_MODEL, ECommentFormNames } from '@/models/ui/comments.model';
// import FieldError from '../FieldError/FieldError';
import { useToastMessage } from '@/libs/hooks/useToastMessage';
import { useFormReset } from '@/libs/hooks/useFormReset';
import { EDBTableTitles } from '@/models/dbTblNames.model';
import { EMPTY_FORM_STATE } from '@/controllers/toast.controller';
// import { IUserLocation } from '@/models/userLocation.model';
import { addCommentAction } from '@/libs/actions/comments.action';
import FieldError from '../FieldError/FieldError';
import { ELanguage } from '@/models/language.model';
import { useCommentSendEmail } from '@/libs/hooks/useCommentSendEmail';

const { AUTHOR, EMAIL, TEXT } = ECommentFormNames;
const { authorEmail, authorName, commentText, submit } =
  COMMENTS_MODEL.commentForm;

interface ICommentProps {
  revalidateUrl: string;
  dbCommentTableName: EDBTableTitles;
  articleId: string | number;
  articleName: string;
  // userLocation: IUserLocation | null;
  baseUrl: string;
  emailKey: string;
  lang: ELanguage;
}

const CommentForm = ({
  revalidateUrl,
  dbCommentTableName,
  articleId,
  articleName,
  // userLocation,
  baseUrl,
  emailKey,
  lang,
}: ICommentProps) => {
  const sendCommentHandler = addCommentAction.bind(
    null,
    lang,
    articleId,
    // userLocation && userLocation.status === 'success' ? userLocation.query : '',
    // userLocation && userLocation.status === 'success'
    //   ? userLocation.countryCode
    //   : '',
    revalidateUrl,
    dbCommentTableName
  );

  const [formState, formAction] = useFormState(
    sendCommentHandler,
    EMPTY_FORM_STATE
  );

  const noScriptFallback = useToastMessage(formState);

  useCommentSendEmail(
    formState,
    articleName,
    revalidateUrl,
    dbCommentTableName,
    articleId,
    // userLocation,
    baseUrl,
    emailKey,
    lang
  );

  const formRef = useFormReset(formState);

  const inputFieldStyle =
    'max-w-64 sm:max-w-full mt-1 p-1 text-gray-700 border-lightgray border-2 cursor-auto bg-[linear-gradient(to_bottom,rgba(255,255,255,1)_0%,rgba(243,243,243,1)_50%,rgba(237,237,237,1)_51%,rgba(255,255,255,1)_100%)] border-inset';

  const requiredStyle =
    "after:text-lime-200 after:text-xl after:content-['_*']";

  return (
    <form
      id="comment-form"
      ref={formRef}
      className="flex flex-col items-start gap-1 p-4"
      action={formAction}
    >
      <div className="pb-4 pt-1 flex flex-col">
        <label htmlFor={AUTHOR} className={requiredStyle}>
          {authorName.labelText[lang]}
        </label>
        <input
          id={AUTHOR}
          name={AUTHOR}
          className={inputFieldStyle}
          maxLength={authorName.maxSize.value}
          size={20}
          required
          placeholder={authorName.placeholder[lang]}
          aria-label={authorName.ariaLabel[lang]}
          aria-describedby={`${AUTHOR}-error`}
        />
        <FieldError formState={formState} name={AUTHOR} />
      </div>

      <div className="pb-4 pt-1 flex flex-col">
        <label htmlFor={EMAIL}>{authorEmail.labelText[lang]}</label>
        <input
          type="email"
          id={EMAIL}
          name={EMAIL}
          maxLength={40}
          className={inputFieldStyle}
          size={30}
          placeholder={authorEmail.placeholder}
          aria-label={authorEmail.ariaLabel[lang]}
          aria-describedby={`${EMAIL}-error`}
        />
        <FieldError formState={formState} name={EMAIL} />
      </div>

      <div className="pb-4 pt-1 flex flex-col">
        <label htmlFor={TEXT} className={requiredStyle}>
          {commentText.labelText[lang]}
        </label>
        <textarea
          id={TEXT}
          name={TEXT}
          className={inputFieldStyle}
          placeholder={commentText.placeholder[lang]}
          aria-label={commentText.ariaLabel[lang]}
          rows={4}
          cols={60}
          maxLength={commentText.maxSize.value}
          aria-describedby={`${TEXT}-error`}
          required
        />
        <FieldError formState={formState} name={TEXT} />
      </div>

      <SubmitPendingButton
        ariaLabel={submit.ariaLabel[lang]}
        pendingInnerHtml={submit.pendingInnerText[lang]}
        className="MovingButton"
      >
        {submit.innerText[lang]}
      </SubmitPendingButton>
      {noScriptFallback}
    </form>
  );
};

export default CommentForm;
