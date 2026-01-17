import { ScriptOperation } from '@constants/enums';

export type PipelineScript =
  | {
      name: string;
      operation: ScriptOperation.REMOVE;
      removePath: string;
      verbs?: string;
    }
  | {
      name: string;
      operation: ScriptOperation.DECOMPRESS;
      path: string;
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
      operation: ScriptOperation.SET_MAIN_EXE;
      mainExePath: string;
      exeFlags?: string;
    }
  | {
      name: string;
      operation: ScriptOperation.RUN_WINDOWS_EXE;
      exePath: string;
      baseExePath: string;
    }
  | {
      name: string;
      operation: ScriptOperation.MOUNT_DISK_IMAGE;
      diskImagePath: string;
    }
  | {
      name: string;
      operation: ScriptOperation.DOWNLOAD_STEAM_APP;
      steamAppId: string;
    };
