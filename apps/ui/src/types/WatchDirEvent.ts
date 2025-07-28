export type WatchDirEvent = {
  id: string;
  type: 'add' | 'unlink';
  from: string;
  dirPath: string;
  listenerId: string;
};
