import { useNavigateApp } from '@app-launcher/hooks/useNavigateApp';
import { Button } from '@components/Button';
import { useWineAppContext } from '@hooks/useWineAppContext';
import React, { useMemo } from 'react';
import { Box, H6, Stack } from 'reactjs-shared-ui';

export const LauncherMenu: React.FC = () => {
  const wineAppContext = useWineAppContext();
  const { urls } = wineAppContext || {};
  const { navigateToAppConfig, navigateToEnvPath } = useNavigateApp();
  const menu = useMemo(
    () => [
      {
        label: 'Configurations',
        onClick: () => {
          navigateToAppConfig();
        }
      },
      {
        label: 'Environment',
        onClick: () => {
          navigateToEnvPath();
        }
      }
    ],
    []
  );

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
      <Stack spacing={2} position="absolute" top={260} right={40}>
        {menu.map((item) => (
          <Button sx={{ minWidth: 300 }} onClick={item.onClick}>
            <H6>{item.label}</H6>
          </Button>
        ))}
      </Stack>
    </Box>
  );
};
