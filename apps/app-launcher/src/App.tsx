import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { App as Launcher } from 'ui/app-launcher';
import { addAppEventListener } from '@utils/addAppEventListener';
import { removeAppEventListener } from '@utils/removeAppEventListener';
import { useEnv, WineApp } from 'ui/public-api';
import { ElectronApi } from 'electron/types';
import { quitApp as baseQuitApp } from '@utils/quitApp';
import { setWindowTitle } from '@utils/setWindowTitle';
import { useRefresh } from '@hooks/useRefresh';

export const App = () => {
  const ref = useRef<{ quitAppListenerId: string }>({
    quitAppListenerId: '',
  });
  const [wineApp, setWineApp] = useState<WineApp>();
  const navigate = useNavigate();
  const env = useEnv();
  const { refresh, signal } = useRefresh();
  const { quitAppWhenLauncherIsClosed = false } =
    wineApp?.getAppConfig().launcherConfig || {};

  const quitApp = async () => {
    if (quitAppWhenLauncherIsClosed) {
      try {
        await wineApp?.execScript('killWineProcesses');
      } catch (error) {
        console.error(error);
      } finally {
        baseQuitApp();
      }
    }
  };

  const onQuitAppWhenLauncherIsClosed = (flag: boolean) => {
    if (flag) {
      ref.current.quitAppListenerId = addAppEventListener(
        ElectronApi.OnAppClose,
        quitApp,
      );
    } else {
      removeAppEventListener(
        ElectronApi.OnAppClose,
        ref.current.quitAppListenerId,
      );
    }
  };

  useLayoutEffect(() => {
    setWindowTitle(env.get().APP_NAME);
  }, []);

  useEffect(() => {
    import.meta.env.PROD && navigate('/');
  }, []);

  useEffect(() => {
    onQuitAppWhenLauncherIsClosed(quitAppWhenLauncherIsClosed);
  }, [signal]);

  return (
    <Launcher
      onInitialized={({ wineApp, runExe }) => {
        setWineApp(wineApp);

        if (wineApp.getAppConfig().launcherConfig?.runMainExeOnStartup) {
          runExe();
        }

        refresh();
      }}
      onUpdateAppLauncherConfig={({ wineApp }) => {
        setWineApp(wineApp);
        refresh();
      }}
    />
  );
};
