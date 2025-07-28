import { dialog } from 'electron';

export const showOpenDialog = async (
  _: Electron.IpcMainInvokeEvent,
  ...args: Parameters<typeof dialog.showOpenDialog>
) => dialog.showOpenDialog(...args);
