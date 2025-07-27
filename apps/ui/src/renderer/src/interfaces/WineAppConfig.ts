import { WineAppExecutable } from '@interfaces/WineAppExecutable';
import { WinetricksOptions } from '@interfaces/WinetricksOptions';

export type WineAppConfig = {
  id: string;
  appId?: string;
  iconURL?: string;
  iconFile?: ArrayBuffer;
  artworkFile?: ArrayBuffer;
  name: string;
  engineVersion: string;
  engineURLs: string[];
  setupExecutableURL?: string;
  setupExecutablePath?: string;
  appFolderPath?: string;
  winetricks?: { verbs: string[]; options?: WinetricksOptions };
  dxvkEnabled: boolean;
  executables?: Array<WineAppExecutable>;
};
