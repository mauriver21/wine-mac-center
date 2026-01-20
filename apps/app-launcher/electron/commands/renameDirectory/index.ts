import { promises as fs } from 'fs';

export const renameDirectory = async (_: Electron.IpcMainInvokeEvent, from: string, to: string) => {
  try {
    await fs.rename(from, to);
  } catch (error) {
    console.error(`Error moving directory:`, error);
    throw error;
  }
};
