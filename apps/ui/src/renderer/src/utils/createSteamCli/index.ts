import { SpawnProcessArgs } from '@interfaces/SpawnProcessArgs';
import { createEnv } from '@utils/createEnv';
import { spawnProcess as baseSpawnProcess } from '@utils/spawnProcess';

export const createSteamCli = () => {
  const env = createEnv();
  const STEAM_CLI_PATH = `${env.get().CLIENTS_PATH}/steam`;

  const s = (cmd: string) => {
    return `${env.getEnvExports()} ${cmd}`;
  };

  const spawnProcess: typeof baseSpawnProcess = (...params) => {
    const [cmd, args] = params;
    return baseSpawnProcess(s(cmd), args);
  };

  const install = (args?: SpawnProcessArgs) => {
    return spawnProcess(`"${STEAM_CLI_PATH}/installSteamCMD.sh"`, args);
  };

  const runSteamCmd = (cmd: string, args?: SpawnProcessArgs) => {
    return spawnProcess(`"${STEAM_CLI_PATH}/runSteamCMD.sh" ${cmd}`, args);
  };

  const login = (credentials: { userName: string; password: string }, args?: SpawnProcessArgs) => {
    const { userName, password } = credentials;
    return runSteamCmd(`+login ${userName} ${password} +quit`, args);
  };

  return { install, login };
};
