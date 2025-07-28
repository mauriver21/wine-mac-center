import { createContext } from 'react';
import { WatchDirEvent } from '@interfaces/WatchDirEvent';

export const DirsWatcherContext = createContext<{
  watchDirEvent: WatchDirEvent | undefined;
} | null>(null);
