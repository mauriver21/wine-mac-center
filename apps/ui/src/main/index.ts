import path, { join } from 'path';
// @ts-ignore
import icon from '../../resources/icon.png?asset';
import { app, shell, BrowserWindow, ipcMain } from 'electron';
import { electronApp, optimizer, is } from '@electron-toolkit/utils';
import {
  promises as fs,
  existsSync,
  readFile,
  writeFileSync,
  mkdirSync,
  PathOrFileDescriptor
} from 'fs';
// @ts-ignore (renderer type)
import { SpawnProcessArgs, UpdateProcess } from '../renderer/src/interfaces';
// @ts-ignore
import { ElectronApi } from './types/ElectronApi';
import { dialog } from 'electron';
import { getAppPath, exec, pathJoin, spawn } from './commands';
import { singleton } from './singleton';

ipcMain.handle(ElectronApi.GetAppPath, getAppPath);
ipcMain.handle(ElectronApi.ExecCommand, exec);
ipcMain.handle(ElectronApi.PathJoin, pathJoin);
ipcMain.handle(ElectronApi.SpawnProcess, spawn);

ipcMain.handle(ElectronApi.FileExists, async (_, filePath: string) => {
  try {
    const fullPath = path.resolve(filePath);
    await fs.access(fullPath);
    return true;
  } catch {
    return false;
  }
});

ipcMain.handle(ElectronApi.WriteFile, async (_, file: PathOrFileDescriptor, data: string) =>
  writeFileSync(file, data)
);

ipcMain.handle(ElectronApi.ReadDirectory, async (_, dirPath: string) => {
  try {
    const entries = await fs.readdir(dirPath);
    return entries;
  } catch (error) {
    console.error(`Error reading directory at ${dirPath}:`, error);
    throw error;
  }
});

ipcMain.handle(ElectronApi.DirExists, async (_, dirPath: string) => existsSync(dirPath));
ipcMain.handle(ElectronApi.ReadBinaryFile, async (_, filePath: string): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    readFile(filePath, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
});

ipcMain.handle(ElectronApi.CreateDirectory, async (_, dirPath: string) => {
  try {
    await fs.mkdir(dirPath);
  } catch (error) {
    console.error(`Error reading directory at ${dirPath}:`, error);
    throw error;
  }
});

ipcMain.handle(ElectronApi.ReadFileAsString, async (_, filePath: string): Promise<string> => {
  try {
    return fs.readFile(filePath, 'utf-8');
  } catch (error) {
    throw error;
  }
});

ipcMain.handle(
  ElectronApi.WriteBinaryFile,
  async (_, filePath: string, arrayBuffer: ArrayBuffer) => {
    const buffer = Buffer.from(arrayBuffer);
    const dirPath = path.dirname(filePath);
    dirPath && mkdirSync(dirPath, { recursive: true });
    writeFileSync(filePath, buffer);
  }
);

ipcMain.handle(
  ElectronApi.ShowOpenDialog,
  async (_, ...args: Parameters<typeof dialog.showOpenDialog>) => dialog.showOpenDialog(...args)
);

function createWindow(): void {
  singleton.mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      devTools: true,
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: false
    }
  });

  const { mainWindow } = singleton;
  mainWindow.webContents.openDevTools();
  mainWindow.on('ready-to-show', () => {
    mainWindow.show();
  });
  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url);
    return { action: 'deny' };
  });

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL']);
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'));
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron');

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window);
  });

  // IPC test
  ipcMain.on('ping', () => console.log('pong'));

  createWindow();

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
