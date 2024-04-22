'use client';

import { useFormState } from 'react-dom';
import styles from './DeleteCommentSubscription.module.scss';
import { SubmitPendingButton } from '../ui/buttons/SubmitPendingBtn';
import { useToastMessage } from '@/libs/hooks/useToastMessage';
import { EMPTY_FORM_STATE } from '@/controllers/toast.controller';
import { delSubscriptionAction } from '@/libs/actions/comments.action';
import { EDBTableTitles, LANGUAGE } from '@/models/ui.model';
import TooltipSimple from '../ui/TooltipSimple/TooltipSimple';
import Link from 'next/link';
import { EUrlBaseParam } from '@/models/url.model';
import { COMMENTS_MODEL } from '@/models/comments.model';

const {
  deleteSubscriptionPage: { askText, answerText },
} = COMMENTS_MODEL;

interface IDeleteCommentSubscriptionProps {
  articleTitle: string;
  articleId: string;
  commentDbTable: EDBTableTitles;
  mail: string;
}

const DeleteCommentSubscription = ({
  articleTitle,
  articleId,
  commentDbTable,
  mail,
}: IDeleteCommentSubscriptionProps) => {
  const deleteSubscriptionHandler = delSubscriptionAction.bind(
    null,
    articleId,
    commentDbTable,
    mail
  );

  const [formState, formAction] = useFormState(
    deleteSubscriptionHandler,
    EMPTY_FORM_STATE
  );

  const noScriptFallback = useToastMessage(formState);

  return (
    <div
      className={styles.DeleteCommentSubscription}
      data-testid="DeleteCommentSubscription"
    >
      {formState.status === 'SUCCESS' ? (
        <p className={styles.responseBlock}>
          {answerText[LANGUAGE]}
          <br />
          <em className={styles.articleName}>✧{articleTitle}✧</em>
        </p>
      ) : (
        <form id="remove-subscription-form" action={formAction}>
          <p className={styles.responseBlock}>
            {askText[LANGUAGE]}
            <br />
            <em className={styles.articleName}>✧{articleTitle}✧</em>?
          </p>
          <div className={styles.buttonsWrapper}>
            <TooltipSimple tooltipText="Видалити поштову адресу зі списку розсилки">
              <SubmitPendingButton
                className={styles.confirmButton}
                ariaLabel="Видалити поштову адресу зі списку розсилки"
                innerHtml={
                  <>
                    <span className={styles.checkMark}></span>
                    Так
                  </>
                }
                pendingInnerHtml="Видалення..."
              />
            </TooltipSimple>
            <TooltipSimple tooltipText="Не видаляти мою поштову адресу зі списку розсилки">
              <Link
                className={styles.cancelButton}
                aria-label="Не видаляти мою поштову адресу зі списку розсилки"
                href={EUrlBaseParam.BASE_PATH}
              >
                <span className={styles.crossMark}>❌</span>Ні
              </Link>
            </TooltipSimple>
          </div>
          {noScriptFallback}
        </form>
      )}
    </div>
  );
};

export default DeleteCommentSubscription;
