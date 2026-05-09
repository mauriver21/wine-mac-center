import axios, { AxiosResponse } from 'axios';

const BYPASS_STATUS_CODES = [405];

export async function isDownloadableURL(url: string): Promise<boolean> {
  try {
    // First try a HEAD request
    let response: AxiosResponse;

    response = await axios.head<AxiosResponse>(url, {
      validateStatus: () => true
    });

    if (BYPASS_STATUS_CODES.includes(response.status)) {
      response = await axios.get(url, {
        headers: {
          Range: 'bytes=0-0'
        },
        responseType: 'stream',
        validateStatus: () => true
      });
    }

    const statusOk = response.status === 200 || response.status === 206;

    const contentDisposition = response.headers['content-disposition'] ?? '';
    const isAttachment = contentDisposition.includes('attachment');

    const contentType = response.headers['content-type'] ?? '';
    const isDownloadableType =
      contentType.startsWith('application/') ||
      contentType === 'binary/octet-stream' ||
      contentType.includes('zip') ||
      contentType.includes('octet-stream');

    return statusOk && (isAttachment || isDownloadableType);
  } catch (error) {
    return false;
  }
}
