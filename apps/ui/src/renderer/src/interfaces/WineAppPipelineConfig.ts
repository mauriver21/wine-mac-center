import { WineAppConfig } from '@interfaces/WineAppConfig';
import { WineAppJob } from '@interfaces/WineAppJob';
import { ProcessStatus } from '@constants/enums';

export type WineAppPipelineConfig = {
  pipelineId?: string;
  appConfig: WineAppConfig;
  jobs: Array<WineAppJob>;
  status: ProcessStatus;
  lastJobIndex?: number;
  lastStepIndex?: number;
};
