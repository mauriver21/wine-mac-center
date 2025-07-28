import { dialog } from 'electron';
import { PathOrFileDescriptor } from 'fs';

type Api = {
  getAppPath: () => Promise<string>;
  execCommand: (cmd: string) => Promise<{
    stdOut: string;
    stdErr: string;
  }>;
  pathJoin: (...paths: string[]) => Promise<string>;
  spawnProcess: (
    command: string,
    action?: { type: string; data: string }
  ) => Promise<{ pid: number }>;
  fileExists: (path: string) => Promise<boolean>;
  writeFile: (file: PathOrFileDescriptor, data: string) => void;
  readDirectory: (dirPath: string) => Promise<string[]>;
  dirExists: (dirPath: string) => Promise<boolean>;
  readBinaryFile: (filePath: string) => Promise<Buffer>;
  createDirectory: (dirPath: string) => Promise<void>;
  readFileAsString: (filePath: string) => Promise<string>;
  writeBinaryFile: (filePath: string, arrayBuffer: ArrayBuffer) => Promise<void>;
  showOpenDialog: typeof dialog.showOpenDialog;
  onStdOut: (callback: (data: string) => void) => void;
  onStdErr: (callback: (data: string) => void) => void;
  onExit: (callback: (code: number) => void) => void;
  watchDirs: (dirPaths: Array<string>) => void;
  unwatchDirs: (_: Electron.IpcMainInvokeEvent) => Promise<void>;
};

export type RendererApi = {
  [K in keyof Api]: (...args: Parameters<Api[K]>) => ReturnType<Api[K]>;
};
