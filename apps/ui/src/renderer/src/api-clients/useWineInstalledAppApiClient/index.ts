import { WINE_APP_CONFIG_JSON_PATH, WINE_APP_PIPELINE_JSON_PATH } from '@constants/paths';
import { WineAppConfig } from '@interfaces/WineAppConfig';
import { WineInstalledApp } from '@interfaces/WineInstalledApp';
import { fileExists } from '@utils/fileExists';
import { parseJson } from '@utils/parseJson';
import { readDirectory } from '@utils/readDirectory';
import { useEnv } from '@utils/useEnv';
import { readFileAsString } from '@utils/readFileAsString';
import { spawnProcess } from '@utils/spawnProcess';
import { WineAppPipelineConfig } from '@interfaces/WineAppPipelineConfig';
import { extractAppName } from '@utils/extractAppName';

export const useWineInstalledAppApiClient = () => {
  const env = useEnv();
  const WINE_APPS_PATH = env.get().WINE_APPS_PATH;

  const listAll = async () => {
    const directories = await readDirectory(WINE_APPS_PATH);
    const promises: Array<
      Promise<{ appPath: string; appName: string; config: string; pipeline: string } | undefined>
    > = [];
    let configs: Array<WineInstalledApp> = [];

    for (const dir of directories) {
      const APP_PATH = `${WINE_APPS_PATH}/${dir}`;
      const CONFIG_FILE = `${APP_PATH}/${WINE_APP_CONFIG_JSON_PATH}`;
      const PIPELINE_FILE = `${APP_PATH}/${WINE_APP_PIPELINE_JSON_PATH}`;
      const promise = new Promise<
        { appPath: string; appName: string; config: string; pipeline: string } | undefined
      >(async (resolve) => {
        let config = '';
        let pipeline = '';
        const hasConfigFile = await fileExists(CONFIG_FILE);
        const hasPipelineFile = await fileExists(PIPELINE_FILE);

        if (hasConfigFile) {
          config = await readFileAsString(CONFIG_FILE);
        }

        if (hasPipelineFile) {
          pipeline = await readFileAsString(PIPELINE_FILE);
        }

        if (!hasConfigFile) {
          resolve(undefined);
        }

        resolve({ appPath: APP_PATH, appName: extractAppName(APP_PATH) || '', config, pipeline });
      });
      promises.push(promise);
    }

    configs = (await Promise.all(promises))
      .filter((item) => item !== undefined)
      .filter((item) => item.appName !== '')
      .map((item) => ({
        ...item,
        config: { ...parseJson<WineAppConfig>(item?.config), name: item.appName },
        pipeline: parseJson<WineAppPipelineConfig>(item?.pipeline)
      }))
      .map((item) => ({
        ...item.config,
        appPath: item.appPath,
        pipeline: item.pipeline
      })) as WineInstalledApp[];

    return configs;
  };

  const runApp = (appPath: string) => {
    return spawnProcess(`open "${appPath}"`);
  };

  const killApp = (pid: number) => {
    return spawnProcess(`kill ${pid}`);
  };

  return {
    listAll,
    runApp,
    killApp
  };
};
