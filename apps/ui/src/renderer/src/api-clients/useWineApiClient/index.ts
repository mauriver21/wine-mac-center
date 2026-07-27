import { ExitCode } from '@constants/enums';
import { useEnv } from '@hooks/useEnv';
import { OutputHandler } from '@interfaces/OutputHandler';
import { dirExists } from '@utils/dirExists';
import { execCommand } from '@utils/execCommand';
import { spawnLog } from '@utils/spawnLog';
import { spawnProcess } from '@utils/spawnProcess';

let dependenciesInstallationAbortRequested = false;
let wineBuildAbortRequested = false;

export const useWineApiClient = () => {
  const env = useEnv();
  const WINE_REPOSITORY_PATH = () => env.get().WINE_REPOSITORY_PATH;

  const isWineRepositoryDownloaded = () => dirExists(`${WINE_REPOSITORY_PATH()}/.git`);

  const getWineTags = async () => {
    if (!(await isWineRepositoryDownloaded())) return [];

    const { stdOut } = await execCommand(
      `git -C "${WINE_REPOSITORY_PATH()}" tag --list --sort=-creatordate`
    );
    return stdOut
      .split('\n')
      .map((tag) => tag.trim())
      .filter(Boolean);
  };

  const getWineArchs = async () => {
    if (!(await isWineRepositoryDownloaded())) return [];

    const { stdOut } = await execCommand(`"${WINE_REPOSITORY_PATH()}/configure" --help`);
    return [
      ...(stdOut.includes('--enable-win32on64') ? ['wine32on64'] : []),
      ...(stdOut.includes('--enable-archs') ? ['wow64'] : []),
      ...(stdOut.includes('--enable-win64') ? ['wine64'] : [])
    ];
  };

  const checkoutWineTag = async (tag: string, onOutput: OutputHandler) => {
    const tags = await getWineTags();
    if (!tags.includes(tag) || !/^[a-zA-Z0-9._/-]+$/.test(tag)) {
      throw new Error(`Invalid Wine repository tag: ${tag}`);
    }

    return new Promise<void>((resolve, reject) => {
      void spawnProcess(
        `git -C "${WINE_REPOSITORY_PATH()}" checkout --detach "refs/tags/${tag}"`,
        {
          onStdOut: onOutput,
          onStdErr: onOutput,
          onExit: (exitCode) => {
            if (exitCode === ExitCode.SuccessfulExecution) {
              resolve();
            } else {
              reject(new Error(`Wine tag checkout failed. Exit code: ${exitCode}`));
            }
          }
        }
      ).catch(reject);
    });
  };

  const buildWine = (tag: string, arch: string, onOutput: OutputHandler) => {
    if (!/^[a-zA-Z0-9._/-]+$/.test(tag)) throw new Error(`Invalid Wine tag: ${tag}`);
    if (!['wine32on64', 'wow64', 'wine64'].includes(arch)) {
      throw new Error(`Invalid Wine architecture: ${arch}`);
    }

    const { SCRIPTS_PATH } = env.get();
    wineBuildAbortRequested = false;
    return new Promise<void>((resolve, reject) => {
      void spawnProcess(
        `${env.getEnvExports()} "${SCRIPTS_PATH}/buildWineEngine.sh" "${tag}" "${arch}"`,
        {
          onStdOut: onOutput,
          onStdErr: onOutput,
          onExit: (exitCode) => {
            if (wineBuildAbortRequested) {
              wineBuildAbortRequested = false;
              onOutput('\nWine build aborted.\n');
              resolve();
            } else if (exitCode === ExitCode.SuccessfulExecution) {
              resolve();
            } else {
              reject(new Error(`Wine build failed. Exit code: ${exitCode}`));
            }
          }
        }
      ).catch(reject);
    });
  };

  const verifyWineBuildDependencies = (
    tag: string,
    arch: string,
    onOutput: OutputHandler
  ) => {
    const { SCRIPTS_PATH } = env.get();
    wineBuildAbortRequested = false;

    return new Promise<boolean>((resolve, reject) => {
      void spawnProcess(
        `${env.getEnvExports()} "${SCRIPTS_PATH}/verifyWineBuildDependencies.sh" "${tag}" "${arch}"`,
        {
          onStdOut: onOutput,
          onStdErr: onOutput,
          onExit: (exitCode) => {
            if (wineBuildAbortRequested) {
              wineBuildAbortRequested = false;
              onOutput('\nWine build verification aborted.\n');
              resolve(false);
            } else if (exitCode === ExitCode.SuccessfulExecution) {
              resolve(true);
            } else {
              reject(new Error(`Wine build dependency verification failed. Exit code: ${exitCode}`));
            }
          }
        }
      ).catch(reject);
    });
  };

  const abortWineBuild = async () => {
    const { SCRIPTS_PATH } = env.get();
    wineBuildAbortRequested = true;

    try {
      await execCommand(`${env.getEnvExports()} "${SCRIPTS_PATH}/abortWineBuild.sh"`);
    } catch (error) {
      wineBuildAbortRequested = false;
      throw error;
    }
  };

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
    abortWineBuild,
    abortWineBuildDependenciesInstallation,
    buildWine,
    checkoutWineTag,
    downloadWineRepository,
    getWineTags,
    getWineArchs,
    installWineBuildDependencies,
    isWineRepositoryDownloaded,
    verifyWineBuildDependencies,
  };
};
