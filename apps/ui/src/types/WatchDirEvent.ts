export type WatchDirEvent = {
  type: 'add' | 'unlink';
  from: string;
  filePath: string;
};
