import React, { useState } from 'react';
import { LoadingDialogContext, LoadingDialogContextType } from '@contexts/LoadingDialogContext';
import { LoadingDialog } from '@components/LoadingDialog';
import { useI18n } from 'reactjs-shared-ui/i18next';

export interface LoadingDialogProviderProps {
  children?: React.ReactElement;
}

export const LoadingDialogProvider: React.FC<LoadingDialogProviderProps> = ({ children }) => {
  const { t } = useI18n();
  const [dialogState, setDialogState] = useState<{ message: string; open: boolean }>({
    message: t('preparingWineApp'),
    open: false
  });

  const open: LoadingDialogContextType['open'] = ({ message }) => {
    setDialogState({ message, open: true });
  };

  const close = () => {
    setDialogState((prev) => ({ ...prev, open: false }));
  };

  const updateMessage = (message: string) => {
    setDialogState((prev) => ({ ...prev, message }));
  };

  return (
    <LoadingDialogContext.Provider value={{ open, close, updateMessage }}>
      <LoadingDialog {...dialogState} />
      {children}
    </LoadingDialogContext.Provider>
  );
};

