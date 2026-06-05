import React, { useState } from 'react';
import { VersionDialogContext, VersionDialogContextType } from '@contexts/VersionDialogContext';
import { VersionDialog } from '@components/VersionDialog';
import { VersionDialogAction } from '@constants/enums';
import { VERSION } from '@constants/constants';

export interface VersionDialogProviderProps {
  children?: React.ReactElement;
}

export const VersionDialogProvider: React.FC<VersionDialogProviderProps> = ({ children }) => {
  const [dialogState, setDialogState] = useState<{
    message: string;
    open: boolean;
    action: VersionDialogAction;
    version: string;
  }>({
    message: '',
    open: false,
    action: VersionDialogAction.None,
    version: VERSION
  });

  const open: VersionDialogContextType['open'] = ({ message, action, version }) => {
    setDialogState({ message, open: true, action, version });
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
