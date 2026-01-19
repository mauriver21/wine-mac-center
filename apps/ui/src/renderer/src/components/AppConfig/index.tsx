import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Box,
  Button,
  ContentsArea,
  ContentsAreaHandle,
  ContentsClass,
  H6,
  Stack,
  TableOfContents
} from 'reactjs-shared-ui';
import { WineApp } from '@interfaces/WineApp';
import { useParams } from 'react-router-dom';
import { createWineApp } from '@utils/createWineApp';
import { alpha } from '@mui/material';
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

const ITEM_STYLE = { px: '20px !important' };

export const AppConfig: React.FC = () => {
  const contentsAreaRef = useRef<ContentsAreaHandle>(null);
  const [loading, setLoading] = useState(false);
  const [wineApp, setWineApp] = useState<WineApp>();
  const { appName } = useParams();
  const { signal, refresh } = useRefresh();
  const { watchDirEvent } = useDirsWatcherContext() || {};
  const { navigateToApps, navigateToAppNotFound } = useNavigateApp();

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
      <Box display="grid" overflow="auto">
        <ContentsArea
          ref={contentsAreaRef}
          style={{
            height: '100%',
            display: 'grid',
            overflow: 'auto',
            gridTemplateRows: 'auto 1fr'
          }}
        >
          <Box>
            <Box
              p={2}
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              sx={{
                boxShadow: (theme) => `inset 0 -1px ${theme.palette.secondary.main}`
              }}
            >
              <H6 color="text.secondary" fontWeight={500}>
                {appName}
              </H6>
              <Button
                sx={{ border: (theme) => `1px solid ${theme.palette.primary.dark}` }}
                disabled={loading}
                color="secondary"
                onClick={() => navigateToApps()}
              >
                Back
              </Button>
            </Box>
            <Box
              sx={{
                height: '1px',
                boxShadow: (theme) => `inset 0 1px ${theme.palette.secondary.light}`
              }}
            ></Box>
          </Box>
          <Box display="grid" gridTemplateColumns="1fr 250px" overflow="auto">
            <Box
              overflow="auto"
              display="grid"
              gridTemplateRows="1fr auto"
              sx={{
                '&::-webkit-scrollbar-thumb': {
                  backgroundColor: (theme) => alpha(theme.palette?.secondary.dark, 0.3)
                }
              }}
            >
              <Stack
                className={ContentsClass.ScrollableArea}
                overflow="auto"
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
            </Box>
            <Box borderLeft={(theme) => `1px solid ${theme.palette.secondary.light}`}>
              <TableOfContents pt={1} />
            </Box>
          </Box>
        </ContentsArea>
      </Box>
    </AppConfigContext.Provider>
  );
};
