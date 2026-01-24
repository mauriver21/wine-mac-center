import React, { useState } from 'react';
import { Body1, Box, Icon, Stack } from 'reactjs-shared-ui';
import { Button } from '@components/Button';
import { useNavigateApp } from '@app-launcher/hooks/useNavigateApp';
import { useWineAppContext } from '@hooks/useWineAppContext';
import { PlayCircle } from '@mui/icons-material';
import { Cog6ToothIcon } from '@heroicons/react/24/solid';

export const LauncherMenu: React.FC = () => {
  const wineAppContext = useWineAppContext();
  const [runningMainExe, setRunningMainExe] = useState(false);
  const { urls, wineApp } = wineAppContext || {};
  const { navigateToLauncherConfig } = useNavigateApp();

  const runExe = async () => {
    setRunningMainExe(true);
    await wineApp?.runMainExe();
    setRunningMainExe(false);
  };

  return (
    <Box
      sx={{
        backgroundImage: urls?.launcherImgURL
          ? `
                linear-gradient(
                  rgba(0, 0, 0, 0.4),
                  rgba(0, 0, 0, 0.4)
                ),
                url(${urls?.launcherImgURL})
              `
          : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <Stack spacing={2} position="absolute" top={30} right={30}>
        <Button
          title="Launcher Configuration"
          sx={{ p: 0.5, minWidth: 0, borderRadius: 4 }}
          onClick={navigateToLauncherConfig}
        >
          <Icon color="text.secondary" render={Cog6ToothIcon} />
        </Button>
      </Stack>
      <Stack spacing={2} position="absolute" bottom={30} right={30}>
        <Button
          sx={{ alignItems: 'center', gap: 1, p: 1 }}
          disabled={runningMainExe}
          onClick={runExe}
        >
          <Icon color="text.secondary" render={PlayCircle} />{' '}
          <Body1 fontWeight={500}>Start Game</Body1>
        </Button>
      </Stack>
    </Box>
  );
};
