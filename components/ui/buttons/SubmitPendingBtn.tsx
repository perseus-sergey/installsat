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

  return (
    <BaseButton
      type="submit"
      disabled={pending}
      ariaLabel={ariaLabel}
      {...attributes}
    >
      {pending ? `${pendingInnerHtml}...` : innerHtml}
    </BaseButton>
  );
}
