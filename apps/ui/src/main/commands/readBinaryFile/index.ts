import { readFile } from 'fs';
import { fileExists } from '../fileExists';

export const readBinaryFile = async (
  _: Electron.IpcMainInvokeEvent,
  filePath: string
): Promise<Buffer> => {
  return new Promise(async (resolve, reject) => {
    if (await fileExists(_, filePath)) {
      readFile(filePath, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    }
  });
};
