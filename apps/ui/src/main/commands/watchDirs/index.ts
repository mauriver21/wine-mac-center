import { watch } from 'chokidar';
import { singleton } from '../../singleton';
import { ElectronApi } from '../../../types/ElectronApi';
import { v4 as uuid } from 'uuid';

export const watchDirs = (_: Electron.IpcMainInvokeEvent, dirPaths: Array<string>) => {
  for (const dirPath of dirPaths) {
    const watcher = watch(dirPath, { ignoreInitial: true, depth: 0 });
    const { mainWindow } = singleton;

    watcher
      .on('addDir', (dirPath) => {
        const id = uuid();
        mainWindow?.webContents.send(ElectronApi.SubscribeWatchDirs, {
          id,
          type: 'add',
          from: dirPath,
          dirPath
        });
      })
      .on('unlinkDir', (dirPath) => {
        const id = uuid();
        mainWindow?.webContents.send(ElectronApi.SubscribeWatchDirs, {
          id,
          type: 'unlink',
          from: dirPath,
          dirPath
        });
      });

    singleton.watchers.push(watcher);
  }
};
