import { ScriptOperation } from '@constants/enums';
import { SpawnProcessArgs } from '@interfaces/SpawnProcessArgs';
import { WineAppStep } from '@interfaces/WineAppStep';

export type PipelineScript = WineAppStep &
  (
    | {
        operation: ScriptOperation.REMOVE;
        target: string;
        verbs?: string;
        spawnProcessArgs?: SpawnProcessArgs;
      }
    | {
        operation: ScriptOperation.COPY;
        from: string;
        target: string;
        verbs?: string;
        spawnProcessArgs?: SpawnProcessArgs;
      }
    | {
        operation: ScriptOperation.DOWNLOAD;
        downloadName: string;
        url: string;
      }
    | {
        operation: ScriptOperation.RUN_WINDOWS_EXE;
        exePath: string;
        spawnProcessArgs?: SpawnProcessArgs;
      }
  );
