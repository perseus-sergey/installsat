'use client';

import { Toaster } from 'react-hot-toast';

const ToastProvider = ({ children }: { children?: React.ReactNode }) => (
  <>
    {children}
    <Toaster />
  </>
);

export default ToastProvider;
