import { useEffect, useMemo } from 'react';
import { Box, ContentsClass, Stack } from 'reactjs-shared-ui';
import { ExecutablesConfigModule } from '@components/ExecutablesConfigModule';
import { ChangeEngineModule } from '@components/ChangeEngineModule';
import { WinetricksModule } from '@components/WinetricksModule';
import { WineConfigModule } from '@components/WineConfigModule';
import { RegistryEditorModule } from '@components/RegistryEditorModule';
import { TaskManagerModule } from '@components/TaskManagerModule';
import { CommandLineModule } from '@components/CommandLineModule';
import { ControlPanelModule } from '@components/ControlPanelModule';
import { useDirsWatcherContext } from '@hooks/useDirsWatcherContext';
import { extractAppName } from '@utils/extractAppName';
import { useNavigateApp } from '@hooks/useNavigateApp';
import { ConfigLayout } from '@layouts/ConfigLayout';
import { useEnv } from '@hooks/useEnv';
import { AppEnvVariables } from '@components/AppEnvVariables';
import { useResolveAppName } from '@hooks/useResolveAppName';
import { WineAppProvider } from '@components/WineAppProvider';
import { UpdateAppModule } from '@components/UpdateAppModule';
import { StyleModule } from '@components/StyleModule';

const ITEM_STYLE = { px: '20px !important' };

export const AppConfig: React.FC = () => {
  const env = useEnv();
  const appName = useResolveAppName();
  const { watchDirEvent } = useDirsWatcherContext() || {};
  const { navigateToAppNotFound } = useNavigateApp();

  const modules = useMemo(
    () => [
      <WineConfigModule />,
      <RegistryEditorModule />,
      <TaskManagerModule />,
      <CommandLineModule />,
      <ControlPanelModule />,
      <UpdateAppModule />,
      <WinetricksModule />,
      <StyleModule />,
      <ExecutablesConfigModule />,
      <ChangeEngineModule />,
      ...(env.isDev ? [<AppEnvVariables />] : [])
    ],
    []
  );

  useEffect(() => {
    if (watchDirEvent === undefined || appName === undefined) return;
    const comingAppName = extractAppName(watchDirEvent.path);
    if (comingAppName !== appName) navigateToAppNotFound(appName);
  }, [watchDirEvent?.id]);

  return (
    <WineAppProvider appName={appName}>
      <ConfigLayout
        mainTitle={appName}
        contentSlot={
          <Stack
            className={ContentsClass.ScrollableArea}
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
    </WineAppProvider>
  );
};
