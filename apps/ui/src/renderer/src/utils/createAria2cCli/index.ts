import { SpawnProcessArgs } from '@interfaces/SpawnProcessArgs';
import { createEnv } from '@utils/createEnv';
import { spawnProcess } from '@utils/spawnProcess';

export const createAria2cCli = () => {
  const env = createEnv();
  const CLIENTS_PATH = `${env.get().CLIENTS_PATH}`;
  const WINE_DOWNLOADS_PATH = `${env.get().WINE_DOWNLOADS_PATH}`;

  const bin = (cmd: string, spawnArgs?: SpawnProcessArgs) => {
    return spawnProcess(`"${CLIENTS_PATH}/aria2c/aria2c" ${cmd}`, spawnArgs);
  };

  const help = (args?: SpawnProcessArgs) => {
    return bin(`-h`, args);
  };

  const download = (
    config: {
      dir?: string;
      split?: number;
      summaryInterval?: number;
      url: string;
    },
    args?: SpawnProcessArgs
  ) => {
    const { dir = WINE_DOWNLOADS_PATH, split = 16, summaryInterval = 1, url } = config;

    const cmdArgs = [
      `--dir="${dir}"`,
      `--split=${split}`,
      `--summary-interval=${summaryInterval}`,
      `"${url}"`
    ];

    return new Promise<{ GID: string | undefined }>((resolve) => {
      bin(cmdArgs.join(' '), {
        ...args,
        onExit: (data) => {
          args?.onExit?.(data);
          resolve({ GID: undefined });
        }
      });
    });
  };

  return { download, help };
};
