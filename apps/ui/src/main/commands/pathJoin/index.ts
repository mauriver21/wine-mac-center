import path from 'path';

export const pathJoin = (_: Electron.IpcMainInvokeEvent, ...paths: string[]) => path.join(...paths);
