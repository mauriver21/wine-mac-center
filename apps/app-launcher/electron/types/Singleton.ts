import { FSWatcher } from 'chokidar';
import { BrowserWindow } from 'electron';

export type Singleton = {
  mainWindow: BrowserWindow | undefined | null;
  watchers: Array<FSWatcher>;
  becameActive: boolean;
};
