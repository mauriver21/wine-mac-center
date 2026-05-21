import { ScaffoldApp } from './ScaffoldApp';
import { ExtractEngine } from './ExtractEngine';
import { Wineboot } from './Wineboot';
import { EnableDxvk } from './EnableDxvk';
import { Winetrick } from './Winetrick';
import { RunExe } from './RunExe';
import { BundleApp } from './BundleApp';
import { Dispatch, SetStateAction, createContext, useContext, useState } from 'react';
import { WineApp } from '@interfaces/WineApp';
import { InitApp } from './InitApp';
import { WineCfg } from './WineCfg';
import { SetSetupExe } from './SetSetupExe';
import { DownloadEngine } from './DownloadEngine';
import { Box, Stack } from 'reactjs-shared-ui';
import { Extract } from './Extract';
import { MountDiskImage } from './MountDiskImage';
import { ConfigLayout } from '@layouts/ConfigLayout';

export const TestContext = createContext<{
  wineApp: WineApp;
  setWineApp: Dispatch<SetStateAction<WineApp>>;
}>({} as any);

export const useTestContext = () => useContext(TestContext);

export const Test: React.FC = () => {
  const [wineApp, setWineApp] = useState<WineApp>(null as any);

  return (
    <ConfigLayout
      mainTitle="Test"
      showBack={false}
      contentSlot={
        <TestContext.Provider value={{ wineApp, setWineApp }}>
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
                <InitApp />
                {wineApp ? (
                  <>
                    <ScaffoldApp />
                    <DownloadEngine />
                    <ExtractEngine />
                    <Wineboot />
                    <EnableDxvk />
                    <Winetrick />
                    <SetSetupExe />
                    <RunExe />
                    <BundleApp />
                    <WineCfg />
                    <Extract />
                    <MountDiskImage />
                  </>
                ) : (
                  <></>
                )}
              </Stack>
            </Box>
          </Stack>
        </TestContext.Provider>
      }
    />
  );
};
