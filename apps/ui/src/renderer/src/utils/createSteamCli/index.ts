import { SpawnProcessArgs } from '@interfaces/SpawnProcessArgs';
import { createEnv } from '@utils/createEnv';
import { spawnProcess as baseSpawnProcess } from '@utils/spawnProcess';

export const createSteamCli = (options: {
  credentials: { userName: string; password: string };
}) => {
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

  const login = async (
    credentials: { userName: string; password: string },
    args?: SpawnProcessArgs
  ) => {
    const { userName, password } = credentials;
    return new Promise((resolve, reject) => {
      runSteamCmd(`+login ${userName} ${password} +quit`, {
        onStdOut: (data) => {
          if (data.match(/ERROR/i)) {
            reject('Login Failed');
          }
          args?.onStdOut?.(data);
        },
        onStdErr: (data) => {
          if (data.match(/ERROR/i)) {
            reject('Login Failed');
          }
          args?.onStdErr?.(data);
        },
        onExit: (data) => {
          resolve(undefined);
          args?.onExit?.(data);
        }
      });
    });
  };

  const downloadSteamApp = (
    args: { gameInstallDir: string; appId: string },
    spawnArgs: SpawnProcessArgs
  ) => {
    const { userName, password } = options.credentials;
    const { gameInstallDir, appId } = args;
    return spawnProcess(
      `"${STEAM_CLI_PATH}/downloadSteamApp.sh" "${gameInstallDir}" "${gameInstallDir.toLowerCase()}" "${userName}" "${password}" "${appId}"`,
      spawnArgs
    );
  };

  return { install, login, downloadSteamApp };
};
