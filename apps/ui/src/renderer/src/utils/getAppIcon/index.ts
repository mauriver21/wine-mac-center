import { readBinaryFile } from '@utils/readBinaryFile';

export const getAppIcon = async (appPath = '') => {
  let url = '';
  try {
    const data = await readBinaryFile(`${appPath}/Contents/Resources/icon.icns`);
    const blob = new Blob([data as BlobPart]);
    url = URL.createObjectURL(blob);
  } catch (_) {
    _;
  }

  return url;
};
