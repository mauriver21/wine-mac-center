import { DRIVE_C_PATH } from '@constants/paths';

export const getRelativeDriveCPath = (path: string) => {
  if (path.match(DRIVE_C_PATH)) {
    const relativePath = path.split(DRIVE_C_PATH)?.[1];
    path = `/${DRIVE_C_PATH}${relativePath}`;
  }

  return path;
};
