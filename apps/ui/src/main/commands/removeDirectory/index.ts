import { promises as fs, RmDirOptions } from 'fs';

export const removeDirectory = async (
  _: Electron.IpcMainInvokeEvent,
  dirPath: string,
  options: RmDirOptions
) => {
  try {
    await fs.rmdir(dirPath, options);
  } catch (error) {
    console.error(`Error reading directory at ${dirPath}:`, error);
    throw error;
  }
};
