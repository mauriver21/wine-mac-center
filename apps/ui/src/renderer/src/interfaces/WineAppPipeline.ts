import { SpawnProcessArgs, UpdateProcess } from '@interfaces/SpawnProcessArgs';
import { WineAppJobWithScript } from '@interfaces/WineAppJobWithScript';
import { WineAppStep } from '@interfaces/WineAppStep';
import { WineAppPipelineConfig } from '@interfaces/WineAppPipelineConfig';
import { WineAppConfig } from '@interfaces/WineAppConfig';

export type WineAppPipeline = {
  _: {
    onUpdate?: (status: WineAppPipelineConfig) => void;
    std: (
      jobName: string,
      action: 'stdOut' | 'stdErr' | 'exit',
      step: WineAppStep & {
        script: (args: SpawnProcessArgs) => Promise<{
          pid: number;
        }>;
      },
      data: string | number | null,
      updateProcess?: UpdateProcess
    ) => void;
  };
  id: string;
  onUpdate: (fn: (status: WineAppPipelineConfig) => void) => void;
  getInitialStatus: () => WineAppPipelineConfig;
  jobs: WineAppJobWithScript[];
  run: (args?: { fromJobIndex?: number; fromStepIndex?: number }) => Promise<void>;
  kill: () => Promise<void>;
  readPipelineConfig: () => Promise<WineAppPipelineConfig>;
  getUpdatedConfig: () => {
    pipelineId: string;
    jobs: WineAppJobWithScript[];
    lastJobIndex: number | undefined;
    lastStepIndex: number | undefined;
    appConfig: WineAppConfig;
  };
};
