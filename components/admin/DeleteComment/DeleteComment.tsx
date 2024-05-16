'use client';

import TooltipSimple from '@/components/ui/tooltips/TooltipSimple/TooltipSimple';
import { useFormState } from 'react-dom';
import { SubmitPendingButton } from '@/components/ui/buttons/SubmitPendingBtn';
import { useToastMessage } from '@/libs/hooks/useToastMessage';
import { EMPTY_FORM_STATE } from '@/controllers/toast.controller';
import { deleteCommentAction } from '@/libs/actions/comments.action';
import { EDBTableTitles } from '@/models/ui.model';

interface IDeleteCommentProps {
  commentID: string;
  dbTableName: EDBTableTitles;
  revalidateUrl: string;
}

const DeleteComment = ({
  commentID,
  dbTableName,
  revalidateUrl,
}: IDeleteCommentProps) => {
  const deleteCommentHandler = deleteCommentAction.bind(
    null,
    commentID,
    dbTableName,
    revalidateUrl
  );

  const [formState, formAction] = useFormState(
    deleteCommentHandler,
    EMPTY_FORM_STATE
  );
  const noScriptFallback = useToastMessage(formState);

  return (
    <form action={formAction} id={commentID}>
      <TooltipSimple tooltipText="Remove comment">
        <SubmitPendingButton
          ariaLabel="Remove comment"
          style={{ color: 'red', minWidth: '3rem', textAlign: 'center' }}
          innerHtml="⌫"
          pendingInnerHtml="🕓"
        />
      </TooltipSimple>
      {noScriptFallback}
    </form>
  );
};

export default DeleteComment;
