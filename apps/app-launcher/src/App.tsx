import { useEffect, useLayoutEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { App as Launcher } from 'ui/app-launcher';
import { addAppEventListener } from '@utils/addAppEventListener';
import { removeAppEventListener } from '@utils/removeAppEventListener';
import { useEnv, WineApp } from 'ui/public-api';
import { ElectronApi } from 'electron/types';
import { quitApp as baseQuitApp } from '@utils/quitApp';
import { setWindowTitle } from '@utils/setWindowTitle';

export const App = () => {
  const ref = useRef<{ quitAppListenerId: string; wineApp?: WineApp }>({
    quitAppListenerId: '',
  });
  const navigate = useNavigate();
  const env = useEnv();
  const { SCRIPTS_PATH } = env.get();

  const quitApp = () => {
    const WINE_APP_PREFIX_PATH =
      ref.current.wineApp?.getWineEnv().WINE_APP_PREFIX_PATH || '';
    baseQuitApp(
      `"${SCRIPTS_PATH}/killWineProcesses.sh" "${WINE_APP_PREFIX_PATH}"`,
    );
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

  return (
    <Launcher
      onInitialized={({ wineApp, runExe }) => {
        ref.current.wineApp = wineApp;
        const { runMainExeOnStartup, quitAppWhenLauncherIsClosed = false } =
          wineApp.getAppConfig().launcherConfig || {};

        if (runMainExeOnStartup) {
          runExe();
        }

        onQuitAppWhenLauncherIsClosed(quitAppWhenLauncherIsClosed);
      }}
      onUpdateAppLauncherConfig={({ wineApp }) => {
        const { quitAppWhenLauncherIsClosed = false } =
          wineApp.getAppConfig().launcherConfig || {};

        onQuitAppWhenLauncherIsClosed(quitAppWhenLauncherIsClosed);
      }}
    />
  );
};
