import { AuthError } from 'next-auth';
import { ZodError } from 'zod';

export interface IFormState {
  status: 'UNSET' | 'SUCCESS' | 'ERROR';
  message: string;
  fieldErrors: Record<string, string[] | undefined>;
  fieldValues: Record<string, string | undefined>;
  timestamp: number;
}

export const EMPTY_FORM_STATE: IFormState = {
  status: 'UNSET' as const,
  message: '',
  fieldErrors: {},
  fieldValues: {},
  timestamp: Date.now(),
};

export const fromErrorToFormState = (error: unknown): IFormState => {
  console.log('🚀 ~ fromErrorToFormState ~ error:', error);
  let message = '';

  if (error instanceof AuthError) {
    message =
      error.type === 'CredentialsSignin'
        ? 'Invalid credentials.'
        : 'Something went wrong.';
  } else if (error instanceof ZodError)
    message = 'Complete all the fields correctly.';
  else
    message =
      error instanceof Error ? error.message : 'An unknown error occurred';

  return {
    status: 'ERROR' as const,
    message,
    fieldErrors: error instanceof ZodError ? error.flatten().fieldErrors : {},
    timestamp: Date.now(),
    fieldValues: {},
  };
};

export const toFormState = (
  status: IFormState['status'],
  message: string,
  fieldValues?: Record<string, string | undefined>
): IFormState => {
  return {
    status,
    message,
    fieldErrors: {},
    timestamp: Date.now(),
    fieldValues: fieldValues || {},
  };
};
