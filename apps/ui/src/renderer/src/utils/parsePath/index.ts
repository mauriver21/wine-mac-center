export const parsePath = (path: string | undefined = '') =>
  `${decodeURIComponent(path.replace(/^\//, ''))}`;
