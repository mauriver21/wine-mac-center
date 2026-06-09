import React, { useEffect } from 'react';
import LauncherBg from '@app-launcher/assets/imgs/launcher-bg.png';
import { Box, Icon, Stack } from 'reactjs-shared-ui';
import { useWineAppContext } from '@hooks/useWineAppContext';
import { useI18n } from 'reactjs-shared-ui/i18next';
import { Bars3Icon, Cog6ToothIcon } from '@heroicons/react/24/solid';
import { useNavigateApp } from '@app-launcher/hooks/useNavigateApp';
import { Button } from '@components/Button';
import { Executable } from '@components/Executable';

export const Executables: React.FC = () => {
  const { urls, wineApp, refresh } = useWineAppContext();
  const { navigateToLauncherConfig, navigateToMenu } = useNavigateApp();
  const { t } = useI18n();
  const appConfig = wineApp?.getAppConfig();
  const executables = appConfig?.executables;
  const backgroundImage = urls?.launcherImgURL || LauncherBg;

  useEffect(() => {
    wineApp?.readAppConfig().then(() => {
      refresh();
    });
  }, []);

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
        backgroundRepeat: 'no-repeat',
        overflow: 'auto',
        pl: 2,
        pt: 2
      }}
    >
      <Stack maxWidth={870} spacing={2}>
        {executables?.map((executable, index) => (
          <Executable key={index} executable={executable} />
        ))}
      </Stack>
      <Stack spacing={2} position="absolute" justifyContent="flex-end" top={30} right={30}>
        <Button
          title={t('launcherConfig')}
          sx={{ p: 0.5, minWidth: 0, borderRadius: 4 }}
          onClick={navigateToLauncherConfig}
        >
          <Icon color="text.secondary" render={Cog6ToothIcon} />
        </Button>
        <Button
          title={t('menu')}
          sx={{ p: 0.5, minWidth: 0, borderRadius: 4 }}
          onClick={navigateToMenu}
        >
          <Icon color="text.secondary" render={Bars3Icon} />
        </Button>
      </Stack>
    </Box>
  );
};
