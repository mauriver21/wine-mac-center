import { app } from 'electron';
import { exec } from '../exec';

export const quitApp = (
  _: Electron.IpcMainInvokeEvent,
  callbackCmd: string = '',
) => {
  app.quit();
  callbackCmd && exec(_, callbackCmd);
};
