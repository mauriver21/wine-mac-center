/// <reference types="vite-plugin-electron/electron-env" />
import { ElectronAPI } from '@electron-toolkit/preload';
import { Api } from '../electron/types';

declare namespace NodeJS {
  interface ProcessEnv {
    /**
     * The built directory structure
     *
     * ```tree
     * ├─┬─┬ dist
     * │ │ └── index.html
     * │ │
     * │ ├─┬ dist-electron
     * │ │ ├── main.js
     * │ │ └── preload.js
     * │
     * ```
     */
    APP_ROOT: string;
    /** /dist/ or /public/ */
    VITE_PUBLIC: string;
  }
}

// Used in Renderer process, expose in `preload.ts`
declare global {
  interface Window {
    ipcRenderer: import('electron').IpcRenderer;
    electron: ElectronAPI;
    api: Api;
  }
}
