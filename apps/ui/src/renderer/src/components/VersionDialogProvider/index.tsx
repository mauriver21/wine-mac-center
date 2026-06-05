import React, { useState } from 'react';
import { VersionDialogContext, VersionDialogContextType } from '@contexts/VersionDialogContext';
import { VersionDialog } from '@components/VersionDialog';
import { VersionDialogAction } from '@constants/enums';

export interface VersionDialogProviderProps {
  children?: React.ReactElement;
}

export const VersionDialogProvider: React.FC<VersionDialogProviderProps> = ({ children }) => {
  const [dialogState, setDialogState] = useState<{
    message: string;
    open: boolean;
    action: VersionDialogAction;
  }>({
    message: '',
    open: false,
    action: VersionDialogAction.None
  });

  const open: VersionDialogContextType['open'] = ({ message, action }) => {
    setDialogState({ message, open: true, action });
  };

  const close = () => {
    setDialogState((prev) => ({ ...prev, open: false }));
  };

  return (
    <VersionDialogContext.Provider value={{ open, close }}>
      <VersionDialog {...dialogState} />
      {children}
    </VersionDialogContext.Provider>
  );
};
