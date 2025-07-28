import { readFile } from 'fs';

export const readBinaryFile = async (
  _: Electron.IpcMainInvokeEvent,
  filePath: string
): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    readFile(filePath, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};
