import { WineAppContext } from '@contexts/WineAppContext';
import { SpawnProcessArgs } from '@interfaces/SpawnProcessArgs';
import { WineApp } from '@interfaces/WineApp';
import { useAppModel } from '@models/useAppModel';
import { createWineApp } from '@utils/createWineApp';
import { getAppArtwork } from '@utils/getAppArtwork';
import { getAppIcon } from '@utils/getAppIcon';
import { getAppLauncherImg } from '@utils/getAppLauncherImg';
import { useRefresh } from '@utils/useRefresh';
import React, { useEffect, useState } from 'react';

export interface WineAppProviderProps {
  children?: React.ReactNode;
  appName?: string;
  onInitialized?: (context: {
    wineApp: WineApp;
    runExe: (processArgs?: SpawnProcessArgs | undefined) => Promise<void>;
  }) => void;
  onUpdateAppLauncherConfig?: (context: { wineApp: WineApp }) => void;
}

export const WineAppProvider: React.FC<WineAppProviderProps> = ({
  children,
  appName,
  onInitialized,
  onUpdateAppLauncherConfig
}) => {
  const [runningMainExe, setRunningMainExe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [wineApp, setWineApp] = useState<WineApp>();
  const [urls, setUrls] = useState({ artworkURL: '', iconURL: '', launcherImgURL: '' });
  const { signal, refresh } = useRefresh();
  const appModel = useAppModel();

  const runExe = async (processArgs?: SpawnProcessArgs | undefined) => {
    setRunningMainExe(true);
    await wineApp?.runMainExe(processArgs);
    setRunningMainExe(false);
  };

  const initWineApp = async () => {
    try {
      setLoading(true);
      if (appName === undefined) throw new Error('Missing application name');
      const wineApp = await createWineApp(appName);
      const WINE_APP_PATH = wineApp.getWineEnv().WINE_APP_PATH;
      const [artworkURL, iconURL, launcherImgURL] = await Promise.all([
        getAppArtwork(WINE_APP_PATH),
        getAppIcon(WINE_APP_PATH),
        getAppLauncherImg(WINE_APP_PATH)
      ]);
      setWineApp(wineApp);
      setUrls({
        artworkURL,
        iconURL,
        launcherImgURL
      });
    } catch (error) {
      appModel.dispatchError(error);
    } finally {
      setLoading(false);
    }
  };

  const updateAppLauncherConfig: WineApp['updateAppLauncherConfig'] = async (...params) => {
    await wineApp?.updateAppLauncherConfig(...params);
    wineApp && onUpdateAppLauncherConfig?.({ wineApp });
  };

  useEffect(() => {
    initWineApp();
  }, [appName]);

  useEffect(() => {
    wineApp && onInitialized?.({ wineApp, runExe });
  }, [wineApp]);

  return (
    <WineAppContext.Provider
      value={{
        loading,
        setLoading,
        refresh,
        signal,
        wineApp: wineApp ? { ...wineApp, updateAppLauncherConfig } : undefined,
        urls,
        runExe,
        runningMainExe,
        setRunningMainExe
      }}
    >
      {children}
    </WineAppContext.Provider>
  );
};
