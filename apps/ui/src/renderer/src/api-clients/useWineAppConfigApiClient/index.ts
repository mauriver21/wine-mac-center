import { ConfigOrigin, FileName } from '@constants/enums';
import { EXECUTABLES_PATHS } from '@constants/paths';
import { DOWNLOADABLES_URLS, WINE_APPS_CONFIGS_URL } from '@constants/urls';
import { WineAppArgs } from '@interfaces/WineAppArgs';
import { WineAppConfig } from '@interfaces/WineAppConfig';
import { WineAppConfigIndex } from '@interfaces/WineAppConfigIndex';
import { createDirectory } from '@utils/createDirectory';
import { dirExists } from '@utils/dirExists';
import { encodeURL } from '@utils/encodeURL';
import { fileExists } from '@utils/fileExists';
import { parseJson } from '@utils/parseJson';
import { readDirectory } from '@utils/readDirectory';
import { readFileAsString } from '@utils/readFileAsString';
import { removeDirectory } from '@utils/removeDirectory';
import { useEnv } from '@hooks/useEnv';
import { writeFile } from '@utils/writeFile';
import { v4 as uuid } from 'uuid';
import axios from 'axios';
import { createObjectURL } from '@utils/createObjectURL';
import { writeBinaryFile } from '@utils/writeBinaryFile';
import { renameDirectory } from '@utils/renameDirectory';
import { DEFAULT_WINETRICKS_VERSION } from '@constants/constants';
import { blobUrlToFile } from '@utils/blobUrlToFile';

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
      winetricks: {
        verbs: data.winetricks?.verbs || [],
        version: data.winetricks?.version || DEFAULT_WINETRICKS_VERSION
      },
      executables: [{ main: true, path: '', flags: '' }],
      pipelineScripts: data.pipelineScripts
    };

    await writeFile(`${SCRIPT_PATH}/index.json`, JSON.stringify(config));
    return config;
  };

  const buildAppUrls = (args: {
    appName: string | undefined;
    origin: ConfigOrigin | undefined;
  }) => {
    const { appName, origin } = args;

    switch (origin) {
      case ConfigOrigin.CLOUD: {
        const ASSETS_URL = `${WINE_APPS_CONFIGS_URL}/${appName}`;
        return {
          artworkURL: encodeURL(`${ASSETS_URL}/header.jpeg`),
          iconURL: encodeURL(`${ASSETS_URL}/icon.icns?cache=${uuid()}`),
          launcherImgURL: encodeURL(`${ASSETS_URL}/launcher.jpeg`),
          scriptURL: encodeURL(`${ASSETS_URL}/index.json`)
        };
      }
      case ConfigOrigin.SCRIPTS: {
        const SCRIPT_PATH = `${env.get().WINE_SCRIPTS_PATH}/${appName}`;
        return {
          artworkURL: encodeURL(`${SCRIPT_PATH}/header.jpeg`),
          iconURL: encodeURL(`${SCRIPT_PATH}/icon.icns`),
          launcherImgURL: encodeURL(`${SCRIPT_PATH}/launcher.jpeg`),
          scriptURL: encodeURL(`${SCRIPT_PATH}/index.json`)
        };
      }
      default:
        return;
    }
  };

  const readCloudFile = async (appName: string) => {
    const urls = buildAppUrls({ appName, origin: ConfigOrigin.CLOUD });
    if (urls === undefined) throw Error('Failed to build app urls');
    const { data: appConfig } = await axios.get<WineAppConfig>(urls.scriptURL);
    console.log(urls);
    if (appConfig?.name === undefined) throw Error('Failed to download script');
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
    const urls = buildAppUrls({ appName, origin: ConfigOrigin.SCRIPTS });

    return new Promise<WineAppConfig | undefined>(async (resolve) => {
      let script = '';
      let hasIcon = false;
      let hasArtwork = false;
      let hasLauncherImg = false;
      const hasScriptFile = await fileExists(SCRIPT_FILE);

      if (urls?.iconURL) {
        hasIcon = await fileExists(urls?.iconURL);
      }

      if (urls?.artworkURL) {
        hasArtwork = await fileExists(urls?.artworkURL);
      }

      if (urls?.launcherImgURL) {
        hasLauncherImg = await fileExists(urls?.launcherImgURL);
      }

      if (hasScriptFile) {
        script = await readFileAsString(SCRIPT_FILE);
        const wineAppConfig = parseJson<WineAppConfig>(script);

        resolve(
          wineAppConfig
            ? {
                ...wineAppConfig,
                artworkURL: hasArtwork ? await createObjectURL(urls?.artworkURL) : undefined,
                iconURL: hasIcon ? await createObjectURL(urls?.iconURL) : undefined,
                launcherImgURL: hasLauncherImg
                  ? await createObjectURL(urls?.launcherImgURL)
                  : undefined
              }
            : undefined
        );
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

    const { data: configsIndexes } = await axios.get<WineAppConfigIndex[]>(
      `${WINE_APPS_CONFIGS_URL}/index.json`
    );

    for (const dir of directories) {
      if (dir == '.DS_Store') continue;
      promises.push(readScriptFile(dir));
    }

    let cloudConfigs: WineAppConfig[] = [];

    for (const configIndex of configsIndexes) {
      const urls = buildAppUrls({ appName: configIndex.name, origin: ConfigOrigin.CLOUD });
      cloudConfigs = [
        ...cloudConfigs,
        { ...configIndex, artworkURL: urls?.artworkURL, iconURL: urls?.iconURL }
      ];
    }

    configs = (await Promise.all(promises)).filter(
      (item) => item !== undefined || item !== ''
    ) as WineAppConfig[];

    return [...configs, ...cloudConfigs];
  };

  const create = async (data: WineAppConfig) => {
    const { iconFile, artworkFile, launcherImgFile, name, ...restData } = data;
    const SCRIPT_PATH = `${WINE_SCRIPTS_PATH}/${name}`;

    if ((await dirExists(SCRIPT_PATH)) === false) {
      await createDirectory(SCRIPT_PATH);
      iconFile && (await saveScriptIconFile(name, iconFile));
      artworkFile && (await saveScriptArtworkFile(name, artworkFile));
      launcherImgFile && (await saveScriptLauncherImageFile(name, launcherImgFile));
      return await writeScript({ name, ...restData });
    } else {
      throw new Error('App config already exists.');
    }
  };

  const saveScriptIconFile = (appName: string, file: ArrayBuffer) => {
    const SCRIPT_PATH = `${WINE_SCRIPTS_PATH}/${appName}`;
    return writeBinaryFile(`${SCRIPT_PATH}/${FileName.CFBundleIconFile}`, file);
  };

  const saveScriptArtworkFile = (appName: string, file: ArrayBuffer) => {
    const SCRIPT_PATH = `${WINE_SCRIPTS_PATH}/${appName}`;
    return writeBinaryFile(`${SCRIPT_PATH}/header.jpeg`, file);
  };

  const saveScriptLauncherImageFile = (appName: string, file: ArrayBuffer) => {
    const SCRIPT_PATH = `${WINE_SCRIPTS_PATH}/${appName}`;
    return writeBinaryFile(`${SCRIPT_PATH}/launcher.jpeg`, file);
  };

  const update = async (data: WineAppConfig & { originalAppName: string }) => {
    const { originalAppName, name, iconFile, artworkFile, launcherImgFile, ...rest } = data;
    const SCRIPT_PATH = `${WINE_SCRIPTS_PATH}/${originalAppName}`;
    const NEW_SCRIPT_PATH = `${WINE_SCRIPTS_PATH}/${name}`;
    const changedScriptName = name !== originalAppName;
    let config: WineAppConfig | undefined;

    if (await dirExists(SCRIPT_PATH)) {
      if (changedScriptName) {
        if ((await dirExists(NEW_SCRIPT_PATH)) === false) {
          await renameDirectory(SCRIPT_PATH, NEW_SCRIPT_PATH);
          config = await writeScript({ ...rest, name });
        }
      } else {
        config = await writeScript({ ...rest, name });
      }

      iconFile && (await saveScriptIconFile(name, iconFile));
      artworkFile && (await saveScriptArtworkFile(name, artworkFile));
      launcherImgFile && (await saveScriptLauncherImageFile(name, launcherImgFile));
    }

    return config;
  };

  const remove = async (appName: string) => {
    const SCRIPT_PATH = `${WINE_SCRIPTS_PATH}/${appName}`;
    await removeDirectory(SCRIPT_PATH, { recursive: true });
  };

  const downloadScript = async (appName: string) => {
    const { artworkURL, iconURL, ...rest } = await readCloudFile(appName);
    console.log(rest);
    return create({
      ...rest,
      origin: ConfigOrigin.SCRIPTS,
      ...(artworkURL
        ? { artworkFile: await (await blobUrlToFile(artworkURL, '')).arrayBuffer() }
        : {}),
      ...(iconURL ? { iconFile: await (await blobUrlToFile(iconURL, '')).arrayBuffer() } : {})
    });
  };

  return {
    create,
    update,
    read,
    remove,
    listAll,
    downloadScript
  };
};
