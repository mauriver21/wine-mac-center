import { ENV } from '@constants/envs';
import { dirExists } from '@utils/dirExists';

export const appExists = async (appName: string) => {
  const appPath = `${ENV.WINE_APPS_PATH}/${appName}.app`;
  return await dirExists(appPath);
};
