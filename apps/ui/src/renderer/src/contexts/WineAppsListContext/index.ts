import React, { createContext } from 'react';

export const WineAppsListContext = createContext<{
  appName: string;
  setAppName: React.Dispatch<React.SetStateAction<string>>;
  showDialog: boolean;
  setShowDialog: React.Dispatch<React.SetStateAction<boolean>>;
} | null>(null);
