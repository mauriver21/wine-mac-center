import { ConfigOrigin, License } from '@constants/enums';
import { PipelineScript } from '@interfaces/PipelineScript';
import { WineAppExecutable } from '@interfaces/WineAppExecutable';
import { WinetricksOptions } from '@interfaces/WinetricksOptions';

export type WineAppConfig = {
  name: string;
  license?: License;
  origin: ConfigOrigin;
  scriptURL?: string;
  iconURL?: string;
  artworkURL?: string;
  launcherImgURL?: string;
  iconFile?: ArrayBuffer;
  artworkFile?: ArrayBuffer;
  launcherImgFile?: ArrayBuffer;
  engineVersion?: string;
  engineURLs?: string[];
  setupExecutableURL?: string;
  setupExecutablePath?: string;
  appFolderPath?: string;
  winetricks?: { verbs: string[]; version: string; options?: WinetricksOptions };
  dxvkEnabled?: boolean;
  executables?: Array<WineAppExecutable>;
  pipelineScripts?: Array<PipelineScript>;
  launcherConfig?: {
    runMainExeOnStartup?: boolean;
    preventMonitorFromBecomingInactive?: boolean;
    quitAppWhenLauncherIsClosed?: boolean;
  };
};
