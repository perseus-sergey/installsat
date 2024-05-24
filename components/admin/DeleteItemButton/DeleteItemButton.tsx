'use client';

import TooltipSimple from '@/components/ui/tooltips/TooltipSimple/TooltipSimple';
import { useFormState } from 'react-dom';
import { SubmitPendingButton } from '@/components/ui/buttons/SubmitPendingBtn';
import { useToastMessage } from '@/libs/hooks/useToastMessage';
import { EMPTY_FORM_STATE } from '@/controllers/toast.controller';
import { deleteCommentAction } from '@/libs/actions/comments.action';
import { EDBTableTitles } from '@/models/ui.model';

interface IProps {
  itemID: string;
  dbTableName: EDBTableTitles;
  revalidateUrl: string;
}
// =================================================================
// Remove deletecomment component
// =================================================================
const DeleteItemButton = ({ itemID, dbTableName, revalidateUrl }: IProps) => {
  const deleteItemHandler = deleteCommentAction.bind(
    null,
    itemID,
    dbTableName,
    revalidateUrl
  );

  const [formState, formAction] = useFormState(
    deleteItemHandler,
    EMPTY_FORM_STATE
  );
  const noScriptFallback = useToastMessage(formState);

  return (
    <form action={formAction} id={itemID}>
      <TooltipSimple tooltipText="Remove item">
        <SubmitPendingButton
          ariaLabel="Remove item"
          style={{ color: 'red', minWidth: '3rem', textAlign: 'center' }}
          pendingInnerHtml="🕓"
        >
          ⌫
        </SubmitPendingButton>
      </TooltipSimple>
      {noScriptFallback}
    </form>
  );
};

export default DeleteItemButton;
