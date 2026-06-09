import React from 'react';
import { Box, Icon, Stack } from 'reactjs-shared-ui';
import { useWineAppContext } from '@hooks/useWineAppContext';
import LauncherBg from '@app-launcher/assets/imgs/launcher-bg.png';
import { useI18n } from 'reactjs-shared-ui/i18next';
import { Cog6ToothIcon, Squares2X2Icon } from '@heroicons/react/24/solid';
import { useNavigateApp } from '@app-launcher/hooks/useNavigateApp';
import { Button } from '@components/Button';

export const Executables: React.FC = () => {
  const { urls, wineApp } = useWineAppContext();
  const { navigateToLauncherConfig, navigateToExecutables } = useNavigateApp();
  const { t } = useI18n();
  const appConfig = wineApp?.getAppConfig();
  const executables = appConfig?.executables;
  const backgroundImage = urls?.launcherImgURL || LauncherBg;

  return (
    <Box
      sx={{
        backgroundImage: `
                linear-gradient(
                  rgba(0, 0, 0, 0.4),
                  rgba(0, 0, 0, 0.4)
                ),
                url(${backgroundImage})
              `,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <Stack spacing={2} position="absolute" justifyContent="flex-end" top={30} right={30}>
        <Button
          title={t('launcherConfig')}
          sx={{ p: 0.5, minWidth: 0, borderRadius: 4 }}
          onClick={navigateToLauncherConfig}
        >
          <Icon color="text.secondary" render={Cog6ToothIcon} />
        </Button>
        <Button
          title={t('executables')}
          sx={{ p: 0.5, minWidth: 0, borderRadius: 4 }}
          onClick={navigateToExecutables}
        >
          <Icon color="text.secondary" render={Squares2X2Icon} />
        </Button>
      </Stack>
    </Box>
  );
};
