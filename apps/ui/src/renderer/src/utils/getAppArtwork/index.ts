import { createObjectURL } from '@utils/createObjectURL';

export const getAppArtwork = (appPath = '') =>
  createObjectURL(`${appPath}/Contents/Resources/header.jpeg`);
