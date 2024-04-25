import { IFormState } from '@/controllers/toast.controller';
import { useRef, useEffect } from 'react';

const useFormReset = (formState: IFormState) => {
  const formRef = useRef<HTMLFormElement>(null);
  const prevTimestamp = useRef(formState.timestamp);

  useEffect(() => {
    if (!formRef.current) return;
    if (
      formState.status === 'SUCCESS' &&
      formState.timestamp !== prevTimestamp.current
    ) {
      formRef.current.reset();

      prevTimestamp.current = formState.timestamp;
    }
  }, [formState.status, formState.timestamp]);

  return formRef;
};

export { useFormReset };
