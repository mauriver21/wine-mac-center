import { promises as fs } from 'fs';

export const createDirectory = async (_: Electron.IpcMainInvokeEvent, dirPath: string) => {
  try {
    await fs.mkdir(dirPath);
  } catch (error) {
    console.error(`Error reading directory at ${dirPath}:`, error);
    throw error;
  }
};
