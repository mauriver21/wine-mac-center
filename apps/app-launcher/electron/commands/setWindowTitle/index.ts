import { singleton } from '../../singleton';

export const setWindowTitle = (
  _: Electron.IpcMainInvokeEvent,
  title: string,
) => {
  singleton.mainWindow?.setTitle(title);
};
