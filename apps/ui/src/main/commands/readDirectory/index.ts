import { promises as fs } from 'fs';

export const readDirectory = async (_: Electron.IpcMainInvokeEvent, dirPath: string) => {
  try {
    const entries = await fs.readdir(dirPath);
    return entries;
  } catch (error) {
    console.error(`Error reading directory at ${dirPath}:`, error);
    throw error;
  }
};
