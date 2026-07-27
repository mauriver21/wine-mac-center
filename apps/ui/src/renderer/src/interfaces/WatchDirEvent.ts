export type WatchDirEvent = {
  id: string;
  type: 'add' | 'addDir' | 'unlink' | 'unlinkDir';
  from: string;
  path: string;
  listenerId: string;
};
