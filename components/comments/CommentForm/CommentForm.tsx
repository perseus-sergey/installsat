'use client';

import styles from './CommentForm.module.scss';
import { SubmitPendingButton } from '@/components/ui/buttons/SubmitPendingBtn';
import { useFormState } from 'react-dom';
import { COMMENTS_MODEL, ECommentFormNames } from '@/models/comments.model';
import FieldError from '../FieldError/FieldError';
import { useToastMessage } from '@/libs/hooks/useToastMessage';
import { useFormReset } from '@/libs/hooks/useFormReset';
import { EDBTableTitles, DEFAULT_LANG } from '@/models/ui.model';
import { useFormCommentSendEmail } from '@/libs/hooks/useFormCommentSendEmail';
import { EMPTY_FORM_STATE } from '@/controllers/toast.controller';
import { IUserLocation } from '@/models/userLocation.model';
import { addCommentAction } from '@/libs/actions/comments.action';

const { AUTHOR, EMAIL, TEXT } = ECommentFormNames;
const { authorEmail, authorName, commentText, submit } =
  COMMENTS_MODEL.commentForm;

interface ICommentProps {
  revalidateUrl: string;
  dbCommentTableName: EDBTableTitles;
  articleId: string;
  articleName: string;
  userLocation: IUserLocation | null;
  baseUrl: string;
  emailKey: string;
}

const CommentForm = ({
  revalidateUrl,
  dbCommentTableName,
  articleId,
  articleName,
  userLocation,
  baseUrl,
  emailKey,
}: ICommentProps) => {
  const sendCommentHandler = addCommentAction.bind(
    null,
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
    emailKey
  );
  const formRef = useFormReset(formState);

  return (
    <form
      id="comment-form"
      ref={formRef}
      className={styles.CommentForm}
      action={formAction}
    >
      <div className="pb-4 pt-1 flex flex-col">
        <label htmlFor={AUTHOR} className={styles.required}>
          {authorName.labelText[DEFAULT_LANG]}
        </label>
        <input
          id={AUTHOR}
          name={AUTHOR}
          className={styles.inputField}
          maxLength={authorName.maxSize.value}
          size={20}
          required
          placeholder={authorName.placeholder[DEFAULT_LANG]}
          aria-label={authorName.ariaLabel[DEFAULT_LANG]}
          aria-describedby={`${AUTHOR}-error`}
        />
        <FieldError formState={formState} name={AUTHOR} />
      </div>

      <div className="pb-4 pt-1 flex flex-col">
        <label htmlFor={EMAIL}>{authorEmail.labelText[DEFAULT_LANG]}</label>
        <input
          type="email"
          id={EMAIL}
          name={EMAIL}
          maxLength={40}
          className={styles.inputField}
          size={30}
          placeholder={authorEmail.placeholder}
          aria-label={authorEmail.ariaLabel[DEFAULT_LANG]}
          aria-describedby={`${EMAIL}-error`}
        />
        <FieldError formState={formState} name={EMAIL} />
      </div>

      <div className="pb-4 pt-1 flex flex-col">
        <label htmlFor={TEXT} className={styles.required}>
          {commentText.labelText[DEFAULT_LANG]}
        </label>
        <textarea
          id={TEXT}
          name={TEXT}
          className={styles.inputField}
          placeholder={commentText.placeholder[DEFAULT_LANG]}
          aria-label={commentText.ariaLabel[DEFAULT_LANG]}
          rows={4}
          cols={60}
          maxLength={commentText.maxSize.value}
          aria-describedby={`${TEXT}-error`}
          required
        />
        <FieldError formState={formState} name={TEXT} />
      </div>

      <SubmitPendingButton
        ariaLabel={submit.ariaLabel[DEFAULT_LANG]}
        pendingInnerHtml={submit.pendingInnerText[DEFAULT_LANG]}
        className="MovingButton"
      >
        {submit.innerText[DEFAULT_LANG]}
      </SubmitPendingButton>
      {noScriptFallback}
    </form>
  );
};

export default CommentForm;
