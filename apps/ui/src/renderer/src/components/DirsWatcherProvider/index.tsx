import { DirsWatcherContext } from '@contexts/DirsWatcherContext';
import { WatchDirEvent } from '@interfaces/WatchDirEvent';
import { createDirsWatcher } from '@utils/createDirsWatcher';
import { useEnv } from '@utils/useEnv';
import React, { useEffect, useMemo, useRef, useState } from 'react';

export interface DirsWatcherProviderProps {
  children?: React.ReactNode;
}

export const DirsWatcherProvider: React.FC<DirsWatcherProviderProps> = ({ children }) => {
  const store = useRef({ listenerId: '' });
  const env = useEnv();
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

  console.log({ watchDirEvent });

  return (
    <DirsWatcherContext.Provider value={{ watchDirEvent }}>{children}</DirsWatcherContext.Provider>
  );
};
