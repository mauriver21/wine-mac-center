import { mkdirSync, writeFileSync } from 'fs';
import path from 'path';

export const writeBinaryFile = async (
  _: Electron.IpcMainInvokeEvent,
  filePath: string,
  arrayBuffer: ArrayBuffer
) => {
  const buffer = Buffer.from(arrayBuffer);
  const dirPath = path.dirname(filePath);
  dirPath && mkdirSync(dirPath, { recursive: true });
  writeFileSync(filePath, buffer);
};
