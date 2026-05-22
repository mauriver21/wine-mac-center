import { Aria2cCli } from './Aria2cCli';
import { Box, ContentsClass, Stack } from 'reactjs-shared-ui';
import { BundleApp } from './BundleApp';
import { ConfigLayout } from '@layouts/ConfigLayout';
import { Dispatch, SetStateAction, createContext, useContext, useEffect, useState } from 'react';
import { DownloadEngine } from './DownloadEngine';
import { EnableDxvk } from './EnableDxvk';
import { Extract } from './Extract';
import { ExtractEngine } from './ExtractEngine';
import { InitApp } from './InitApp';
import { MountDiskImage } from './MountDiskImage';
import { RunExe } from './RunExe';
import { ScaffoldApp } from './ScaffoldApp';
import { SetSetupExe } from './SetSetupExe';
import { useRefresh } from '@utils/useRefresh';
import { WineApp } from '@interfaces/WineApp';
import { Wineboot } from './Wineboot';
import { WineCfg } from './WineCfg';
import { Winetrick } from './Winetrick';

export const TestContext = createContext<{
  wineApp: WineApp;
  setWineApp: Dispatch<SetStateAction<WineApp>>;
  refresh: () => void;
}>({} as any);

export const useTestContext = () => useContext(TestContext);

export const Test: React.FC = () => {
  const { signal, refresh } = useRefresh();
  const [wineApp, setWineApp] = useState<WineApp>(null as any);

  const fixedModules = [<Aria2cCli />, <InitApp />];
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
                {fixedModules.map((item, index) => (
                  <Box key={index} className={ContentsClass.Item}>
                    {item}
                  </Box>
                ))}
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
