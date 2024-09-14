'use client';

import { useFormStatus } from 'react-dom';
import BaseButton from './BaseButton/BaseButton';
import { ButtonHTMLAttributes, ReactNode } from 'react';

interface IProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  ariaLabel: string;
  children: ReactNode;
  pendingInnerHtml?: ReactNode;
}

export function SubmitPendingButton({
  ariaLabel,
  children,
  pendingInnerHtml,
  ...attributes
}: IProps) {
  const { pending } = useFormStatus();
  const submitButtonStyle = {
    cursor: pending ? 'wait' : 'pointer',
  };

  return (
    <BaseButton
      type="submit"
      disabled={pending}
      style={submitButtonStyle}
      ariaLabel={ariaLabel}
      {...attributes}
    >
      {pending && pendingInnerHtml ? `${pendingInnerHtml}...` : children}
    </BaseButton>
  );
}
