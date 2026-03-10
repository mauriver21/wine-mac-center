import React, { useState } from 'react';
import { LoadingDialogContext, LoadingDialogContextType } from '@contexts/LoadingDialogContext';
import { LoadingDialog } from '@components/LoadingDialog';

export interface LoadingDialogProviderProps {
  children?: React.ReactElement;
}

export const LoadingDialogProvider: React.FC<LoadingDialogProviderProps> = ({ children }) => {
  const [dialogState, setDialogState] = useState<{ message: string; open: boolean }>({
    message: '',
    open: false
  });

  const open: LoadingDialogContextType['open'] = ({ message }) => {
    setDialogState({ message, open: true });
  };

  const close = () => {
    setDialogState((prev) => ({ ...prev, open: false }));
  };

  return (
    <LoadingDialogContext.Provider value={{ open, close }}>
      <LoadingDialog {...dialogState} />
      {children}
    </LoadingDialogContext.Provider>
  );
};
