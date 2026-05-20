import { Box, ContentsClass, Stack } from 'reactjs-shared-ui';
import { ConfigLayout } from '@layouts/ConfigLayout';
import { useMemo } from 'react';
import { LauncherConfigItem } from '@app-launcher/components/LauncherConfigItem';
import { TravelExplore } from '@mui/icons-material';
import { Cog8ToothIcon } from '@heroicons/react/24/solid';
import { useNavigateApp } from '@app-launcher/hooks/useNavigateApp';
import { LauncherSettings } from '@components/LauncherSettings';
import { useI18n } from 'reactjs-shared-ui/i18next';

const ITEM_STYLE = { px: '20px !important' };

export const LauncherConfig: React.FC = () => {
  const { t } = useI18n();
  const { navigateToAppConfig, navigateToEnvPath } = useNavigateApp();

  const modules = useMemo(
    () => [
      <LauncherSettings />,
      <LauncherConfigItem
        label={t('appConfiguration')}
        icon={Cog8ToothIcon}
        method={navigateToAppConfig}
      />,
      <LauncherConfigItem
        label={t('envVariables')}
        icon={TravelExplore}
        method={navigateToEnvPath}
      />
    ],
    []
  );

  return (
    <ConfigLayout
      mainTitle="Launcher Config"
      contentSlot={
        <Stack
          spacing={1}
          sx={{
            overflowX: 'hidden !important'
          }}
          pb={2}
          alignItems="center"
        >
          {modules.map((item, index) => (
            <Box
              width="100%"
              maxWidth={800}
              key={index}
              pt={2}
              sx={ITEM_STYLE}
              className={ContentsClass.Item}
            >
              {item}
            </Box>
          ))}
        </Stack>
      }
    />
  );
};
