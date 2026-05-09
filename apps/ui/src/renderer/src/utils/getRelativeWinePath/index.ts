import { WINE_PATH } from '@constants/paths';

export const getRelativeWinePath = (path: string) => {
  if (path.match(WINE_PATH)) {
    const relativePath = path.split(WINE_PATH)?.[1];
    path = `${WINE_PATH}${relativePath}`;
  }

  return path;
};
