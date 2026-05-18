import { SpawnProcessArgs } from '@interfaces/SpawnProcessArgs';
import { SteamCredentials } from '@interfaces/SteamCredentials';
import { createEnv } from '@utils/createEnv';
import { fileExists } from '@utils/fileExists';
import { spawnProcess as baseSpawnProcess } from '@utils/spawnProcess';

export const createSteamCli = (options: {
  credentials: { userName: string; password: string };
}) => {
  const env = createEnv();
  const SCRIPTS_PATH = `${env.get().SCRIPTS_PATH}`;
  const CLIENTS_PATH = `${env.get().CLIENTS_PATH}`;

  const s = (cmd: string) => {
    return `${env.getEnvExports()} ${cmd}`;
  };

  const spawnProcess: typeof baseSpawnProcess = (...params) => {
    const [cmd, args] = params;
    return baseSpawnProcess(s(cmd), args);
  };

  const install = (args?: SpawnProcessArgs) => {
    return spawnProcess(`"${SCRIPTS_PATH}/installSteamCMD.sh"`, args);
  };

  const runSteamCmd = (cmd: string, args?: SpawnProcessArgs) => {
    return spawnProcess(`"${SCRIPTS_PATH}/runSteamCMD.sh" ${cmd}`, args);
  };

  const isInstalled = () => {
    return fileExists(`${CLIENTS_PATH}/steam/steamcmd.sh`);
  };

  const login = async (credentials: SteamCredentials, args?: SpawnProcessArgs) => {
    const { userName, password } = credentials;

    if (!(await isInstalled())) {
      await install();
    }

    return new Promise((resolve, reject) => {
      runSteamCmd(`+login ${userName || 'NO_VALUE'} ${password || 'NO_VALUE'} +quit`, {
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
    args: { gameInstallDir: string; appId: string; guardCode?: string },
    spawnArgs?: SpawnProcessArgs
  ) => {
    const { userName, password } = options.credentials;
    const { gameInstallDir, appId, guardCode = '' } = args;
    return spawnProcess(
      `"${SCRIPTS_PATH}/downloadSteamApp.sh" "${gameInstallDir}" "${gameInstallDir.toLowerCase()}" "${userName}" "${password}" "${appId}" "${guardCode}"`,
      spawnArgs
    );
  };

  const killPids = (pids: string, args?: SpawnProcessArgs) => {
    return spawnProcess(`"${SCRIPTS_PATH}/killPids.sh" "${pids}"`, args);
  };

  return { install, login, downloadSteamApp, killPids, isInstalled };
};
