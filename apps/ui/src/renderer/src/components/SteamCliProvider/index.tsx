import { SteamCliContext } from '@contexts/SteamCliContext';
import { createSteamCli } from '@utils/createSteamCli';
import { useMemo } from 'react';

export interface SteamCliProviderProps {
  children?: React.ReactNode;
}

export const SteamCliProvider: React.FC<SteamCliProviderProps> = ({ children }) => {
  const steamCli = useMemo(() => createSteamCli(), []);

  return <SteamCliContext.Provider value={steamCli}>{children}</SteamCliContext.Provider>;
};
