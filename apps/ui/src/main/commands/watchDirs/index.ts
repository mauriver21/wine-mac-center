import { watch } from 'chokidar';
import { singleton } from '../../singleton';
import { ElectronApi } from '../../../types/ElectronApi';
import { v4 as uuid } from 'uuid';

export const watchDirs = (_: Electron.IpcMainInvokeEvent, dirPaths: Array<string>) => {
  for (const dirPath of dirPaths) {
    const watcher = watch(dirPath, { ignoreInitial: true, depth: 1 });
    const { mainWindow } = singleton;

    watcher
      .on('addDir', (fileDir) => {
        const id = uuid();
        mainWindow?.webContents.send(ElectronApi.SubscribeWatchDirs, {
          id,
          type: 'add',
          from: dirPath,
          fileDir
        });
      })
      .on('unlinkDir', (fileDir) => {
        const id = uuid();
        mainWindow?.webContents.send(ElectronApi.SubscribeWatchDirs, {
          id,
          type: 'unlink',
          from: dirPath,
          fileDir
        });
      });

    singleton.watchers.push(watcher);
  }
};
