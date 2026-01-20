import { exec as nodeExec } from 'child_process';

export const exec = async (_: Electron.IpcMainInvokeEvent, cmd: string) => {
  return new Promise<{ stdOut: string; stdErr: string }>((resolve, reject) => {
    nodeExec(cmd, (error, stdOut, stdErr) => {
      if (error) {
        reject(error);
      } else {
        resolve({ stdOut, stdErr });
      }
    });
  });
};
