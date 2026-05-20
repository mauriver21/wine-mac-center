import React from 'react';
import { Body1, Box, H3, Icon, Stack } from 'reactjs-shared-ui';
import { Button } from '@components/Button';
import { Cog6ToothIcon } from '@heroicons/react/24/solid';
import { PlayCircle } from '@mui/icons-material';
import { useNavigateApp } from '@app-launcher/hooks/useNavigateApp';
import { useWineAppContext } from '@hooks/useWineAppContext';
import LauncherBg from '@app-launcher/assets/imgs/launcher-bg.png';
import { useResolveAppName } from '@hooks/useResolveAppName';
import { useI18n } from 'reactjs-shared-ui/i18next';

export const LauncherMenu: React.FC = () => {
  const { t } = useI18n();
  const { urls, runExe, runningMainExe } = useWineAppContext();
  const { navigateToLauncherConfig } = useNavigateApp();
  const backgroundImage = urls?.launcherImgURL || LauncherBg;
  const hasLauncherImgURL = Boolean(urls?.launcherImgURL);
  const appName = useResolveAppName();

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
      {!hasLauncherImgURL && (
        <H3 textAlign="center" p={2} pt={20} maxWidth={800} margin="auto">
          {appName}
        </H3>
      )}
      <Stack spacing={2} position="absolute" top={30} right={30}>
        <Button
          title={t('launcherConfig')}
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
          <Body1 fontWeight={500}>{t('runApplication')}</Body1>
        </Button>
      </Stack>
    </Box>
  );
};
