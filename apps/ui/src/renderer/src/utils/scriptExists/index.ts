import { ENV } from '@constants/envs';
import { dirExists } from '@utils/dirExists';

export const scriptExists = async (appName: string) => {
  const scriptPath = `${ENV.WINE_SCRIPTS_PATH}/${appName}`;
  return await dirExists(scriptPath);
};
