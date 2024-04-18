'use client';

import styles from './Comment.module.scss';
// import '../styles.css';
import { SubmitPendingButton } from '@/components/ui/buttons/SubmitPendingBtn';
import { formCommentAction } from '../formComment.action';
import { useFormState } from 'react-dom';
import { ECommentFormNames, EMPTY_FORM_STATE } from '@/models/comments.model';
import FieldError from '../FieldError/FieldError';
import { useToastMessage } from '@/libs/hooks/useToastMessage';
import { useFormReset } from '@/libs/hooks/useFormReset';
import { EDBTableTitles } from '@/models/ui.model';

const { AUTHOR, EMAIL, TEXT } = ECommentFormNames;

interface ICommentProps {
  revalidateUrl: string;
  dbCommentTableName: EDBTableTitles;
  articleId: number;
  articleName: string;
}

const Comment = ({
  revalidateUrl,
  dbCommentTableName,
  articleId,
  articleName,
}: ICommentProps) => {
  const sendCommentHandler = formCommentAction.bind(
    null,
    articleId,
    articleName,
    '',
    revalidateUrl,
    dbCommentTableName
  );

  const [formState, formAction] = useFormState(
    sendCommentHandler,
    EMPTY_FORM_STATE
  );

  const noScriptFallback = useToastMessage(formState);
  const formRef = useFormReset(formState);

  return (
    <form
      id="comment-form"
      ref={formRef}
      className={styles.Comment}
      data-testid="Comment"
      action={formAction}
    >
      <FieldError formState={formState} name={AUTHOR} />
      <input
        id={AUTHOR}
        name={AUTHOR}
        className={styles.inputField}
        autoFocus
        maxLength={20}
        size={20}
        required
        placeholder="Ім'я..."
        aria-label="Введіть своє Ім'я"
      />
      <label htmlFor={AUTHOR} className={styles.required}>{`Ваше Ім'я`}</label>

      <FieldError formState={formState} name={EMAIL} />
      <input
        type="email"
        id={EMAIL}
        name={EMAIL}
        maxLength={40}
        className={styles.inputField}
        size={30}
        placeholder="your@email.com"
        aria-label="Введіть свою електронну пошту"
      />
      <label htmlFor={EMAIL}>
        Адреса електронної пошти (ніде не відображається)
      </label>

      <FieldError formState={formState} name={TEXT} />
      <textarea
        id={TEXT}
        name={TEXT}
        className={styles.inputField}
        autoFocus
        placeholder="Введіть коментар..."
        aria-label="Введіть коментар"
        rows={4}
        cols={60}
        maxLength={450}
        required
      />
      <label htmlFor={TEXT} className={styles.required}>
        Зміст
      </label>
      <SubmitPendingButton
        ariaLabel="Відправити коментар"
        innerHtml="Відправити"
        pendingInnerHtml="Відправлення"
        className={styles.submitCommentButton}
      />
      {noScriptFallback}
    </form>
  );
};

export default Comment;
