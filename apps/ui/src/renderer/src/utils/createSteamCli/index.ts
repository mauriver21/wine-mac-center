import { SpawnProcessArgs } from '@interfaces/SpawnProcessArgs';
import { SteamCredentials } from '@interfaces/SteamCredentials';
import { createEnv } from '@utils/createEnv';
import { execCommand as baseExecCommand } from '@utils/execCommand';
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

  const runSteamCmd = async (cmd: string, args?: SpawnProcessArgs) => {
    const result = await spawnProcess(`"${SCRIPTS_PATH}/runSteamCMD.sh" ${cmd}`, args);
    await baseExecCommand(s(`"${SCRIPTS_PATH}/closeExtraFinderInstances.sh"`));
    return result;
  };

  const isInstalled = () => {
    return fileExists(`${CLIENTS_PATH}/steam/steamcmd.sh`);
  };

  const login = async (credentials: SteamCredentials, args?: SpawnProcessArgs) => {
    const { userName, password, guardCode } = credentials;

    if (!(await isInstalled())) {
      await install();
    }

    const steamCmdArgs = [
      ...(guardCode ? [`+set_steam_guard_code ${guardCode}`] : []),
      `+login ${userName || 'NO_VALUE'}${password ? ` ${password}` : ''}`,
      '+quit'
    ];

    const steamCmd = steamCmdArgs.join(' ');

    return new Promise((resolve, reject) => {
      let loginFailed = false;
      let loginOutput = '';

      runSteamCmd(steamCmd, {
        onStdOut: (data) => {
          loginOutput += data;
          loginFailed ||= /ERROR|Invalid Password|Login Failure/i.test(data);
          args?.onStdOut?.(data);
        },
        onStdErr: (data) => {
          loginOutput += data;
          loginFailed ||= /ERROR|Invalid Password|Login Failure/i.test(data);
          args?.onStdErr?.(data);
        },
        onExit: (data) => {
          args?.onExit?.(data);
          const loginSucceeded = /Waiting for user info[\s\S]*OK/i.test(loginOutput);
          const steamGuardRequired = /Steam Guard/i.test(loginOutput);

          if (loginFailed || (!loginSucceeded && !steamGuardRequired)) {
            reject(new Error('Login Failed'));
          } else {
            resolve(undefined);
          }
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
