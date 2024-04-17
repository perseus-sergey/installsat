import { IFormState } from '@/models/comments.model';
import { useRef, useEffect } from 'react';
import { toast } from 'react-hot-toast';

const useToastMessage = (formState: IFormState) => {
  const prevTimestamp = useRef(formState.timestamp);

  const isShowToast =
    formState.message && formState.timestamp !== prevTimestamp.current;

  useEffect(() => {
    if (isShowToast) {
      if (formState.status === 'ERROR') {
        toast.error(formState.message);
      } else {
        toast.success(formState.message);
      }

      prevTimestamp.current = formState.timestamp;
    }
  }, [formState, isShowToast]);

  return (
    <noscript>
      {formState.status === 'ERROR' && (
        <div style={{ color: 'red' }}>{formState.message}</div>
      )}

      {formState.status === 'SUCCESS' && (
        <div style={{ color: 'green' }}>{formState.message}</div>
      )}
    </noscript>
  );
};

export { useToastMessage };
