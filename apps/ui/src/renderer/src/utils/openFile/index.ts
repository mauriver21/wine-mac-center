import { readBinaryFile } from '@utils/readBinaryFile';
import { showOpenDialog } from '@utils/showOpenDialog';

export const openFile = async (
  title?: string,
  options?: Electron.OpenDialogOptions & { errorMessage?: string }
) => {
  let fileName = '';
  let file: File | undefined = undefined;
  let errorMessage = '';
  const { errorMessage: givenErrorMessage, ...restOptions } = options || {};

  try {
    const { filePaths } = await showOpenDialog({ title, ...restOptions });
    const [filePath] = filePaths;
    fileName = filePath?.split('/')?.pop() || '';
    const ext = fileName?.split('.')?.pop();
    const byteArray = (await readBinaryFile(filePath)) as unknown as ArrayBuffer;
    const blob = new Blob([byteArray], ext ? { type: `image/${ext}` } : undefined);
    file = new File([blob], fileName);
  } catch (_) {
    errorMessage = givenErrorMessage || 'No file found';
  }

  return { fileName, file, errorMessage };
};
