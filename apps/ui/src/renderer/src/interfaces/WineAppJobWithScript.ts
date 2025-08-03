import { SpawnProcessArgs } from '@interfaces/SpawnProcessArgs';
import { WineAppStep } from '@interfaces/WineAppStep';
import { PipelineScript } from '@interfaces/PipelineScript';

export type WineAppJobWithScript = {
  name: string;
  steps: Array<
    WineAppStep & {
      script: (args: SpawnProcessArgs) => Promise<{
        pid: number;
      }>;
      pipelineScript?: PipelineScript;
    }
  >;
};
