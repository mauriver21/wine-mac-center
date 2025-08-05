import { ScriptOperation } from '@constants/enums';

export type PipelineScript =
  | {
      name: string;
      operation: ScriptOperation.REMOVE;
      target: string;
      verbs?: string;
    }
  | {
      name: string;
      operation: ScriptOperation.COPY;
      from: string;
      target: string;
      verbs?: string;
    }
  | {
      name: string;
      operation: ScriptOperation.DOWNLOAD;
      downloadName: string;
      url: string;
    }
  | {
      name: string;
      operation: ScriptOperation.RUN_WINDOWS_EXE;
      exePath: string;
    };
