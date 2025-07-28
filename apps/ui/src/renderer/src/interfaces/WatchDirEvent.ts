export type WatchDirEvent = {
  type: 'add' | 'unlink';
  from: string;
  dirPath: string;
  listenerId: string;
};
