'use client';

import styles from './CommentForm.module.scss';
import { SubmitPendingButton } from '@/components/ui/buttons/SubmitPendingBtn';
import { useFormState } from 'react-dom';
import { COMMENTS_MODEL, ECommentFormNames } from '@/models/comments.model';
// import FieldError from '../FieldError/FieldError';
import { useToastMessage } from '@/libs/hooks/useToastMessage';
import { useFormReset } from '@/libs/hooks/useFormReset';
import { EDBTableTitles, ELanguage } from '@/models/ui.model';
import { useFormCommentSendEmail } from '@/libs/hooks/useFormCommentSendEmail';
import { EMPTY_FORM_STATE } from '@/controllers/toast.controller';
import { IUserLocation } from '@/models/userLocation.model';
import { addCommentAction } from '@/libs/actions/comments.action';
import dynamic from 'next/dynamic';

const FieldError = dynamic(() => import('../FieldError/FieldError'), {
  ssr: false,
});

const { AUTHOR, EMAIL, TEXT } = ECommentFormNames;
const { authorEmail, authorName, commentText, submit } =
  COMMENTS_MODEL.commentForm;

interface ICommentProps {
  revalidateUrl: string;
  dbCommentTableName: EDBTableTitles;
  articleId: string | number;
  articleName: string;
  userLocation: IUserLocation | null;
  baseUrl: string;
  emailKey: string;
  lang: ELanguage;
}

const CommentForm = ({
  revalidateUrl,
  dbCommentTableName,
  articleId,
  articleName,
  userLocation,
  baseUrl,
  emailKey,
  lang,
}: ICommentProps) => {
  const sendCommentHandler = addCommentAction.bind(
    null,
    lang,
    articleId,
    userLocation && userLocation.status === 'success' ? userLocation.query : '',
    userLocation && userLocation.status === 'success'
      ? userLocation.countryCode
      : '',
    revalidateUrl,
    dbCommentTableName
  );

  const [formState, formAction] = useFormState(
    sendCommentHandler,
    EMPTY_FORM_STATE
  );

  const noScriptFallback = useToastMessage(formState);

  useFormCommentSendEmail(
    formState,
    articleName,
    revalidateUrl,
    dbCommentTableName,
    articleId,
    userLocation,
    baseUrl,
    emailKey,
    lang
  );
  const formRef = useFormReset(formState);

  const inputField =
    'max-w-72 sm:max-w-full mt-1 p-1 text-gray-700 border-lightgray border-2 cursor-auto bg-[linear-gradient(to_bottom,rgba(255,255,255,1)_0%,rgba(243,243,243,1)_50%,rgba(237,237,237,1)_51%,rgba(255,255,255,1)_100%)] border-inset';

  return (
    <form
      id="comment-form"
      ref={formRef}
      className="flex flex-col items-start gap-1 p-4"
      action={formAction}
    >
      <div className="pb-4 pt-1 flex flex-col">
        <label htmlFor={AUTHOR} className={styles.required}>
          {authorName.labelText[lang]}
        </label>
        <input
          id={AUTHOR}
          name={AUTHOR}
          className={inputField}
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
          className={inputField}
          size={30}
          placeholder={authorEmail.placeholder}
          aria-label={authorEmail.ariaLabel[lang]}
          aria-describedby={`${EMAIL}-error`}
        />
        <FieldError formState={formState} name={EMAIL} />
      </div>

      <div className="pb-4 pt-1 flex flex-col">
        <label htmlFor={TEXT} className={styles.required}>
          {commentText.labelText[lang]}
        </label>
        <textarea
          id={TEXT}
          name={TEXT}
          className={inputField}
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
