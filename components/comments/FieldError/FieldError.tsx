import { IFormState } from '@/controllers/toast.controller';
import { ECommentFormNames } from '@/models/comments.model';

interface IFieldErrorProps {
  formState: IFormState;
  name: ECommentFormNames;
}

const FieldError = ({ formState, name }: IFieldErrorProps) => {
  return (
    <span style={{ color: '#f3ff8c' }} data-testid="FieldError" role="status">
      {formState.fieldErrors[name]?.[0]}
    </span>
  );
};
export default FieldError;
