import { app } from 'electron';

export const quitApp = async (_: Electron.IpcMainInvokeEvent) => {
  app.quit();
};
