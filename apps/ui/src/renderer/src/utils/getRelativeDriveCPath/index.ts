import { RELATIVE_DRIVE_C_PATH } from '@constants/paths';

export const getRelativeDriveCPath = (path: string) => {
  if (path.match(RELATIVE_DRIVE_C_PATH)) {
    const relativePath = path.split(RELATIVE_DRIVE_C_PATH)?.[1];
    path = `/${RELATIVE_DRIVE_C_PATH}${relativePath}`;
  }

  return path;
};
