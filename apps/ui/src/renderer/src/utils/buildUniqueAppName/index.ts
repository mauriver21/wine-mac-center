import { appExists } from '@utils/appExists';

export const buildUniqueAppName = async (appName: string) => {
  let count = 1;
  let newAppName = appName;

  while (true) {
    if ((await appExists(newAppName)) === false) {
      break;
    }
    newAppName = `${appName} ${count}`;
    count++;
  }

  return newAppName;
};
