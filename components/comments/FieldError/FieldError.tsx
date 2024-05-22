import { IFormState } from '@/controllers/toast.controller';
import { ECommentFormNames } from '@/models/comments.model';
import { ELoginFormNames } from '@/models/login.model';

interface IFieldErrorProps {
  formState: IFormState;
  name: ECommentFormNames | ELoginFormNames;
  errorFieldId: string;
}

const FieldError = ({ formState, name, errorFieldId }: IFieldErrorProps) => {
  return (
    <div
      data-testid="FieldError"
      role="status"
      id={errorFieldId}
      aria-live="polite"
      aria-atomic="true"
    >
      {formState.fieldErrors[name]?.length === 1 ? (
        <p className="mt-2 text-sm text-yellow-200">
          ⛔ {formState.fieldErrors[name]?.[0]}
        </p>
      ) : (
        <ul>
          {formState.fieldErrors[name]?.map((error: string) => (
            <li className="mt-2 text-sm text-yellow-200" key={error}>
              ⛔ {error}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FieldError;
