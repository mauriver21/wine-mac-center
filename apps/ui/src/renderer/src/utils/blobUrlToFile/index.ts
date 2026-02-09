export const blobUrlToFile = async (
  blobUrl: string,
  fileName: string,
  options?: FilePropertyBag
): Promise<File> => {
  const response = await fetch(blobUrl);
  const blob = await response.blob();

  return new File([blob], fileName, {
    type: blob.type,
    lastModified: Date.now(),
    ...options
  });
};
