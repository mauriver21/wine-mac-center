import { watch } from 'chokidar';
import { singleton } from '../../singleton';
import { ElectronApi } from '../../types/ElectronApi';

export const watchDirs = (_: Electron.IpcMainInvokeEvent, dirPaths: Array<string>) => {
  for (const dirPath of dirPaths) {
    const watcher = watch(dirPath, { ignoreInitial: true });
    const { mainWindow } = singleton;

    watcher
      .on('add', (filePath) => {
        mainWindow?.webContents.send(ElectronApi.FolderChange, { type: 'add', filePath });
      })
      .on('unlink', (filePath) => {
        mainWindow?.webContents.send(ElectronApi.FolderChange, { type: 'unlink', filePath });
      });

    singleton.watchers.push(watcher);
  }
};
