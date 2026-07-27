import { ExitCode } from '@constants/enums';
import { WINE_REPOSITORY_URL } from '@constants/urls';
import { useEnv } from '@hooks/useEnv';
import { dirExists } from '@utils/dirExists';
import { spawnLog } from '@utils/spawnLog';
import { spawnProcess } from '@utils/spawnProcess';

export const useWineApiClient = () => {
  const env = useEnv();
  const wineRepositoryPath = () => env.get().WINE_REPOSITORY_PATH;

  const isWineRepositoryDownloaded = () => dirExists(`${wineRepositoryPath()}/.git`);

  const downloadWineRepository = async () => {
    if (await isWineRepositoryDownloaded()) return;

    return new Promise<void>((resolve, reject) => {
      void spawnProcess(
        `git clone --progress "${WINE_REPOSITORY_URL}" "${wineRepositoryPath()}"`,
        {
          ...spawnLog,
          onExit: (exitCode) => {
            if (exitCode === ExitCode.SuccessfulExecution) {
              resolve();
            } else {
              reject(new Error(`Wine repository download failed with exit code ${exitCode}`));
            }
          }
        }
      ).catch(reject);
    });
  };

  return { downloadWineRepository, isWineRepositoryDownloaded, wineRepositoryPath };
};
