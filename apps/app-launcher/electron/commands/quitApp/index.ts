import { app } from 'electron';
import { exec } from '../exec';

export const quitApp = async (
  _: Electron.IpcMainInvokeEvent,
  callbackCmd: string = '',
) => {
  try {
    if (callbackCmd) {
      await exec(_, callbackCmd);
    }
  } catch (error) {
    console.error(error);
  } finally {
    app.quit();
  }
};
