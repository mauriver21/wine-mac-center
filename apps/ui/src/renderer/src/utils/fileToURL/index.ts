export const fileToURL = async (file: File) => {
  const data = await file.arrayBuffer();
  const blob = new Blob([data]);
  return URL.createObjectURL(blob);
};
