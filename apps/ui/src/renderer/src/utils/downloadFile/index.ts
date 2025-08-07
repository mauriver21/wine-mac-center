export const downloadFile = async (
  url: string,
  onProgress?: (args: { done: boolean; percent: number }) => void
): Promise<ArrayBuffer> => {
  const response = await fetch(url);

  if (!response.ok || !response.body) {
    throw new Error(`Failed to fetch file, status code: ${response.status}`);
  }

  const contentLength = response.headers.get('content-length');
  const total = contentLength ? parseInt(contentLength, 10) : undefined;

  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];
  let received = 0;
  let percent = 0;

  while (true) {
    const { done, value } = await reader.read();

    if (done) {
      onProgress?.({ done: true, percent });
      break;
    }

    if (value) {
      chunks.push(value);
      received += value.length;

      if (total && onProgress) {
        percent = Math.floor((received / total) * 100);
        onProgress({ done: false, percent });
      }
    }
  }

  // Merge all chunks into one ArrayBuffer
  const blob = new Blob(chunks);
  const buffer = await blob.arrayBuffer();
  return buffer;
};
