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
import { useEnv } from '@utils/useEnv';
import { writeFile } from '@utils/writeFile';
import axios from 'axios';

export const useWineAppConfigApiClient = () => {
  const env = useEnv();
  const WINE_SCRIPTS_PATH = env.get().WINE_SCRIPTS_PATH;
  const INDEX_PATH = `${WINE_SCRIPTS_PATH}/index.json`;

  const writeIndex = async (data: Array<WineAppConfigIndex>) =>
    writeFile(INDEX_PATH, JSON.stringify(data));

  const initIndex = async () => {
    if ((await fileExists(INDEX_PATH)) === false) {
      await writeIndex([]);
    }
  };

  const getIndex = async () => {
    return parseJson<Array<WineAppConfigIndex>>(await readFileAsString(INDEX_PATH));
  };

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

    writeFile(`${SCRIPT_PATH}/index.json`, JSON.stringify(config));
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
    await initIndex();
    let index = (await getIndex()) || [];
    const SCRIPT_PATH = `${WINE_SCRIPTS_PATH}/${data.name}`;
    index = [
      ...index,
      {
        name: data.name,
        origin: ConfigOrigin.SCRIPTS
      }
    ];
    await writeIndex(index);

    if ((await dirExists(SCRIPT_PATH)) === false) {
      await createDirectory(SCRIPT_PATH);
      await writeScript(data);
    }
  };

  return {
    create,
    read,
    listAll
  };
};
