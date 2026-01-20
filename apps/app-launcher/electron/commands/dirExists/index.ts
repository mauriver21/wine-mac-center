import { existsSync } from 'fs';

export const dirExists = async (_: Electron.IpcMainInvokeEvent, dirPath: string) =>
  existsSync(dirPath);
