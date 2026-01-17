import { SteamGuardCodeDialog } from '@components/SteamGuardCodeDialog';
import { SteamCliContext } from '@contexts/SteamCliContext';
import { useLocalState } from '@hooks/useLocalState';
import { createSteamCli } from '@utils/createSteamCli';
import { findOutputPID } from '@utils/findOutputPID';
import { useRefresh } from '@utils/useRefresh';
import { waitValue } from '@utils/waitValue';
import { useMemo, useRef, useState } from 'react';

export interface SteamCliProviderProps {
  children?: React.ReactNode;
}

type DownloadSteamAppParams = Parameters<ReturnType<typeof createSteamCli>['downloadSteamApp']>;

export const SteamCliProvider: React.FC<SteamCliProviderProps> = ({ children }) => {
  const [openGuardCodeDialog, setOpenGuardCodeDialog] = useState(false);
  const { refresh } = useRefresh();
  const { getState } = useLocalState('steamCredentials');
  const refGuardCode = useRef<{ guardCode: string }>({ guardCode: '' });
  const { userName = '', password = '' } = getState() || {};
  const steamCli = useMemo(
    () => createSteamCli({ credentials: { userName, password } }),
    [userName, password]
  );

  const setGuardCode = (guardCode: string) => {
    refGuardCode.current.guardCode = guardCode;
  };

  const askSteamGuardCode = async (
    args: DownloadSteamAppParams[0],
    spawnArgs: DownloadSteamAppParams[1],
    prevPid: number | null
  ) => {
    setGuardCode('');
    setOpenGuardCodeDialog(true);
    const guardCode = await waitValue(refGuardCode.current, 'guardCode');
    if (guardCode !== 'CANCELED') {
      steamCli.downloadSteamApp(
        { ...args, guardCode },
        {
          ...spawnArgs,
          onExit: (data) => {
            spawnArgs?.onExit?.(data);
            steamCli.killPid(prevPid);
          }
        }
      );
    } else if (guardCode === 'CANCELED') {
      steamCli.killPid(prevPid);
    }
    setOpenGuardCodeDialog(false);
  };

  const downloadSteamApp: typeof steamCli.downloadSteamApp = (args, spawnArgs) => {
    return steamCli.downloadSteamApp(args, {
      onStdOut: (data) => {
        const pid = findOutputPID(data);
        if (data.includes('Steam Guard')) {
          askSteamGuardCode(args, spawnArgs, pid);
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
    <>
      <SteamGuardCodeDialog
        open={openGuardCodeDialog}
        setOpen={setOpenGuardCodeDialog}
        onAccept={(guardCode) => {
          setGuardCode(guardCode);
        }}
        onCancel={(eventName) => {
          setGuardCode(eventName);
        }}
      />
      <SteamCliContext.Provider value={{ ...steamCli, refresh, downloadSteamApp }}>
        {children}
      </SteamCliContext.Provider>
    </>
  );
};
