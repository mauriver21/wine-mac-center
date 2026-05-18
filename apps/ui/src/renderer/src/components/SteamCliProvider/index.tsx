import { SteamCredentialsDialog } from '@components/SteamCredentialsDialog';
import { SteamGuardCodeDialog } from '@components/SteamGuardCodeDialog';
import { EventName } from '@constants/enums';
import { SteamCliContext } from '@contexts/SteamCliContext';
import { useLocalState } from '@hooks/useLocalState';
import { SteamCredentials } from '@interfaces/SteamCredentials';
import { useAppModel } from '@models/useAppModel';
import { createSteamCli } from '@utils/createSteamCli';
import { findOutputPids } from '@utils/findOutputPids';
import { useRefresh } from '@utils/useRefresh';
import { waitValue } from '@utils/waitValue';
import { useMemo, useRef, useState } from 'react';

export interface SteamCliProviderProps {
  children?: React.ReactNode;
}

type DownloadSteamAppParams = Parameters<ReturnType<typeof createSteamCli>['downloadSteamApp']>;

export const SteamCliProvider: React.FC<SteamCliProviderProps> = ({ children }) => {
  const appModel = useAppModel();
  const [openGuardCodeDialog, setOpenGuardCodeDialog] = useState(false);
  const [openSteamCredentialsDialog, setOpenSteamCredentialsDialog] = useState(false);
  const { refresh } = useRefresh();
  const { getState, setState } = useLocalState('steamCredentials');
  const ref = useRef<{
    guardCode: string;
    steamCredentials?: SteamCredentials | EventName.Cancelled;
  }>({
    guardCode: ''
  });
  const { userName = '', password = '' } = getState() || {};
  const steamCli = useMemo(
    () => createSteamCli({ credentials: { userName, password } }),
    [userName, password]
  );

  const setGuardCode = (guardCode: string) => {
    ref.current.guardCode = guardCode;
  };

  const setSteamCredentials = (
    steamCredentials: SteamCredentials | undefined | EventName.Cancelled
  ) => {
    ref.current.steamCredentials = steamCredentials;
  };

  const login = async (credentials: SteamCredentials, options?: { throwError?: boolean }) => {
    try {
      await steamCli.login(credentials);
      appModel.dispatchSuccessMessage('Login Success');
    } catch (error) {
      if (options?.throwError) throw error;
      appModel.dispatchError(error);
    }
  };

  const askSteamGuardCode = async (
    args: DownloadSteamAppParams[0],
    spawnArgs: DownloadSteamAppParams[1],
    prevPids: string
  ) => {
    setGuardCode('');
    setOpenGuardCodeDialog(true);
    const guardCode = await waitValue(ref.current, 'guardCode');
    if (guardCode !== 'CANCELED') {
      steamCli.downloadSteamApp(
        { ...args, guardCode },
        {
          ...spawnArgs,
          onExit: (data) => {
            spawnArgs?.onExit?.(data);
            steamCli.killPids(prevPids);
          }
        }
      );
    } else if (guardCode === 'CANCELED') {
      steamCli.killPids(prevPids);
    }
    setOpenGuardCodeDialog(false);
  };

  const loginCredentialsAreValid = async () => {
    const credentials = getState();
    if (credentials === undefined) return false;

    try {
      await login(credentials, { throwError: true });
      return true;
    } catch {
      return false;
    }
  };

  const askSteamCredentials = async () => {
    if (await loginCredentialsAreValid()) return;

    setSteamCredentials(undefined);
    setOpenSteamCredentialsDialog(true);

    const steamCredentials = await waitValue(ref.current, 'steamCredentials');
    if (steamCredentials && steamCredentials !== EventName.Cancelled) {
      setState({ ...getState(), ...steamCredentials });
      try {
        await login(steamCredentials, { throwError: true });
        setOpenSteamCredentialsDialog(false);
      } catch (error) {
        appModel.dispatchError(error);
      }
    } else {
      setOpenSteamCredentialsDialog(false);
      throw Error('No Steam credentials provided, unable to login.');
    }
  };

  const downloadSteamApp: typeof steamCli.downloadSteamApp = (args, spawnArgs) => {
    return steamCli.downloadSteamApp(args, {
      onStdOut: (data) => {
        const pids = findOutputPids(data);
        if (data.includes('Steam Guard')) {
          askSteamGuardCode(args, spawnArgs, pids);
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
      <SteamCredentialsDialog
        open={openSteamCredentialsDialog}
        setOpen={setOpenSteamCredentialsDialog}
        onAccept={(credentials) => {
          setState({ ...getState(), ...credentials });
        }}
        onCancel={(eventName) => {
          setSteamCredentials(eventName);
        }}
      />
      <SteamCliContext.Provider
        value={{ ...steamCli, refresh, downloadSteamApp, askSteamCredentials, login }}
      >
        {children}
      </SteamCliContext.Provider>
    </>
  );
};
