import { IFormState } from '@/controllers/toast.controller';
import { EArticleEditFields } from '@/models/articles/articleEdit.model';
import { EChannelEditFields } from '@/models/channels/channel.model';
import { ECommentFormNames } from '@/models/ui/comments.model';
import { ELoginFormNames } from '@/models/login.model';

interface IFieldErrorProps extends React.HTMLAttributes<HTMLElement> {
  formState: IFormState;
  name:
    | ECommentFormNames
    | ELoginFormNames
    | EArticleEditFields
    | EChannelEditFields
    | string;
  errorFieldId?: string;
}

const FieldError = ({
  formState,
  name,
  errorFieldId = `${name}-error`,
  className,
}: IFieldErrorProps) => {
  return formState.fieldErrors[name] ? (
    <div
      data-testid="FieldError"
      role="alert"
      id={errorFieldId}
      aria-live="polite"
      aria-atomic="true"
    >
      {formState.fieldErrors[name]?.length === 1 ? (
        <p className={className || 'mt-2 text-sm text-yellow-200'}>
          ⛔ {formState.fieldErrors[name]?.[0]}
        </p>
      ) : (
        <ul>
          {formState.fieldErrors[name]?.map((error: string) => (
            <li
              className={className || 'mt-2 text-sm text-yellow-200'}
              key={error}
            >
              ⛔ {error}
            </li>
          ))}
        </ul>
      )}
    </div>
  ) : null;
};

export default FieldError;
