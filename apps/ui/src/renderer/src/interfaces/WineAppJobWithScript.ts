import { SpawnProcessArgs } from '@interfaces/SpawnProcessArgs';
import { WineAppStep } from '@interfaces/WineAppStep';

export type WineAppJobWithScript = {
  name: string;
  steps: Array<
    WineAppStep & {
      script: (args: SpawnProcessArgs) => Promise<{
        pid: number;
      }>;
    }
  >;
};
