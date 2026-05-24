import { ProcessStatus } from '@constants/enums';
import { WineAppJob } from '@interfaces/WineAppJob';

export type WineAppPipelineStatus = {
  pipelineId: string;
  status: ProcessStatus;
  jobs: WineAppJob[];
  lastJobIndex?: number;
  lastStepIndex?: number;
};
