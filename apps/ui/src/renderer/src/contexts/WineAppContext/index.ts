import { WineApp } from '@interfaces/WineApp';
import React, { createContext } from 'react';

export const WineAppContext = createContext<{
  wineApp: WineApp | undefined;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  refresh: () => void;
  signal: number;
  urls: {
    artworkURL: string;
    iconURL: string;
    launcherImgURL: string;
  };
} | null>(null);
