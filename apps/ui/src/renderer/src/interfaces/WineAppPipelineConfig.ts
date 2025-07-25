import { WineAppConfig } from '@interfaces/WineAppConfig';
import { WineAppJob } from '@interfaces/WineAppJob';

export type WineAppPipelineConfig = {
  appConfig: WineAppConfig;
  jobs: Array<WineAppJob>;
};
