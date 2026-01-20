import plist from 'plist';

export const buildPlist = (
  _: Electron.IpcMainInvokeEvent,
  ...args: Parameters<typeof plist.build>
) => plist.build(...args);
