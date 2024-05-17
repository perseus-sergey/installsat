import { IFormState } from '@/controllers/toast.controller';
import { ECommentFormNames } from '@/models/comments.model';

interface IFieldErrorProps {
  formState: IFormState;
  name: ECommentFormNames;
  errorFieldId: string;
}

const FieldError = ({ formState, name, errorFieldId }: IFieldErrorProps) => (
  <div
    data-testid="FieldError"
    role="status"
    id={errorFieldId}
    aria-live="polite"
    aria-atomic="true"
  >
    {formState.fieldErrors[name] &&
      formState.fieldErrors[name]?.map((error: string) => (
        <p className="mt-2 text-sm text-yellow-200" key={error}>
          {error}
        </p>
      ))}
  </div>
);

export default FieldError;
