import { contextBridge, ipcRenderer } from 'electron';
import { electronAPI } from '@electron-toolkit/preload';
// @ts-ignore (renderer type)
import { SpawnProcessArgs } from '../renderer/src/interfaces';
import { writeFile } from 'fs';
import { ElectronApi } from '../main';

export type Api = {
  getAppPath: () => Promise<string>;
  execCommand: (cmd: string) => Promise<{
    stdOut: string;
    stdErr: string;
  }>;
  pathJoin: (...paths: string[]) => Promise<string>;
  spawnProcess: (command: string, args?: SpawnProcessArgs) => Promise<void>;
  fileExists: (path: string) => Promise<boolean>;
  writeFile: typeof writeFile;
  readDirectory: (dirPath: string) => Promise<string[]>;
  dirExists: (dirPath: string) => Promise<boolean>;
  readBinaryFile: (filePath: string) => Promise<Buffer>;
  createDirectory: (dirPath: string) => Promise<void>;
  readFileAsString: (filePath: string) => Promise<string>;
  writeBinaryFile: (filePath: string, arrayBuffer: ArrayBuffer) => Promise<void>;
};

type RendererApi = Record<keyof Api, (...args: any) => Promise<any>>;

// Custom APIs for renderer
const api: RendererApi = {
  getAppPath: () => ipcRenderer.invoke(ElectronApi.GetAppPath),
  execCommand: (...args) => ipcRenderer.invoke(ElectronApi.ExecCommand, ...args),
  pathJoin: (...args) => ipcRenderer.invoke(ElectronApi.PathJoin, ...args),
  spawnProcess: (...args) => ipcRenderer.invoke(ElectronApi.SpawnProcess, ...args),
  fileExists: (...args) => ipcRenderer.invoke(ElectronApi.FileExists, ...args),
  writeFile: (...args) => ipcRenderer.invoke(ElectronApi.WriteFile, ...args),
  readDirectory: (...args) => ipcRenderer.invoke(ElectronApi.ReadDirectory, ...args),
  dirExists: (...args) => ipcRenderer.invoke(ElectronApi.DirExists, ...args),
  readBinaryFile: (...args) => ipcRenderer.invoke(ElectronApi.ReadBinaryFile, ...args),
  createDirectory: (...args) => ipcRenderer.invoke(ElectronApi.CreateDirectory, ...args),
  readFileAsString: (...args) => ipcRenderer.invoke(ElectronApi.ReadFileAsString, ...args),
  writeBinaryFile: (...args) => ipcRenderer.invoke(ElectronApi.WriteBinaryFile, ...args)
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
