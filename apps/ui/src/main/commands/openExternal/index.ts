import { shell } from 'electron';

export const openExternal = (
  _: Electron.IpcMainInvokeEvent,
  ...params: Parameters<typeof shell.openExternal>
) => {
  return shell.openExternal(...params);
};
