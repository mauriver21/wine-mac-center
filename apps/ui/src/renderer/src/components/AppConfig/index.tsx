import { useEffect, useMemo, useState } from 'react';
import { Box, ContentsClass, Stack } from 'reactjs-shared-ui';
import { WineApp } from '@interfaces/WineApp';
import { useParams } from 'react-router-dom';
import { createWineApp } from '@utils/createWineApp';
import { useRefresh } from '@utils/useRefresh';
import { ExecutableConfigModule } from '@components/ExecutableConfigModule';
import { AppConfigContext } from '@contexts/AppConfigContext';
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

const ITEM_STYLE = { px: '20px !important' };

export const AppConfig: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [wineApp, setWineApp] = useState<WineApp>();
  const { appName } = useParams();
  const { signal, refresh } = useRefresh();
  const { watchDirEvent } = useDirsWatcherContext() || {};
  const { navigateToAppNotFound } = useNavigateApp();

  const modules = useMemo(
    () => [
      <WineConfigModule />,
      <RegistryEditorModule />,
      <TaskManagerModule />,
      <CommandLineModule />,
      <ControlPanelModule />,
      <WinetricksModule />,
      <ExecutableConfigModule appName={appName} />,
      <ChangeEngineModule />
    ],
    []
  );

  const initWineApp = async () => {
    appName && setWineApp(await createWineApp(appName));
  };

  useEffect(() => {
    initWineApp();
  }, [appName]);

  useEffect(() => {
    if (watchDirEvent === undefined || appName === undefined) return;
    const comingAppName = extractAppName(watchDirEvent.path);
    if (comingAppName !== appName) navigateToAppNotFound(appName);
  }, [watchDirEvent?.id]);

  return (
    <AppConfigContext.Provider value={{ loading, setLoading, refresh, signal, wineApp }}>
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
    </AppConfigContext.Provider>
  );
};
