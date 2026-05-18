import { promises as fs } from 'fs';

export const fileExists = async (_: Electron.IpcMainInvokeEvent, filePath: string) => {
  try {
    await fs.access(filePath);
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};
