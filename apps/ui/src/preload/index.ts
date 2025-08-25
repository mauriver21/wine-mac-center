import { contextBridge, ipcRenderer } from 'electron';
import { electronAPI } from '@electron-toolkit/preload';
import { v4 as uuid } from 'uuid';
import { ElectronApi } from '../types/ElectronApi';
import { RendererApi } from '../types/RendererApi';
import { WatchDirEvent } from '../types';

const listeners = {};

// Custom APIs for renderer
const api: RendererApi = {
  getAppPath: () => ipcRenderer.invoke(ElectronApi.GetAppPath),
  execCommand: (...args) => ipcRenderer.invoke(ElectronApi.ExecCommand, ...args),
  pathJoin: (...args) => ipcRenderer.invoke(ElectronApi.PathJoin, ...args),
  spawnProcess: (...args) => ipcRenderer.invoke(ElectronApi.SpawnProcess, ...args),
  onStdOut: (callback: (data: string) => void) => {
    const listener = (_, data) => callback(data);
    ipcRenderer.on(ElectronApi.SpawnStdout, listener);
    const cleanupOnExit = (_: Electron.IpcRendererEvent, _exitCode: number) => {
      ipcRenderer.removeListener(ElectronApi.SpawnStdout, listener);
      ipcRenderer.removeListener(ElectronApi.SpawnExit, cleanupOnExit);
    };
    ipcRenderer.on(ElectronApi.SpawnExit, cleanupOnExit);
  },
  onStdErr: (callback: (data: string) => void) => {
    const listener = (_, data) => callback(data);
    ipcRenderer.on(ElectronApi.SpawnStderr, listener);
    const cleanupOnExit = (_: Electron.IpcRendererEvent, _exitCode: number) => {
      ipcRenderer.removeListener(ElectronApi.SpawnStderr, listener);
      ipcRenderer.removeListener(ElectronApi.SpawnExit, cleanupOnExit);
    };
    ipcRenderer.on(ElectronApi.SpawnExit, cleanupOnExit);
  },
  onExit: (callback: (code: number) => void) => {
    const listener = (_, code) => callback(code);
    ipcRenderer.on(ElectronApi.SpawnExit, listener);
    const cleanupOnExit = (_: Electron.IpcRendererEvent, _exitCode: number) => {
      ipcRenderer.removeListener(ElectronApi.SpawnExit, listener);
      ipcRenderer.removeListener(ElectronApi.SpawnExit, cleanupOnExit);
    };
    ipcRenderer.on(ElectronApi.SpawnExit, cleanupOnExit);
  },
  subscribeToWatchDirs: (callback: (event: WatchDirEvent) => void) => {
    const id = uuid();
    listeners[id] = (_, event: WatchDirEvent) => callback({ ...event, listenerId: id });
    ipcRenderer.on(ElectronApi.SubscribeWatchDirs, listeners[id]);
  },
  unsubscribeFromWatchDirs: (listenerId: string) => {
    listeners[listenerId] &&
      ipcRenderer.removeListener(ElectronApi.SubscribeWatchDirs, listeners[listenerId]);
  },
  fileExists: (...args) => ipcRenderer.invoke(ElectronApi.FileExists, ...args),
  writeFile: (...args) => ipcRenderer.invoke(ElectronApi.WriteFile, ...args),
  readDirectory: (...args) => ipcRenderer.invoke(ElectronApi.ReadDirectory, ...args),
  dirExists: (...args) => ipcRenderer.invoke(ElectronApi.DirExists, ...args),
  readBinaryFile: (...args) => ipcRenderer.invoke(ElectronApi.ReadBinaryFile, ...args),
  createDirectory: (...args) => ipcRenderer.invoke(ElectronApi.CreateDirectory, ...args),
  removeDirectory: (...args) => ipcRenderer.invoke(ElectronApi.RemoveDirectory, ...args),
  readFileAsString: (...args) => ipcRenderer.invoke(ElectronApi.ReadFileAsString, ...args),
  writeBinaryFile: (...args) => ipcRenderer.invoke(ElectronApi.WriteBinaryFile, ...args),
  showOpenDialog: (...args) => ipcRenderer.invoke(ElectronApi.ShowOpenDialog, ...args),
  watchDirs: (...args) => ipcRenderer.invoke(ElectronApi.WatchDirs, ...args),
  unwatchDirs: (...args) => ipcRenderer.invoke(ElectronApi.UnwatchDirs, ...args),
  buildPlist: (...args) => ipcRenderer.invoke(ElectronApi.BuildPlist, ...args)
};

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI);
    contextBridge.exposeInMainWorld('api', api);
  } catch (error) {
    console.error(error);
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI;
  // @ts-ignore (define in dts)
  window.api = api;
}
