import { SpawnProcessArgs, UpdateProcess } from '@interfaces/SpawnProcessArgs';
import { WineAppJobWithScript } from '@interfaces/WineAppJobWithScript';
import { WineAppPipelineStatus } from '@interfaces/WineAppPipelineStatus';
import { WineAppStep } from '@interfaces/WineAppStep';

export type WineAppPipeline = {
  _: {
    onUpdate?: (status: WineAppPipelineStatus) => void;
    std: (
      action: 'stdOut' | 'stdErr' | 'exit',
      step: WineAppStep & {
        script: (args: SpawnProcessArgs) => Promise<void>;
      },
      data: string | number | null,
      updateProcess?: UpdateProcess
    ) => void;
  };
  id: string;
  onUpdate: (fn: (status: WineAppPipelineStatus) => void) => void;
  getInitialStatus: () => WineAppPipelineStatus;
  jobs: WineAppJobWithScript[];
  run: () => void;
  kill: () => void;
};
