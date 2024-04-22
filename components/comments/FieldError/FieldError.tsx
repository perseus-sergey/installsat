import { IFormState } from '@/controllers/toast.controller';
import { ECommentFormNames } from '@/models/comments.model';
// import styles from './FieldError.module.scss';

interface IFieldErrorProps {
  formState: IFormState;
  name: ECommentFormNames;
}

const FieldError = ({ formState, name }: IFieldErrorProps) => {
  return (
    // <span className={styles.FieldError} data-testid="FieldError">
    <span style={{ color: '#f3ff8c' }} data-testid="FieldError">
      {formState.fieldErrors[name]?.[0]}
    </span>
  );
};
export default FieldError;
