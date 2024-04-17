'use client';

import { Toaster } from 'react-hot-toast';
// import styles from './ToastProvider.module.scss';

interface IToastProviderProps {
  children?: React.ReactNode;
}

const ToastProvider = ({ children }: IToastProviderProps) => (
  <>
    {children}
    <Toaster />
  </>
);

export default ToastProvider;
