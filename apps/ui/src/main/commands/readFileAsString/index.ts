import { promises as fs } from 'fs';

export const readFileAsString = async (
  _: Electron.IpcMainInvokeEvent,
  filePath: string
): Promise<string> => {
  try {
    return fs.readFile(filePath, 'utf-8');
  } catch (error) {
    throw error;
  }
};
