import { ConfigOrigin } from '@constants/enums';
import { EXECUTABLES_PATHS } from '@constants/paths';
import { DOWNLOADABLES_URLS, WINE_APPS_CONFIGS_URL } from '@constants/urls';
import { WineAppArgs } from '@interfaces/WineAppArgs';
import { WineAppConfig } from '@interfaces/WineAppConfig';
import { WineAppConfigIndex } from '@interfaces/WineAppConfigIndex';
import { buildAppUrls } from '@utils/buildAppUrls';
import { createDirectory } from '@utils/createDirectory';
import { dirExists } from '@utils/dirExists';
import { fileExists } from '@utils/fileExists';
import { parseJson } from '@utils/parseJson';
import { readDirectory } from '@utils/readDirectory';
import { readFileAsString } from '@utils/readFileAsString';
import { removeDirectory } from '@utils/removeDirectory';
import { useEnv } from '@utils/useEnv';
import { writeFile } from '@utils/writeFile';
import axios from 'axios';

export const useWineAppConfigApiClient = () => {
  const env = useEnv();
  const WINE_SCRIPTS_PATH = env.get().WINE_SCRIPTS_PATH;

  const writeScript = async (data: WineAppConfig) => {
    const SCRIPT_PATH = `${WINE_SCRIPTS_PATH}/${data.name}`;
    const config: WineAppConfig = {
      name: data.name,
      origin: data.origin,
      dxvkEnabled: data.dxvkEnabled || false,
      setupExecutableURL: '',
      engineVersion: data.engineVersion,
      winetricks: { verbs: [] },
      executables: [{ main: true, path: '', flags: '' }],
      pipelineScripts: data.pipelineScripts
    };

    await writeFile(`${SCRIPT_PATH}/index.json`, JSON.stringify(config));
    return config;
  };

  const readCloudFile = async (appName: string) => {
    const urls = buildAppUrls(appName);
    const { data: appConfig } = await axios.get<WineAppConfig>(urls.scriptURL);
    let setupExecutableURL = appConfig.setupExecutableURL || '';
    let setupExecutablePath = appConfig.setupExecutablePath || '';
    setupExecutableURL = DOWNLOADABLES_URLS[setupExecutableURL] || setupExecutableURL;
    setupExecutablePath = EXECUTABLES_PATHS[setupExecutablePath] || setupExecutablePath;
    return {
      ...appConfig,
      iconURL: urls.iconURL,
      artworkURL: urls.artworkURL,
      setupExecutableURL,
      setupExecutablePath
    };
  };

  const readScriptFile = (appName: string) => {
    const SCRIPT_FILE = `${WINE_SCRIPTS_PATH}/${appName}/index.json`;
    return new Promise<WineAppConfig | undefined>(async (resolve) => {
      let script = '';
      const hasScriptFile = await fileExists(SCRIPT_FILE);
      if (hasScriptFile) {
        script = await readFileAsString(SCRIPT_FILE);
        resolve(parseJson<WineAppConfig>(script));
      } else {
        resolve(undefined);
      }
    });
  };

  const read = async (args: WineAppArgs) => {
    if (args.appName === undefined) {
      throw new Error('Unable to read app config, application name is not defined');
    }

    switch (args.origin) {
      case ConfigOrigin.CLOUD:
        return readCloudFile(args.appName);
      case ConfigOrigin.SCRIPTS:
      default:
        return readScriptFile(args.appName);
    }
  };

  const listAll = async () => {
    const directories = await readDirectory(WINE_SCRIPTS_PATH);
    const promises: Array<Promise<WineAppConfig | undefined>> = [];
    let configs: WineAppConfig[] = [];

    for (const dir of directories) {
      promises.push(readScriptFile(dir));
    }

    configs = (await Promise.all(promises)).filter((item) => item !== undefined) as WineAppConfig[];

    const { data: cloudConfigs } = await axios.get<WineAppConfigIndex[]>(
      `${WINE_APPS_CONFIGS_URL}/index.json`
    );

    return [...configs, ...cloudConfigs];
  };

  const create = async (data: WineAppConfig) => {
    const SCRIPT_PATH = `${WINE_SCRIPTS_PATH}/${data.name}`;

    if ((await dirExists(SCRIPT_PATH)) === false) {
      await createDirectory(SCRIPT_PATH);
      return await writeScript(data);
    }

    return;
  };

  const update = async (data: WineAppConfig & { originalAppName: string }) => {
    const { originalAppName, name, ...rest } = data;
    const SCRIPT_PATH = `${WINE_SCRIPTS_PATH}/${originalAppName}`;
    const NEW_SCRIPT_PATH = `${WINE_SCRIPTS_PATH}/${name}`;
    const changedScriptName = name !== originalAppName;
    let config: WineAppConfig | undefined;

    if (await dirExists(SCRIPT_PATH)) {
      if (changedScriptName) {
        if ((await dirExists(NEW_SCRIPT_PATH)) === false) {
          await createDirectory(NEW_SCRIPT_PATH);
          config = await writeScript({ ...rest, name });
          await removeDirectory(SCRIPT_PATH, { recursive: true });
        }
      } else {
        config = await writeScript({ ...rest, name });
      }
    }

    return config;
  };

  const remove = async (appName: string) => {
    const SCRIPT_PATH = `${WINE_SCRIPTS_PATH}/${appName}`;
    await removeDirectory(SCRIPT_PATH, { recursive: true });
  };

  return {
    create,
    update,
    read,
    remove,
    listAll
  };
};
