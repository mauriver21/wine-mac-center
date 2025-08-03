import { ScriptOperation } from '@constants/enums';
import { WineAppStep } from '@interfaces/WineAppStep';

export type PipelineScript = WineAppStep &
  (
    | {
        operation: ScriptOperation.REMOVE;
        target: string;
        verbs?: string;
      }
    | {
        operation: ScriptOperation.COPY;
        from: string;
        target: string;
        verbs?: string;
      }
    | {
        operation: ScriptOperation.DOWNLOAD;
        downloadName: string;
        url: string;
      }
    | {
        operation: ScriptOperation.RUN_WINDOWS_EXE;
        exePath: string;
      }
  );
