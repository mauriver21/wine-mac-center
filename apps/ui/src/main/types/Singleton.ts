import { FSWatcher } from 'chokidar';
import { BrowserWindow } from 'electron';

export type Singleton = { mainWindow: BrowserWindow; watchers: Array<FSWatcher> };
