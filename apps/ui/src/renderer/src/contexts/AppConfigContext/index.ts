import { WineApp } from '@interfaces/WineApp';
import React, { createContext } from 'react';

export const AppConfigContext = createContext<{
  wineApp: WineApp | undefined;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  refresh: () => void;
  signal: number;
} | null>(null);
