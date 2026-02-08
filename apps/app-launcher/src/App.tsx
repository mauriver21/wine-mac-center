import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { App as Launcher } from 'ui/app-launcher';
import { onAppClose } from '@utils/onAppClose';
import { quitApp } from '@utils/quitApp';

export const App = () => {
  const navigate = useNavigate();

  useEffect(() => {
    import.meta.env.PROD && navigate('/');
  }, []);

  return (
    <Launcher
      onInitialized={({ wineApp, runExe }) => {
        const { runMainExeOnStartup, quitAppWhenLauncherIsClosed } =
          wineApp.getAppConfig().launcherConfig || {};

        if (runMainExeOnStartup) {
          runExe();
        }

        if (quitAppWhenLauncherIsClosed) {
          onAppClose(quitApp);
        }
      }}
    />
  );
};
