import { SpawnProcessArgs } from '@interfaces/SpawnProcessArgs';
import { createEnv } from '@utils/createEnv';
import { spawnProcess } from '@utils/spawnProcess';

export const createAria2cCli = () => {
  const env = createEnv();
  const CLIENTS_PATH = `${env.get().CLIENTS_PATH}`;
  const WINE_DOWNLOADS_PATH = `${env.get().WINE_DOWNLOADS_PATH}`;

  const bin = (cmd: string, spawnArgs?: SpawnProcessArgs) => {
    return spawnProcess(`"${CLIENTS_PATH}/aria2c/bin" ${cmd}`, spawnArgs);
  };

  const help = (args?: SpawnProcessArgs) => {
    return bin(`-h`, args);
  };

  const download = (
    config: { url: string; dir?: string; split?: number },
    args?: SpawnProcessArgs
  ) => {
    const { url, dir, split } = config;

    const cmdArgs = [`--dir="${dir || WINE_DOWNLOADS_PATH}"`, `--split=${split || 16}`, `"${url}"`];

    return bin(cmdArgs.join(' '), args);
  };

  return { download, help };
};
