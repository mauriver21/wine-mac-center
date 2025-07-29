export const extractAppName = (appPath: string | undefined) => {
  if (appPath === undefined) return '';
  return appPath.split('/').pop()?.replace('.app', '');
};
