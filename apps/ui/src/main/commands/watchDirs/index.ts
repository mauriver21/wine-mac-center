import { watch } from 'chokidar';
import { singleton } from '../../singleton';
import { ElectronApi } from '../../../types/ElectronApi';
import { v4 as uuid } from 'uuid';

export const watchDirs = (_: Electron.IpcMainInvokeEvent, dirPaths: Array<string>) => {
  for (const dirPath of dirPaths) {
    const watcher = watch(dirPath, { ignoreInitial: true, depth: 0 });
    const { mainWindow } = singleton;

    watcher
      .on('addDir', (path) => {
        const id = uuid();
        mainWindow?.webContents.send(ElectronApi.SubscribeWatchDirs, {
          id,
          type: 'addDir',
          from: dirPath,
          path
        });
      })
      .on('unlinkDir', (path) => {
        const id = uuid();
        mainWindow?.webContents.send(ElectronApi.SubscribeWatchDirs, {
          id,
          type: 'unlinkDir',
          from: dirPath,
          path
        });
      })
      .on('add', (path) => {
        const id = uuid();
        mainWindow?.webContents.send(ElectronApi.SubscribeWatchDirs, {
          id,
          type: 'add',
          from: dirPath,
          path
        });
      })
      .on('unlink', (path) => {
        const id = uuid();
        mainWindow?.webContents.send(ElectronApi.SubscribeWatchDirs, {
          id,
          type: 'unlink',
          from: dirPath,
          path
        });
      });

    singleton.watchers.push(watcher);
  }
};
