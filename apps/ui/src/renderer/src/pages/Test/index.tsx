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
import { Stack } from 'reactjs-shared-ui';

export const WineAppContext = createContext<{
  wineApp: WineApp;
  setWineApp: Dispatch<SetStateAction<WineApp>>;
}>({} as any);

export const useWineAppContext = () => useContext(WineAppContext);

export const Test: React.FC = () => {
  const [wineApp, setWineApp] = useState<WineApp>(null as any);

  return (
    <Stack p={2} height="1200px" overflow="auto">
      <WineAppContext.Provider value={{ wineApp, setWineApp }}>
        {wineApp ? (
          <Stack spacing={1}>
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
          </Stack>
        ) : (
          <InitApp />
        )}
      </WineAppContext.Provider>
    </Stack>
  );
};
