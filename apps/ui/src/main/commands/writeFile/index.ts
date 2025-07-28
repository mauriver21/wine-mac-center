import { PathOrFileDescriptor, writeFileSync } from 'fs';

export const writeFile = async (
  _: Electron.IpcMainInvokeEvent,
  file: PathOrFileDescriptor,
  data: string
) => writeFileSync(file, data);
