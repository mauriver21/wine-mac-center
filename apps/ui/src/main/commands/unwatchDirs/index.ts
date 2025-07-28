import { singleton } from '../../singleton';

export const unwatchDirs = async () => {
  for (const watcher of singleton.watchers) {
    await watcher.close();
  }

  singleton.watchers = [];
};
