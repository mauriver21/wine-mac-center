import { WineAppConfig } from '@interfaces/WineAppConfig';
import { WineAppJob } from '@interfaces/WineAppJob';
import { ProcessStatus } from '@constants/enums';

export type WineAppPipelineConfig = {
  appConfig: WineAppConfig;
  jobs: Array<WineAppJob>;
  status: ProcessStatus;
  lastJobIndex?: number;
  lastStepIndex?: number;
};
