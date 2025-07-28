import { watch } from 'chokidar';
import { singleton } from '../../singleton';
import { ElectronApi } from '../../../types/ElectronApi';

export const watchDirs = (_: Electron.IpcMainInvokeEvent, dirPaths: Array<string>) => {
  for (const dirPath of dirPaths) {
    const watcher = watch(dirPath, { ignoreInitial: true, depth: 1 });
    const { mainWindow } = singleton;

    watcher
      .on('addDir', (fileDir) => {
        mainWindow?.webContents.send(ElectronApi.SubscribeWatchDirs, {
          type: 'add',
          from: dirPath,
          fileDir
        });
      })
      .on('unlinkDir', (fileDir) => {
        mainWindow?.webContents.send(ElectronApi.SubscribeWatchDirs, {
          type: 'unlink',
          from: dirPath,
          fileDir
        });
      });

    singleton.watchers.push(watcher);
  }
};
