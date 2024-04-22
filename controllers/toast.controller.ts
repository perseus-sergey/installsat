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

// export interface IFormStateForToast {
//   status: 'UNSET' | 'SUCCESS' | 'ERROR';
//   message: string;
//   timestamp: number;
// }

// export const EMPTY_FORM_STATE: IFormStateForToast = {
//   status: 'UNSET' as const,
//   message: '',
//   timestamp: Date.now(),
// };

export const fromErrorToFormState = (error: unknown): IFormState => ({
  status: 'ERROR' as const,
  message: error instanceof Error ? error.message : 'An unknown error occurred',
  fieldErrors: error instanceof ZodError ? error.flatten().fieldErrors : {},
  timestamp: Date.now(),
  fieldValues: {},
});

// export const toFormState = (
//   status: IFormState['status'],
//   message: string
// ): IFormState => ({
//   status,
//   message,
//   timestamp: Date.now(),
// });

// export const fromErrorToFormState = (
//   error: unknown,
//   fieldValues = emptyFieldValues
// ): IFormState => {
//   if (error instanceof ZodError) {
//     return {
//       status: 'ERROR' as const,
//       message: '',
//       fieldErrors: error.flatten().fieldErrors,
//       timestamp: Date.now(),
//       fieldValues,
//     };
//   } else if (error instanceof Error) {
//     return {
//       status: 'ERROR' as const,
//       message: error.message,
//       fieldErrors: {},
//       timestamp: Date.now(),
//       fieldValues,
//     };
//   } else {
//     return {
//       status: 'ERROR' as const,
//       message: 'An unknown error occurred',
//       fieldErrors: {},
//       timestamp: Date.now(),
//       fieldValues,
//     };
//   }
// };

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
