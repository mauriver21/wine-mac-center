import plist from 'plist';
import { v4 as uuid } from 'uuid';
import { BashScript } from '@interfaces/BashScript';
import { SpawnProcessArgs } from '@interfaces/SpawnProcessArgs';
import { WineAppConfig } from '@interfaces/WineAppConfig';
import { WineAppExecutable } from '@interfaces/WineAppExecutable';
import { WinetricksOptions } from '@interfaces/WinetricksOptions';
import { buildEnvExports } from '@utils/buildEnvExports';
import { dirExists } from '@utils/dirExists';
import { downloadFile } from '@utils/downloadFile';
import { fileExists } from '@utils/fileExists';
import { createEnv } from '@utils/createEnv';
import { FileName } from '@constants/enums';
import { spawnProcess as baseSpawnProcess } from '@utils/spawnProcess';
import { writeFile } from '@utils/writeFile';
import { createWineEngineApiClient } from '@api-clients/createWineEngineApiClient';
import { readFileAsString } from '@utils/readFileAsString';
import { createDirectory } from '@utils/createDirectory';
import { execCommand as baseExecCommand } from '@utils/execCommand';
import { writeBinaryFile } from '@utils/writeBinaryFile';
import { isURL } from '@utils/isURL';
import { AppExecutable } from '@interfaces/AppExecutable';

export const createWineApp = async (appName: string) => {
  const env = createEnv();
  const wineEngineApiClient = createWineEngineApiClient();
  const SCRIPTS_PATH = env.get().SCRIPTS_PATH;

  let appConfig: WineAppConfig = {
    id: '',
    appId: uuid(),
    name: appName,
    engineVersion: '',
    engineURLs: [],
    setupExecutablePath: '',
    iconURL: '',
    dxvkEnabled: false
  };
  let WINE_EXPORTS = '';
  const ENV_EXPORTS = env.getEnvExports();

  const WINE_ENV = {
    get WINE_APP_NAME() {
      return appConfig.name;
    },
    get WINE_ENGINE_VERSION() {
      return appConfig.engineVersion || '';
    },
    get WINE_APP_PATH() {
      return `${env.get().HOME}/Wine/apps/${WINE_ENV.WINE_APP_NAME}.app`;
    },
    get WINE_ENGINES_PATH() {
      return env.get().WINE_ENGINES_PATH;
    },
    get WINE_TMP_PATH() {
      return env.get().WINE_TMP_PATH;
    },
    get WINE_LIBS_PATH() {
      return env.get().WINE_LIBS_PATH;
    },
    get WINE_APP_CONTENTS_PATH() {
      return `${WINE_ENV.WINE_APP_PATH}/Contents`;
    },
    get WINE_APP_RESOURCES_PATH() {
      return `${WINE_ENV.WINE_APP_CONTENTS_PATH}/Resources`;
    },
    get WINE_CONFIG_APP_NAME() {
      return 'Config';
    },
    get WINE_CONFIG_APP_PATH() {
      return `${WINE_ENV.WINE_APP_PATH}/${WINE_ENV.WINE_CONFIG_APP_NAME}.app`;
    },
    get WINE_CONFIG_APP_RESOURCES_PATH() {
      return `${WINE_ENV.WINE_CONFIG_APP_PATH}/Contents/Resources`;
    },
    get WINE_APP_SCRIPTS_PATH() {
      return `${WINE_ENV.WINE_CONFIG_APP_RESOURCES_PATH}/bash`;
    },
    get WINE_APP_DATA_PATH() {
      return `${WINE_ENV.WINE_CONFIG_APP_RESOURCES_PATH}/data`;
    },
    get WINE_APP_CONFIG_JSON_PATH() {
      return `${WINE_ENV.WINE_APP_DATA_PATH}/config.json`;
    },
    get WINE_APP_SHARED_SUPPORT_PATH() {
      return `${WINE_ENV.WINE_APP_CONTENTS_PATH}/SharedSupport`;
    },
    get WINE_APP_PREFIX_PATH() {
      return `${WINE_ENV.WINE_APP_SHARED_SUPPORT_PATH}/prefix`;
    },
    get WINE_APP_DRIVE_C_PATH() {
      return `${WINE_ENV.WINE_APP_PREFIX_PATH}/drive_c`;
    }
  };

  /**
   * Read app config file.
   */
  const readAppConfig = async (): Promise<WineAppConfig> => {
    const path = WINE_ENV.WINE_APP_CONFIG_JSON_PATH;

    if (await fileExists(path)) {
      return JSON.parse(await readFileAsString(path)) as WineAppConfig;
    } else {
      return appConfig;
    }
  };

  const getAppConfig = () => appConfig;

  const updateAppConfig = async (
    data: Partial<WineAppConfig>,
    options = { writeAppConfig: true }
  ) => {
    appConfig = { ...appConfig, ...data };
    options.writeAppConfig && (await writeAppConfig(appConfig));
    buildWineEnvExports();
  };

  /**
   * Build wine environment variables exports.
   */
  const buildWineEnvExports = () => {
    WINE_EXPORTS = buildEnvExports(WINE_ENV, (envName) =>
      Boolean(envName.match(/(^WINE)/gi)?.length)
    );
  };

  /**
   * Logic for creating the wine application structure.
   */
  const scaffold = async (
    params: {
      appIconURL?: string;
      appIconFile?: ArrayBuffer;
      appArtWorkFile?: ArrayBuffer;
    },
    args?: SpawnProcessArgs
  ) => {
    const { stdOut, stdErr } = await execScript('buildUniqueAppName');
    if (stdErr) throw new Error(stdErr);
    if (appName != stdOut) {
      appName = stdOut.trim();
      await updateAppConfig({ name: appName }, { writeAppConfig: false });
    }
    return spawnScript('scaffoldApp', '', {
      ...args,
      onExit: async (data) => {
        await args?.onExit?.(data);
        await updateAppConfig({ name: appName });
        await setupAppIcon(params);
        await setupAppArtwork(params);
      }
    });
  };

  const setupAppIcon = async (params: { appIconURL?: string; appIconFile?: ArrayBuffer }) => {
    try {
      let file = params.appIconFile;

      if (params?.appIconURL) {
        file = await downloadFile(params?.appIconURL);
      }

      if (file === undefined) throw new Error('No icon file provided');

      writeBinaryFile(`${WINE_ENV.WINE_APP_RESOURCES_PATH}/${FileName.CFBundleIconFile}`, file);
    } catch (error) {
      console.error(error);
    }
  };

  const setupAppArtwork = async (params: { appArtWorkFile?: ArrayBuffer }) => {
    try {
      const file = params.appArtWorkFile;
      if (file === undefined) return;
      writeBinaryFile(`${WINE_ENV.WINE_APP_RESOURCES_PATH}/header.jpeg`, file);
    } catch (error) {
      console.error(error);
    }
  };

  const downloadWineEngine = async (urls: string[], version: string, args?: SpawnProcessArgs) => {
    try {
      const engineTmpFolder = `${WINE_ENV.WINE_TMP_PATH}/${version}`;
      let fileNamePart = '';

      for (const url of urls) {
        const fileName = url.split('/').pop();

        if (!fileName) throw new Error('Invalid engine file name');
        fileNamePart = fileNamePart || fileName;

        if (!(await dirExists(engineTmpFolder))) {
          createDirectory(engineTmpFolder);
        }

        const file = await downloadFile(url);
        await writeBinaryFile(`${WINE_ENV.WINE_TMP_PATH}/${version}/${fileName}`, file);
      }

      return spawnScript(
        'joinWineEngine',
        `${engineTmpFolder}/${fileNamePart} ${WINE_ENV.WINE_ENGINES_PATH}`,
        args
      );
    } catch (error) {
      console.error(error);
      return;
    }
  };

  /**
   * Logic for extracting the wine engine.
   */
  const extractEngine = async (version: string, args?: SpawnProcessArgs) => {
    await updateAppConfig({ engineVersion: version });
    return spawnScript('extractWineEngine', '', args);
  };

  /**
   * Initializes the wine prefix.
   */
  const wineboot = async (flags = '', args?: SpawnProcessArgs) => {
    return spawnScript('wineboot', flags, args);
  };

  /**
   * Builds the wine env source by using the env.sh script.
   */
  const wineEnvSource = () => `source "${SCRIPTS_PATH}/env.sh";`;

  /**
   * Winetrick
   */
  const winetrick = (
    verbs: string,
    processArgs?: SpawnProcessArgs,
    options?: WinetricksOptions
  ) => {
    const flags = winetricksOptionsToFlags(options);
    return spawnScript('winetrick', `${flags} ${verbs}`, processArgs);
  };

  /**
   * Search provided executable.
   */
  const setSetupExe = async (exePath: string) => {
    const fileName = exePath.split('/').pop();

    if (fileName === undefined) throw new Error('Invalid filename');

    if (isURL(exePath)) {
      const fileURL = exePath;
      exePath = `${WINE_ENV.WINE_TMP_PATH}/${fileName}`;
      if ((await fileExists(exePath)) === false) {
        try {
          writeBinaryFile(exePath, await downloadFile(fileURL));
        } catch (error) {
          console.error(error);
        }
      }
    }

    //TODO: logic to detect if fileURL is down
    updateAppConfig({ setupExecutablePath: exePath });
  };

  /**
   * Run executable with wine.
   */
  const runExe = (args: string, processArgs?: SpawnProcessArgs) => {
    return spawnScript('wine', `WINDOWS_EXE ${args.replace(/( |\\ )/g, '\\ ')}`, processArgs);
  };

  /**
   * Run winecfg.
   */
  const winecfg = (processArgs?: SpawnProcessArgs) => {
    return spawnScript('winecfg', '', processArgs);
  };

  /**
   * Run regedit.
   */
  const regedit = (processArgs?: SpawnProcessArgs) => {
    return spawnScript('regedit', '', processArgs);
  };

  /**
   * Run taskmgr.
   */
  const taskmgr = (processArgs?: SpawnProcessArgs) => {
    return spawnScript('taskmgr', '', processArgs);
  };

  /**
   * Run cmd.
   */
  const cmd = (processArgs?: SpawnProcessArgs) => {
    return spawnScript('cmd', '', processArgs);
  };

  /**
   * Run control.
   */
  const control = (processArgs?: SpawnProcessArgs) => {
    return spawnScript('control', '', processArgs);
  };

  /**
   * Write app config.json in disk.
   */
  const writeAppConfig = async (appConfig: Partial<WineAppConfig>) => {
    const updatedAppConfig = { ...(await readAppConfig()), ...appConfig };
    await writeFile(WINE_ENV.WINE_APP_CONFIG_JSON_PATH, JSON.stringify(updatedAppConfig));
  };

  /**
   * Run executable with wine
   */
  const bundleApp = async (
    params: { executables: WineAppExecutable[]; configId: string },
    args?: SpawnProcessArgs
  ) => {
    const { executables, configId } = params;
    await updateAppConfig({
      executables,
      id: configId
    });

    const mainExecutable = executables.find((item) => item.main === true);
    const infoPlistXML = plist
      .build({
        CFBundleExecutable: FileName.CFBundleExecutable,
        CFBundleIconFile: FileName.CFBundleIconFile
      })
      .replace(/\n/gi, '');

    const exePath = mainExecutable!.path.replace(/\n/gi, '');

    return spawnScript('bundleApp', '', {
      ...args,
      action: {
        type: 'stdIn',
        data: `${infoPlistXML}\n ${exePath}\n`
      }
    });
  };

  /**
   * List app executables
   */
  const listAppExecutables = async (): Promise<AppExecutable[]> => {
    const { stdOut } = await execScript('listAppExecutables');

    return (
      stdOut.split('\n').map((item) => ({
        path: item.split('SharedSupport/prefix').pop() || '',
        name: item.split('/').pop() || ''
      })) || []
    );
  };

  /**
   * Updates main executable path.
   */
  const updateMainExecutablePath = async (path: string) => {
    const config = getAppConfig();
    const executables = config.executables?.map((item) => {
      if (item.main) {
        return { ...item, path };
      }
      return item;
    });
    await updateAppConfig({ executables });
  };

  /**
   * Updates main executable flags.
   */
  const updateMainExecutableFlags = async (flags: string) => {
    const config = getAppConfig();
    const executables = config.executables?.map((item) => {
      if (item.main) {
        return { ...item, flags };
      }
      return item;
    });
    await updateAppConfig({ executables });
  };

  /**
   * Transform winetricks options into flags.
   */
  const winetricksOptionsToFlags = (options?: WinetricksOptions) => {
    options = { unattended: true, force: true, ...options };
    let flags = '';
    if (options?.unattended) flags += '--unattended ';
    if (options?.force) flags += '--force ';

    return `"${flags}"`;
  };

  /**
   * Bash scripts source.
   */
  const s = (cmd: string) => `${ENV_EXPORTS} ${WINE_EXPORTS} ${wineEnvSource()} ${cmd}`;

  const execScript = (name: BashScript, args: string = '') =>
    execCommand(s(`"${SCRIPTS_PATH}/${name}.sh" ${args}`));

  const spawnScript = (name: BashScript, scriptArgs: string = '', processArgs?: SpawnProcessArgs) =>
    spawnProcess(s(`"${SCRIPTS_PATH}/${name}.sh" ${scriptArgs}`), processArgs);

  const execCommand: typeof baseExecCommand = (command) => baseExecCommand(s(command));

  const spawnProcess = (command: string, args?: SpawnProcessArgs) =>
    baseSpawnProcess(s(command), args);

  const getWineEnv = () => WINE_ENV;

  /**
   * Initialize wine env exports.
   */
  buildWineEnvExports();

  /**
   * Initialize app config.
   */
  appConfig = { ...(await readAppConfig()), name: appName };

  return {
    execCommand,
    execScript,
    getWineEnv,
    scaffold,
    spawnProcess,
    spawnScript,
    listWineEngines: wineEngineApiClient.list,
    downloadWineEngine,
    extractEngine,
    wineboot,
    winecfg,
    regedit,
    taskmgr,
    cmd,
    control,
    winetrick,
    runExe,
    setSetupExe,
    bundleApp,
    setupAppArtwork,
    setupAppIcon,
    listAppExecutables,
    getAppConfig,
    updateMainExecutablePath,
    updateMainExecutableFlags
  };
};
