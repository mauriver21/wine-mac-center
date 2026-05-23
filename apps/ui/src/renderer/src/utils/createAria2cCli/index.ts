import { SpawnProcessArgs } from '@interfaces/SpawnProcessArgs';
import { createEnv } from '@utils/createEnv';
import { spawnProcess } from '@utils/spawnProcess';

export const createAria2cCli = () => {
  const env = createEnv();
  const CLIENTS_PATH = `${env.get().CLIENTS_PATH}`;
  const WINE_DOWNLOADS_PATH = `${env.get().WINE_DOWNLOADS_PATH}`;

  const bin = (cmd: string, spawnArgs?: SpawnProcessArgs) => {
    return spawnProcess(
      `"${CLIENTS_PATH}/aria2c/aria2c" ${cmd} & PID=$!; echo "[PIDS_START]$PID[PIDS_END]"; wait $PID`,
      spawnArgs
    );
  };

  const help = (args?: SpawnProcessArgs) => {
    return bin(`-h`, args);
  };

  const download = (
    config: {
      dir?: string;
      split?: number;
      summaryInterval?: number;
      resume?: boolean;
      autoFileRenaming?: boolean;
      allowOverwrite?: boolean;
      url: string;
    },
    args?: SpawnProcessArgs
  ) => {
    const {
      dir = WINE_DOWNLOADS_PATH,
      split = 16,
      summaryInterval = 1,
      resume = true,
      autoFileRenaming = false,
      allowOverwrite = false,
      url
    } = config;

    const cmdArgs = [
      `--dir="${dir}"`,
      `--split=${split}`,
      `--max-connection-per-server=${split}`,
      `--summary-interval=${summaryInterval}`,
      `--continue=${resume}`,
      `--auto-file-renaming=${autoFileRenaming}`,
      `--allow-overwrite=${allowOverwrite}`,
      `"${url}"`
    ];

    const cmd = cmdArgs.join(' ');

    return new Promise<undefined>((resolve) => {
      bin(cmd, {
        ...args,
        onExit: (data) => {
          args?.onExit?.(data);
          resolve(undefined);
        }
      });
    });
  };

  return { download, help };
};
