import { WineAppConfig } from '@interfaces/WineAppConfig';
import { WineAppPipelineConfig } from '@interfaces/WineAppPipelineConfig';

export type WineInstalledApp = Omit<WineAppConfig, 'id' | 'appId'> & {
  id: string;
  pid?: number;
  configId: string;
  appPath: string;
  pipeline?: WineAppPipelineConfig;
};
