import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { App as Launcher } from 'ui/app-launcher';
import { addAppEventListener } from '@utils/addAppEventListener';
import { removeAppEventListener } from '@utils/removeAppEventListener';
import { useEnv } from 'ui/public-api';
import { ElectronApi } from 'electron/types';
import { quitApp as baseQuitApp } from '@utils/quitApp';

export const App = () => {
  const ref = useRef({ quitAppListenerId: '' });
  const navigate = useNavigate();
  const env = useEnv();
  const { SCRIPTS_PATH } = env.get();

  const quitApp = () => {
    baseQuitApp(`${SCRIPTS_PATH}/killWineProcesses.sh`);
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

  useEffect(() => {
    import.meta.env.PROD && navigate('/');
  }, []);

  return (
    <Launcher
      onInitialized={({ wineApp, runExe }) => {
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
