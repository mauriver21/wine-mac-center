import { shell } from 'electron';

export const showItemInFolder = async (
  _: Electron.IpcMainInvokeEvent,
  ...args: Parameters<typeof shell.showItemInFolder>
) => shell.showItemInFolder(...args);
