import { SteamCredentialsDialog } from '@components/SteamCredentialsDialog';
import { SteamGuardCodeDialog } from '@components/SteamGuardCodeDialog';
import { EventName } from '@constants/enums';
import { SteamCliContext } from '@contexts/SteamCliContext';
import { useLoadingDialog } from '@hooks/useLoadingDialog';
import { useLocalState } from '@hooks/useLocalState';
import { SpawnProcessArgs } from '@interfaces/SpawnProcessArgs';
import { SteamCredentials } from '@interfaces/SteamCredentials';
import { useAppModel } from '@models/useAppModel';
import { createSteamCli } from '@utils/createSteamCli';
import { findOutputPids } from '@utils/findOutputPids';
import { useRefresh } from '@utils/useRefresh';
import { waitValue } from '@utils/waitValue';
import { useMemo, useRef, useState } from 'react';
import { useI18n } from 'reactjs-shared-ui/i18next';

export interface SteamCliProviderProps {
  children?: React.ReactNode;
}

export const SteamCliProvider: React.FC<SteamCliProviderProps> = ({ children }) => {
  const { t } = useI18n();
  const dialog = useLoadingDialog();
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

  const login = async (credentials: SteamCredentials, spawnArgs?: SpawnProcessArgs) => {
    try {
      dialog.open({ message: t('loggingIntoSteam') });

      if (!(await steamCli.isInstalled())) {
        dialog.updateMessage(t('installingSteamClient'));
        await steamCli.install(spawnArgs);
      }

      dialog.updateMessage(t('loggingIntoSteam'));
      let steamGuardCanceled = false;

      await steamCli.login(credentials, {
        onStdOut: (data) => {
          if (data.includes('Steam Guard')) {
            dialog.close();
            askSteamGuardCode({
              onSuccess: ({ guardCode }) => {
                steamCli.login(
                  { ...credentials, guardCode },
                  {
                    ...spawnArgs,
                    onExit: (data) => {
                      spawnArgs?.onExit?.(data);
                    }
                  }
                );
              },
              onCanceled: () => {
                steamGuardCanceled = true;
              }
            });
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

      if (steamGuardCanceled) throw new Error(t('steamGuardCancelled'));
      appModel.dispatchSuccessMessage(t('loginSuccess'));
    } catch (error) {
      appModel.dispatchError(error);
    } finally {
      dialog.close();
    }
  };

  const askSteamGuardCode = async (args: {
    prevPids?: string;
    onSuccess?: (params: { guardCode: string; prevPids?: string }) => void;
    onCanceled?: () => void;
  }) => {
    const { prevPids, onSuccess, onCanceled } = args;
    setGuardCode('');
    setOpenGuardCodeDialog(true);
    const guardCode = await waitValue(ref.current, 'guardCode');
    if (guardCode !== 'CANCELED') {
      onSuccess?.({ guardCode, prevPids });
    } else if (guardCode === 'CANCELED') {
      prevPids && steamCli.killPids(prevPids);
      onCanceled?.();
    }
    setOpenGuardCodeDialog(false);
  };

  const loginCredentialsAreValid = async (spawnArgs?: SpawnProcessArgs) => {
    const credentials = getState();
    if (credentials === undefined) return false;
    await login(credentials, spawnArgs);
    return true;
  };

  const askSteamCredentials = async (spawnArgs?: SpawnProcessArgs) => {
    if (await loginCredentialsAreValid(spawnArgs)) return;

    setSteamCredentials(undefined);
    setOpenSteamCredentialsDialog(true);

    const steamCredentials = await waitValue(ref.current, 'steamCredentials');

    if (steamCredentials && steamCredentials !== EventName.Cancelled) {
      setState({ ...getState(), ...steamCredentials });
      await login(steamCredentials, spawnArgs);
      setOpenSteamCredentialsDialog(false);
    } else {
      setOpenSteamCredentialsDialog(false);
      throw Error(t('noSteamCredentialsProvided'));
    }
  };

  const downloadSteamApp: typeof steamCli.downloadSteamApp = (args, spawnArgs) => {
    return steamCli.downloadSteamApp(args, {
      onStdOut: (data) => {
        const pids = findOutputPids(data);
        if (data.includes('Steam Guard')) {
          askSteamGuardCode({
            prevPids: pids,
            onSuccess: ({ prevPids, guardCode }) => {
              steamCli.downloadSteamApp(
                { ...args, guardCode },
                {
                  ...spawnArgs,
                  onExit: (data) => {
                    spawnArgs?.onExit?.(data);
                    prevPids && steamCli.killPids(prevPids);
                  }
                }
              );
            }
          });
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
          setSteamCredentials(credentials);
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
