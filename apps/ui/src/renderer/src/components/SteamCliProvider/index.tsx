import { SteamCliContext } from '@contexts/SteamCliContext';
import { useLocalState } from '@hooks/useLocalState';
import { createSteamCli } from '@utils/createSteamCli';
import { useRefresh } from '@utils/useRefresh';
import { useMemo } from 'react';

export interface SteamCliProviderProps {
  children?: React.ReactNode;
}

export const SteamCliProvider: React.FC<SteamCliProviderProps> = ({ children }) => {
  const { refresh } = useRefresh();
  const { getState } = useLocalState('steamCredentials');
  const { userName = '', password = '' } = getState() || {};
  const steamCli = useMemo(
    () => createSteamCli({ credentials: { userName, password } }),
    [userName, password]
  );

  return (
    <SteamCliContext.Provider value={{ ...steamCli, refresh }}>{children}</SteamCliContext.Provider>
  );
};
