'use client';

import styles from './CommentForm.module.scss';
// import '../styles.css';
import { SubmitPendingButton } from '@/components/ui/buttons/SubmitPendingBtn';
import { formCommentAction } from '../formComment.action';
import { useFormState } from 'react-dom';
import { COMMENTS_MODEL, ECommentFormNames } from '@/models/comments.model';
import FieldError from '../FieldError/FieldError';
import { useToastMessage } from '@/libs/hooks/useToastMessage';
import { useFormReset } from '@/libs/hooks/useFormReset';
import { EDBTableTitles, LANGUAGE } from '@/models/ui.model';
import { useFormCommentSendEmail } from '@/libs/hooks/useFormCommentSendEmail';
import { EMPTY_FORM_STATE } from '@/controllers/toast.controller';
import { IUserLocation } from '@/models/userLocation.model';

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
  const sendCommentHandler = formCommentAction.bind(
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
      <FieldError formState={formState} name={AUTHOR} />
      <input
        id={AUTHOR}
        name={AUTHOR}
        className={styles.inputField}
        maxLength={authorName.maxSize.value}
        size={20}
        required
        placeholder={authorName.placeholder[LANGUAGE]}
        aria-label={authorName.ariaLabel[LANGUAGE]}
      />
      <label htmlFor={AUTHOR} className={styles.required}>
        {authorName.labelText[LANGUAGE]}
      </label>

      <FieldError formState={formState} name={EMAIL} />
      <input
        type="email"
        id={EMAIL}
        name={EMAIL}
        maxLength={40}
        className={styles.inputField}
        size={30}
        placeholder={authorEmail.placeholder}
        aria-label={authorEmail.ariaLabel[LANGUAGE]}
      />
      <label htmlFor={EMAIL}>{authorEmail.labelText[LANGUAGE]}</label>

      <FieldError formState={formState} name={TEXT} />
      <textarea
        id={TEXT}
        name={TEXT}
        className={styles.inputField}
        placeholder={commentText.placeholder[LANGUAGE]}
        aria-label={commentText.ariaLabel[LANGUAGE]}
        rows={4}
        cols={60}
        maxLength={commentText.maxSize.value}
        required
      />
      <label htmlFor={TEXT} className={styles.required}>
        {commentText.labelText[LANGUAGE]}
      </label>
      <SubmitPendingButton
        ariaLabel={submit.ariaLabel[LANGUAGE]}
        innerHtml={submit.innerText[LANGUAGE]}
        pendingInnerHtml={submit.pendingInnerText[LANGUAGE]}
        className={styles.submitCommentButton}
      />
      {noScriptFallback}
    </form>
  );
};

export default CommentForm;
