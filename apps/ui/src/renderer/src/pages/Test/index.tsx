import { ScaffoldApp } from './ScaffoldApp';
import { ExtractEngine } from './ExtractEngine';
import { Wineboot } from './Wineboot';
import { EnableDxvk } from './EnableDxvk';
import { Winetrick } from './Winetrick';
import { RunExe } from './RunExe';
import { BundleApp } from './BundleApp';
import { Dispatch, SetStateAction, createContext, useContext, useEffect, useState } from 'react';
import { WineApp } from '@interfaces/WineApp';
import { InitApp } from './InitApp';
import { WineCfg } from './WineCfg';
import { SetSetupExe } from './SetSetupExe';
import { DownloadEngine } from './DownloadEngine';
import { Box, ContentsClass, Stack } from 'reactjs-shared-ui';
import { Extract } from './Extract';
import { MountDiskImage } from './MountDiskImage';
import { ConfigLayout } from '@layouts/ConfigLayout';
import { useRefresh } from '@utils/useRefresh';

export const TestContext = createContext<{
  wineApp: WineApp;
  setWineApp: Dispatch<SetStateAction<WineApp>>;
  refresh: () => void;
}>({} as any);

export const useTestContext = () => useContext(TestContext);

export const Test: React.FC = () => {
  const { signal, refresh } = useRefresh();
  const [wineApp, setWineApp] = useState<WineApp>(null as any);
  const modules = [
    <ScaffoldApp />,
    <DownloadEngine />,
    <ExtractEngine />,
    <Wineboot />,
    <EnableDxvk />,
    <Winetrick />,
    <SetSetupExe />,
    <RunExe />,
    <BundleApp />,
    <WineCfg />,
    <Extract />,
    <MountDiskImage />
  ];

  useEffect(() => {
    refresh();
  }, [wineApp]);

  return (
    <TestContext.Provider value={{ wineApp, setWineApp, refresh }}>
      <ConfigLayout
        signal={signal}
        mainTitle="Test"
        showBack={false}
        contentSlot={
          <Stack
            overflow="auto"
            spacing={1}
            sx={{
              overflowX: 'hidden !important'
            }}
            pb={2}
            alignItems="center"
          >
            <Box pt={2} width="100%" maxWidth={800}>
              <Stack spacing={2}>
                <Box className={ContentsClass.Item}>
                  <InitApp />
                </Box>
                {wineApp ? (
                  <>
                    {modules.map((item, index) => (
                      <Box key={index} className={ContentsClass.Item}>
                        {item}
                      </Box>
                    ))}
                  </>
                ) : (
                  <></>
                )}
              </Stack>
            </Box>
          </Stack>
        }
      />
    </TestContext.Provider>
  );
};
