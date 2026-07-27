import { ExitCode } from '@constants/enums';
import { useEnv } from '@hooks/useEnv';
import { OutputHandler } from '@interfaces/OutputHandler';
import { dirExists } from '@utils/dirExists';
import { execCommand } from '@utils/execCommand';
import { spawnLog } from '@utils/spawnLog';
import { spawnProcess } from '@utils/spawnProcess';

let dependenciesInstallationAbortRequested = false;

export const useWineApiClient = () => {
  const env = useEnv();
  const wineRepositoryPath = () => env.get().WINE_REPOSITORY_PATH;

  const isWineRepositoryDownloaded = () => dirExists(`${wineRepositoryPath()}/.git`);

  const downloadWineRepository = async () => {
    if (await isWineRepositoryDownloaded()) return;

    const { SCRIPTS_PATH } = env.get();
    return new Promise<void>((resolve, reject) => {
      void spawnProcess(`${env.getEnvExports()} "${SCRIPTS_PATH}/downloadWineRepository.sh"`, {
        ...spawnLog,
        onExit: (exitCode) => {
          if (exitCode === ExitCode.SuccessfulExecution) {
            resolve();
          } else {
            reject(new Error(`Wine repository download failed. Exit code: ${exitCode}`));
          }
        }
      }).catch(reject);
    });
  };

  const installWineBuildDependencies = (onOutput: OutputHandler) => {
    const { SCRIPTS_PATH } = env.get();
    dependenciesInstallationAbortRequested = false;

    return new Promise<void>((resolve, reject) => {
      void spawnProcess(
        `${env.getEnvExports()} "${SCRIPTS_PATH}/installWineBuildDependencies.sh"`,
        {
          onStdOut: onOutput,
          onStdErr: onOutput,
          onExit: (exitCode) => {
            if (dependenciesInstallationAbortRequested) {
              dependenciesInstallationAbortRequested = false;
              onOutput('\nWine build dependency installation aborted.\n');
              resolve();
            } else if (exitCode === ExitCode.SuccessfulExecution) {
              resolve();
            } else {
              reject(
                new Error(`Wine build dependencies installation failed. Exit code: ${exitCode}`)
              );
            }
          }
        }
      ).catch(reject);
    });
  };

  const abortWineBuildDependenciesInstallation = async () => {
    const { SCRIPTS_PATH } = env.get();
    dependenciesInstallationAbortRequested = true;

    try {
      await execCommand(
        `${env.getEnvExports()} "${SCRIPTS_PATH}/abortWineBuildDependencies.sh"`
      );
    } catch (error) {
      dependenciesInstallationAbortRequested = false;
      throw error;
    }
  };

  return {
    abortWineBuildDependenciesInstallation,
    downloadWineRepository,
    installWineBuildDependencies,
    isWineRepositoryDownloaded,
    wineRepositoryPath
  };
};
