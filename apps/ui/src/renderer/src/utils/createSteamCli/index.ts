import { SpawnProcessArgs } from '@interfaces/SpawnProcessArgs';
import { createEnv } from '@utils/createEnv';
import { spawnProcess as baseSpawnProcess } from '@utils/spawnProcess';

export const createSteamCli = () => {
  const env = createEnv();
  const STEAM_CLI_PATH = `${env.get().CLIENTS_PATH}/steam`;

  /**
   * Bash scripts source.
   */
  const s = (cmd: string) => {
    return `${env.getEnvExports()} ${cmd}`;
  };

  const spawnProcess: typeof baseSpawnProcess = (...params) => {
    const [cmd, args] = params;
    return baseSpawnProcess(s(cmd), args);
  };

  const install = (args?: SpawnProcessArgs) => {
    spawnProcess(`"${STEAM_CLI_PATH}/installSteamCMD.sh"`, args);
  };

  return { install };
};
