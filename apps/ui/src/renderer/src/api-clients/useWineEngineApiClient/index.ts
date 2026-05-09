import { WINE_APPS_ENGINES_URL } from '@constants/urls';
import { axiosWineEngines } from '@utils/axiosWineEngines';
import { v4 as uuid } from 'uuid';
import { createWineEngineApiClient } from '@api-clients/createWineEngineApiClient';
import { useEnv } from '@hooks/useEnv';
import { dirExists } from '@utils/dirExists';
import { createDirectory } from '@utils/createDirectory';
import { downloadFile } from '@utils/downloadFile';
import { writeBinaryFile } from '@utils/writeBinaryFile';
import { spawnProcess } from '@utils/spawnProcess';
import { ExitCode } from '@constants/enums';
import { spawnLog } from '@utils/spawnLog';

export const useWineEngineApiClient = () => {
  const env = useEnv();
  const { list } = createWineEngineApiClient();

  const listDownloadables = async () => {
    const { data } = await axiosWineEngines.get<{
      engines: Array<{
        version: string;
        parts: string[];
      }>;
    }>(`/index.json?nocache=${uuid()}`);

    return data.engines.map((item) => ({
      ...item,
      urls: item.parts.map((part) => `${WINE_APPS_ENGINES_URL}/${item.version}/${part}`)
    }));
  };

  const downloadWineEngine = async (urls: string[], version: string) => {
    const { SCRIPTS_PATH, WINE_TMP_PATH, WINE_ENGINES_PATH } = env.get();
    const engineTmpFolder = `${WINE_TMP_PATH}/${version.trim() || 'NO_VERSION'}`;
    let fileNamePart = '';

    for (const url of urls) {
      const fileName = url.split('/').pop();

      if (!fileName) throw new Error('Invalid engine file name');
      fileNamePart = fileNamePart || fileName;

      if (!(await dirExists(engineTmpFolder))) {
        createDirectory(engineTmpFolder);
      }

      const file = await downloadFile(url);
      await writeBinaryFile(`${WINE_TMP_PATH}/${version}/${fileName}`, file);
    }

    return new Promise((resolve, reject) => {
      spawnProcess(
        `"${SCRIPTS_PATH}/joinWineEngine.sh" "${engineTmpFolder}/${fileNamePart}" "${WINE_ENGINES_PATH}"`,
        {
          ...spawnLog,
          onExit: (data) => {
            if (data === ExitCode.SuccessfulExecution) {
              resolve(undefined);
            } else {
              reject(data);
            }
          }
        }
      );
    });
  };

  return {
    downloadWineEngine,
    list,
    listDownloadables
  };
};
