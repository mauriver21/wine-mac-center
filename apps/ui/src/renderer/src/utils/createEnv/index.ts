import { ENV } from '@constants/envs';
import { buildEnvExports } from '@utils/buildEnvExports';
import { createDirectory } from '@utils/createDirectory';
import { dirExists } from '@utils/dirExists';
import { execCommand } from '@utils/execCommand';
import { getAppPath } from '@utils/getAppPath';
import { pathJoin } from '@utils/pathJoin';

export const createEnv = () => {
  const get = () => ENV;

  const init = async (mode = process.env.NODE_ENV) => {
    const promises = [initEnv(mode)];
    await Promise.allSettled(promises);
  };

  const initEnv = async (mode: string | undefined) => {
    ENV.DIRNAME = await getAppPath();

    switch (mode) {
      case 'development':
      case 'integration':
        ENV.RESOURCES_PATH = await pathJoin(ENV.DIRNAME, 'resources');
        break;
      default:
        ENV.RESOURCES_PATH = await pathJoin(ENV.DIRNAME, '..');
        break;
    }

    ENV.HOME = (await execCommand('echo $HOME')).stdOut.trim();
    ENV.WINE_PATH = `${ENV.HOME}/Wine`;
    ENV.WINE_APPS_PATH = `${ENV.WINE_PATH}/apps`;
    ENV.WINE_ASSETS_PATH = `${ENV.WINE_PATH}/assets`;
    ENV.WINE_ENGINES_PATH = `${ENV.WINE_PATH}/engines`;
    ENV.WINE_SCRIPTS_PATH = `${ENV.WINE_ASSETS_PATH}/scripts`;
    ENV.WINE_TMP_PATH = `${ENV.WINE_PATH}/tmp`;
    ENV.WINE_LIBS_PATH = `${ENV.WINE_PATH}/libs`;
    ENV.SCRIPTS_PATH = `${ENV.RESOURCES_PATH}/bash`;
    ENV.COMPRESSED_PATH = `${ENV.RESOURCES_PATH}/compressed`;

    await createDirs();
  };

  const dirname = () => ENV.DIRNAME;

  const getEnvExports = () => buildEnvExports(ENV);

  const createDirs = async () => {
    if ((await dirExists(ENV.WINE_PATH)) === false) {
      await createDirectory(ENV.WINE_PATH);
    }

    if ((await dirExists(ENV.WINE_APPS_PATH)) === false) {
      await createDirectory(ENV.WINE_APPS_PATH);
    }

    if ((await dirExists(ENV.WINE_ASSETS_PATH)) === false) {
      await createDirectory(ENV.WINE_ASSETS_PATH);
    }

    if ((await dirExists(ENV.WINE_ENGINES_PATH)) === false) {
      await createDirectory(ENV.WINE_ENGINES_PATH);
    }

    if ((await dirExists(ENV.WINE_SCRIPTS_PATH)) === false) {
      await createDirectory(ENV.WINE_SCRIPTS_PATH);
    }
  };

  return {
    dirname,
    get,
    init,
    getEnvExports
  };
};
