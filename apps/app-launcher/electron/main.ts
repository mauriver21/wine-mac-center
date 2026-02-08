import { app, BrowserWindow, globalShortcut, ipcMain } from 'electron';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { ElectronApi } from './types/ElectronApi';
import {
  getAppPath,
  pathJoin,
  fileExists,
  readDirectory,
  dirExists,
  readBinaryFile,
  createDirectory,
  readFileAsString,
  writeBinaryFile,
  showOpenDialog,
  watchDirs,
  unwatchDirs,
  buildPlist,
  removeDirectory,
  showItemInFolder,
  renameDirectory,
  exec,
  quitApp,
  spawn,
  writeFile,
} from './commands';
import { singleton } from './singleton';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.mjs
// │
process.env.APP_ROOT = path.join(__dirname, '..');

// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL'];
export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron');
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist');

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL
  ? path.join(process.env.APP_ROOT, 'public')
  : RENDERER_DIST;

ipcMain.handle(ElectronApi.GetAppPath, getAppPath);
ipcMain.handle(ElectronApi.ExecCommand, exec);
ipcMain.handle(ElectronApi.PathJoin, pathJoin);
ipcMain.handle(ElectronApi.SpawnProcess, spawn);
ipcMain.handle(ElectronApi.FileExists, fileExists);
ipcMain.handle(ElectronApi.WriteFile, writeFile);
ipcMain.handle(ElectronApi.ReadDirectory, readDirectory);
ipcMain.handle(ElectronApi.DirExists, dirExists);
ipcMain.handle(ElectronApi.ReadBinaryFile, readBinaryFile);
ipcMain.handle(ElectronApi.CreateDirectory, createDirectory);
ipcMain.handle(ElectronApi.ReadFileAsString, readFileAsString);
ipcMain.handle(ElectronApi.WriteBinaryFile, writeBinaryFile);
ipcMain.handle(ElectronApi.ShowOpenDialog, showOpenDialog);
ipcMain.handle(ElectronApi.WatchDirs, watchDirs);
ipcMain.handle(ElectronApi.UnwatchDirs, unwatchDirs);
ipcMain.handle(ElectronApi.BuildPlist, buildPlist);
ipcMain.handle(ElectronApi.RemoveDirectory, removeDirectory);
ipcMain.handle(ElectronApi.ShowItemInFolder, showItemInFolder);
ipcMain.handle(ElectronApi.RenameDirectory, renameDirectory);
ipcMain.handle(ElectronApi.QuitApp, quitApp);

let isQuitting = false;

const WINDOW_DIMENSIONS = {
  width: 980,
  height: 600,
};

function createWindow() {
  singleton.mainWindow = new BrowserWindow({
    width: WINDOW_DIMENSIONS.width,
    height: WINDOW_DIMENSIONS.height,
    minWidth: WINDOW_DIMENSIONS.width,
    minHeight: WINDOW_DIMENSIONS.height,
    maxWidth: WINDOW_DIMENSIONS.width,
    maxHeight: WINDOW_DIMENSIONS.height,
    icon: path.join(process.env.VITE_PUBLIC || '', 'electron-vite.svg'),
    webPreferences: {
      devTools: true,
      preload: path.join(__dirname, 'preload.mjs'),
      sandbox: false,
      nodeIntegration: true,
      contextIsolation: true,
      webSecurity: false,
    },
  });

  const { mainWindow: win } = singleton;

  win.webContents.openDevTools();

  // Test active push message to Renderer-process.
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', new Date().toLocaleString());
  });

  app.on('did-become-active', () => {
    if (!singleton.becameActive) {
      win?.webContents.closeDevTools();
      singleton.becameActive = true;
    }
  });

  app.on('activate', function () {
    win?.show();
  });

  globalShortcut.register('Cmd+Alt+I', () => {
    win.webContents.toggleDevTools();
  });

  win?.on('close', (event) => {
    win?.webContents.send(ElectronApi.OnAppClose);

    if (!isQuitting) {
      event.preventDefault();

      if (win?.isFullScreen()) {
        win.setFullScreen(false);
      }

      if (win?.isMaximized()) {
        win.unmaximize();
      }

      win?.hide();
    }
  });

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    // win.loadFile('dist/index.html')
    win.loadFile(path.join(RENDERER_DIST, 'index.html'));
  }
}

app.on('before-quit', () => {
  isQuitting = true;
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
    singleton.mainWindow = null;
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.whenReady().then(createWindow);
