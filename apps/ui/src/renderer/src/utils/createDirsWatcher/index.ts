import { subscribeToWatchDirs } from '@utils/subscribeToWatchDirs';
import { unsubscribeFromWatchDirs } from '@utils/unsubscribeFromWatchDirs';
import { unwatchDirs } from '@utils/unwatchDirs';
import { watchDirs } from '@utils/watchDirs';

export const createDirsWatcher = () => {
  return {
    watchDirs,
    unwatchDirs,
    subscribeToWatchDirs,
    unsubscribeFromWatchDirs
  };
};
