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

  const askSteamGuardCode = async (...params: Parameters<typeof steamCli.downloadSteamApp>) => {
    const [args, spawnArgs] = params;
    //Logic to wait information.
    steamCli.downloadSteamApp({ ...args, guardCode: '' }, spawnArgs);
  };

  const downloadSteamApp: typeof steamCli.downloadSteamApp = (args, spawnArgs) => {
    return steamCli.downloadSteamApp(args, {
      onStdOut: (data) => {
        if (data.includes('Steam Guard')) {
          askSteamGuardCode(args, spawnArgs);
        }
        spawnArgs?.onStdOut?.(data);
      },
      onStdErr: (data) => {
        spawnArgs?.onStdErr?.(data);
      },
      onExit: (data) => {
        spawnArgs?.onExit?.(data);
      }
    });
  };

  return (
    <SteamCliContext.Provider value={{ ...steamCli, refresh, downloadSteamApp }}>
      {children}
    </SteamCliContext.Provider>
  );
};
