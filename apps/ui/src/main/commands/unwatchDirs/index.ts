import { singleton } from '../../singleton';

export const unwatchDirs = async (_: Electron.IpcMainInvokeEvent) => {
  for (const watcher of singleton.watchers) {
    await watcher.close();
  }

  singleton.watchers = [];
};
