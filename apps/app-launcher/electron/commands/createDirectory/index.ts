import { promises as fs, MakeDirectoryOptions } from 'fs';

export const createDirectory = async (
  _: Electron.IpcMainInvokeEvent,
  dirPath: string,
  options: MakeDirectoryOptions
) => {
  try {
    await fs.mkdir(dirPath, options);
  } catch (error) {
    console.error(`Error reading directory at ${dirPath}:`, error);
    throw error;
  }
};
