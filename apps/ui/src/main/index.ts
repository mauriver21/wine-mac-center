import { join } from 'path';
import { app, shell, BrowserWindow, ipcMain, globalShortcut } from 'electron';
import { electronApp, optimizer, is } from '@electron-toolkit/utils';
import { ElectronApi } from '../types/ElectronApi';
import { singleton } from './singleton';
import {
  buildPlist,
  createDirectory,
  dirExists,
  exec,
  fileExists,
  getAppPath,
  pathJoin,
  readBinaryFile,
  readDirectory,
  removeDirectory,
  readFileAsString,
  showOpenDialog,
  spawn,
  unwatchDirs,
  watchDirs,
  writeBinaryFile,
  writeFile
} from './commands';
import icon from '../../resources/icon.png?asset';

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

let isQuitting = false;

function createWindow(): void {
  singleton.mainWindow = new BrowserWindow({
    width: 1170,
    height: 768,
    minWidth: 1170,
    minHeight: 768,
    show: false,
    autoHideMenuBar: true,
    title: 'Wine Mac Center',
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      devTools: process.env.VITE_APP_ENV === 'development',
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

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window);
  });

  // IPC test
  ipcMain.on('ping', () => console.log('pong'));

  createWindow();

  app.on('did-become-active', () => {
    if (!singleton.becameActive) {
      mainWindow?.webContents.closeDevTools();
      singleton.becameActive = true;
    }
  });

  app.on('activate', function () {
    mainWindow?.show();
  });

  globalShortcut.register('Cmd+Alt+I', () => {
    mainWindow?.webContents?.toggleDevTools();
  });

  const { mainWindow } = singleton;
  mainWindow?.on('close', (event) => {
    if (!isQuitting) {
      event.preventDefault();

      if (mainWindow?.isFullScreen()) {
        mainWindow.setFullScreen(false);
      }

      if (mainWindow?.isMaximized()) {
        mainWindow.unmaximize();
      }

      mainWindow?.hide();
    }
  });
});

app.on('before-quit', () => {
  isQuitting = true;
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
