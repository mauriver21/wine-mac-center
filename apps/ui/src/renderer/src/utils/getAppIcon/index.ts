import { readBinaryFile } from '@utils/readBinaryFile';

export const getAppIcon = async (appPath = '') => {
  let url = '';
  try {
    const data = await readBinaryFile(`${appPath}/Contents/Resources/winemacapp.icns`);
    const blob = new Blob([data]);
    url = URL.createObjectURL(blob);
  } catch (_) {
    _;
  }

  return url;
};
