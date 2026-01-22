import { createObjectURL } from '@utils/createObjectURL';

export const getAppLauncherImg = (appPath = '') =>
  createObjectURL(`${appPath}/Contents/Resources/launcher.jpeg`);
