import { Box, Card } from 'reactjs-shared-ui';
import { LauncherContext } from '@app-launcher/contexts/LauncherContext';
import { Outlet } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useWineAppContext } from '@hooks/useWineAppContext';

export const Launcher: React.FC = () => {
  const { wineApp, autorun } = useWineAppContext();
  const [runningMainExe, setRunningMainExe] = useState(false);
  const { launcherConfig: { runMainExeOnStartup } = {} } = wineApp?.getAppConfig() || {};

  const runExe = async () => {
    setRunningMainExe(true);
    await wineApp?.runMainExe();
    setRunningMainExe(false);
  };

  useEffect(() => {
    autorun && runMainExeOnStartup && runExe();
  }, [runMainExeOnStartup]);

  return (
    <LauncherContext.Provider value={{ runExe, runningMainExe }}>
      <Card
        variant="outlined"
        sx={{
          overflow: 'auto'
        }}
      >
        <Box
          position="relative"
          display="grid"
          width="100%"
          height="100%"
          bgcolor="background.paper"
          overflow="auto"
        >
          <Outlet />
        </Box>
      </Card>
    </LauncherContext.Provider>
  );
};
