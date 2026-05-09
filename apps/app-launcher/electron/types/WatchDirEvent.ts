export type WatchDirEvent = {
  id: string;
  type: 'add' | 'unlink';
  from: string;
  path: string;
  listenerId: string;
};
