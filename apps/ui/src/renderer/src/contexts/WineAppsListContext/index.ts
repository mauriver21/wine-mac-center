import React, { createContext } from 'react';

export const WineAppsListContext = createContext<{
  appName: string | undefined;
  setAppName: React.Dispatch<React.SetStateAction<string | undefined>>;
  appConfigId: string | undefined;
  setAppConfigId: React.Dispatch<React.SetStateAction<string | undefined>>;
  showDialog: boolean;
  setShowDialog: React.Dispatch<React.SetStateAction<boolean>>;
} | null>(null);
