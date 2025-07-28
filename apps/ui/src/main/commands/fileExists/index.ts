import path from 'path';
import { promises as fs } from 'fs';

export const fileExists = async (_: Electron.IpcMainInvokeEvent, filePath: string) => {
  try {
    const fullPath = path.resolve(filePath);
    await fs.access(fullPath);
    return true;
  } catch {
    return false;
  }
};
