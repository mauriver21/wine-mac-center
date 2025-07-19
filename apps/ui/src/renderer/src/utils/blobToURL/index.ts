export const blobToURL = (data: ArrayBuffer) => {
  const blob = new Blob([data]);
  return URL.createObjectURL(blob);
};
