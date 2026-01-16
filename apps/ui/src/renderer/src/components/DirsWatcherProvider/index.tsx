import { WINE_APPS_PATH, WINE_ENGINES_PATH } from '@constants/paths';
import { DirsWatcherContext } from '@contexts/DirsWatcherContext';
import { WatchDirEvent } from '@interfaces/WatchDirEvent';
import { useWineEngineModel } from '@models/useWineEngineModel';
import { useWineInstalledAppModel } from '@models/useWineInstalledAppModel';
import { createDirsWatcher } from '@utils/createDirsWatcher';
import { useEnv } from '@hooks/useEnv';
import React, { useEffect, useMemo, useRef, useState } from 'react';

export interface DirsWatcherProviderProps {
  children?: React.ReactNode;
}

export const DirsWatcherProvider: React.FC<DirsWatcherProviderProps> = ({ children }) => {
  const store = useRef({ listenerId: '' });
  const env = useEnv();
  const wineInstalledAppModel = useWineInstalledAppModel();
  const wineEngineModel = useWineEngineModel();
  const [watchDirEvent, setWatchDirEvent] = useState<WatchDirEvent>();
  const dirsWatcher = useMemo(() => {
    return createDirsWatcher();
  }, []);

  useEffect(() => {
    const ENV = env.get();
    dirsWatcher.watchDirs([ENV.WINE_APPS_PATH, ENV.WINE_ENGINES_PATH]);
    dirsWatcher.subscribeToWatchDirs((event) => {
      setWatchDirEvent(event);
      store.current.listenerId = event.listenerId;
    });

    return () => {
      dirsWatcher.unsubscribeFromWatchDirs(store.current.listenerId);
      dirsWatcher.unwatchDirs();
    };
  }, []);

  useEffect(() => {
    if (watchDirEvent?.from?.match(WINE_APPS_PATH)) {
      wineInstalledAppModel.listAll();
    }

    if (watchDirEvent?.from?.match(WINE_ENGINES_PATH)) {
      wineEngineModel.list();
    }

    setWatchDirEvent(undefined);
  }, [watchDirEvent?.id]);

  return (
    <DirsWatcherContext.Provider value={{ watchDirEvent }}>{children}</DirsWatcherContext.Provider>
  );
};
