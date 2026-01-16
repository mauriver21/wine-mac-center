import { SpawnProcessArgs } from '@interfaces/SpawnProcessArgs';
import { createEnv } from '@utils/createEnv';
import { spawnProcess } from '@utils/spawnProcess';

export const createSteamCli = () => {
  const env = createEnv();
  const STEAM_CLI_PATH = `${env.get().CLIENTS_PATH}/steam`;

  const install = (args?: SpawnProcessArgs) => {
    spawnProcess(`"${STEAM_CLI_PATH}/steamcmd"`, args);
  };

  return { install };
};
