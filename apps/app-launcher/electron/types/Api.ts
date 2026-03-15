import plist from 'plist';
import { dialog } from 'electron';
import { MakeDirectoryOptions, PathOrFileDescriptor, RmDirOptions } from 'fs';
import { WatchDirEvent } from './WatchDirEvent';
import { ElectronApi } from './ElectronApi';

export type Api = {
  getAppPath: () => Promise<string>;
  execCommand: (cmd: string) => Promise<{
    stdOut: string;
    stdErr: string;
  }>;
  pathJoin: (...paths: string[]) => Promise<string>;
  spawnProcess: (
    command: string,
    action?: { type: string; data: string },
  ) => Promise<{ pid: number }>;
  fileExists: (path: string) => Promise<boolean>;
  writeFile: (file: PathOrFileDescriptor, data: string) => void;
  readDirectory: (dirPath: string) => Promise<string[]>;
  dirExists: (dirPath: string) => Promise<boolean>;
  readBinaryFile: (filePath: string) => Promise<Buffer>;
  createDirectory: (
    dirPath: string,
    options?: MakeDirectoryOptions,
  ) => Promise<void>;
  removeDirectory: (dirPath: string, options?: RmDirOptions) => Promise<void>;
  readFileAsString: (filePath: string) => Promise<string>;
  writeBinaryFile: (
    filePath: string,
    arrayBuffer: ArrayBuffer,
  ) => Promise<void>;
  showOpenDialog: typeof dialog.showOpenDialog;
  onStdOut: (callback: (data: string) => void) => void;
  onStdErr: (callback: (data: string) => void) => void;
  onExit: (callback: (code: number) => void) => void;
  watchDirs: (dirPaths: Array<string>) => void;
  unwatchDirs: () => Promise<void>;
  subscribeToWatchDirs: (callback: (event: WatchDirEvent) => void) => void;
  unsubscribeFromWatchDirs: (listenerId: string) => void;
  buildPlist: (obj: plist.PlistValue) => Promise<string>;
  showItemInFolder: (fullPath: string) => Promise<void>;
  renameDirectory: (from: string, to: string) => Promise<void>;
  quitApp: (callbackCmd?: string) => Promise<void>;
  addEventListener: (
    eventName: ElectronApi.OnAppClose,
    callback: () => void,
  ) => string;
  removeEventListener: (
    eventName: ElectronApi.OnAppClose,
    listenerId: string,
  ) => void;
  setWindowTitle: (title: string) => void;
};
