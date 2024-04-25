'use client';

import { useFormStatus } from 'react-dom';
import BaseButton from './BaseButton/BaseButton';
import React from 'react';

interface IProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  ariaLabel: string;
  innerHtml: React.ReactNode;
  pendingInnerHtml: React.ReactNode;
}

export function SubmitPendingButton({
  ariaLabel,
  innerHtml,
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
      {pending ? `${pendingInnerHtml}...` : innerHtml}
    </BaseButton>
  );
}
