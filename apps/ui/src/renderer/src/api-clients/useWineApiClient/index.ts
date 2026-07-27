import { ExitCode } from '@constants/enums';
import { useEnv } from '@hooks/useEnv';
import { OutputHandler } from '@interfaces/OutputHandler';
import { dirExists } from '@utils/dirExists';
import { spawnLog } from '@utils/spawnLog';
import { spawnProcess } from '@utils/spawnProcess';

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

    return new Promise<void>((resolve, reject) => {
      void spawnProcess(
        `${env.getEnvExports()} "${SCRIPTS_PATH}/installWineBuildDependencies.sh"`,
        {
          onStdOut: onOutput,
          onStdErr: onOutput,
          onExit: (exitCode) => {
            if (exitCode === ExitCode.SuccessfulExecution) {
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

  return {
    downloadWineRepository,
    installWineBuildDependencies,
    isWineRepositoryDownloaded,
    wineRepositoryPath
  };
};
