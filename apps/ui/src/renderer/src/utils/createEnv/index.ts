import { FileName } from '@constants/enums';
import { ENV } from '@constants/envs';
import { WINE_REPOSITORY_PATH } from '@constants/paths';
import { buildEnvExports } from '@utils/buildEnvExports';
import { createDirectory } from '@utils/createDirectory';
import { dirExists } from '@utils/dirExists';
import { execCommand } from '@utils/execCommand';
import { getAppPath } from '@utils/getAppPath';
import { pathJoin } from '@utils/pathJoin';

export const createEnv = (args?: {
  standaloneApp?: boolean;
  APPLICATION_PATH_OVERRIDE?: string;
}) => {
  const { standaloneApp = false, APPLICATION_PATH_OVERRIDE } = args || {};
  const get = () => ENV;

  const init = async (mode = process.env.NODE_ENV) => {
    const promises = [initEnv(mode)];
    await Promise.allSettled(promises);
  };

  const initEnv = async (mode: string | undefined) => {
    ENV.DIRNAME = await resolveDirName();
    ENV.APPLICATION_PATH = await resolveApplicationPath();
    ENV.APPLICATION_DIR_PATH = resolveApplicationDirPath();
    ENV.RESOURCES_PATH = await resolveResourcesPath(mode);
    ENV.HOME = (await execCommand('echo $HOME')).stdOut.trim();
    ENV.WINE_PATH = `${ENV.HOME}/Wine`;
    ENV.APP_NAME = resolveApplicationName();
    ENV.WINE_APPS_PATH = `${ENV.WINE_PATH}/apps`;
    ENV.WINE_ASSETS_PATH = `${ENV.WINE_PATH}/assets`;
    ENV.WINE_REPOSITORY_PATH = `${ENV.WINE_ASSETS_PATH}/wine`;
    ENV.WINE_DOWNLOADS_PATH = `${ENV.WINE_ASSETS_PATH}/downloads`;
    ENV.WINE_ENGINES_PATH = `${ENV.WINE_PATH}/engines`;
    ENV.WINE_SCRIPTS_PATH = `${ENV.WINE_ASSETS_PATH}/scripts`;
    ENV.WINE_TMP_PATH = `${ENV.WINE_PATH}/tmp`;
    ENV.SCRIPTS_PATH = `${ENV.RESOURCES_PATH}/bash`;
    ENV.COMPRESSED_PATH = `${ENV.RESOURCES_PATH}/compressed`;
    ENV.CLIENTS_PATH = `${ENV.RESOURCES_PATH}/clients`;
    ENV.LAUNCHER_APP_PATH = `${ENV.RESOURCES_PATH}/launcher/${FileName.CFBundleExecutable}.app`;
    await createDirs();
  };

  const dirname = () => ENV.DIRNAME;

  const resolveDirName = async () => {
    const APP_RESOURCES = APPLICATION_PATH_OVERRIDE
      ? `${APPLICATION_PATH_OVERRIDE}/Contents/Resources`
      : '';
    const appPath = APP_RESOURCES || (await getAppPath());
    return appPath?.replace(`/${FileName.ElectronAsar}`, '');
  };

  const resolveApplicationPath = async () => {
    console.log(ENV.DIRNAME);
    return standaloneApp ? await pathJoin(ENV.DIRNAME, '../..') : '';
  };

  const resolveApplicationName = () => {
    return ENV.APPLICATION_PATH.split('/').pop()?.replace('.app', '') || '';
  };

  const resolveApplicationDirPath = () => {
    const APPLICATION_PATH_ARRAY = ENV.APPLICATION_PATH.split('/');
    APPLICATION_PATH_ARRAY.pop();
    return APPLICATION_PATH_ARRAY.join('/');
  };

  const resolveResourcesPath = (mode: string | undefined) => {
    console.log(mode)
    switch (mode) {
      case 'development':
      case 'integration':
        return standaloneApp
          ? pathJoin(ENV.APPLICATION_PATH, 'Contents/Resources')
          : pathJoin(ENV.DIRNAME, 'resources');
      default:
        return standaloneApp ? pathJoin(ENV.APPLICATION_PATH, 'Contents/Resources') : ENV.DIRNAME;
    }
  };

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
