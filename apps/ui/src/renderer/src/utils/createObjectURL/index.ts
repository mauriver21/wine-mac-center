import { readBinaryFile } from '@utils/readBinaryFile';

export const createObjectURL = async (path = '') => {
  let url = '';
  try {
    const data = await readBinaryFile(path);
    const blob = new Blob([data as BlobPart]);
    url = URL.createObjectURL(blob);
  } catch (_) {
    _;
  }

  return url;
};
