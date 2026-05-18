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
import { ConfigOrigin, FileName } from '@constants/enums';
import { spawnProcess as baseSpawnProcess } from '@utils/spawnProcess';
import { writeFile } from '@utils/writeFile';
import { readFileAsString } from '@utils/readFileAsString';
import { createDirectory } from '@utils/createDirectory';
import { execCommand as baseExecCommand } from '@utils/execCommand';
import { writeBinaryFile } from '@utils/writeBinaryFile';
import { isURL } from '@utils/isURL';
import { AppExecutable } from '@interfaces/AppExecutable';
import { spawnLog } from '@utils/spawnLog';

export const createWineApp = async (appName: string, config?: WineAppConfig) => {
  const env = createEnv();
  const SCRIPTS_PATH = env.get().SCRIPTS_PATH;
  const WINE_DOWNLOADS_PATH = env.get().WINE_DOWNLOADS_PATH;
  const { name: _, ...restConfig } = config || {};

  let appConfig: WineAppConfig = {
    name: appName,
    origin: ConfigOrigin.SCRIPTS,
    engineVersion: '',
    engineURLs: [],
    setupExecutablePath: '',
    iconURL: '',
    dxvkEnabled: false,
    ...restConfig
  };
  let WINE_EXPORTS = '';
  const ENV_EXPORTS = env.getEnvExports();

  const WINE_ENV = {
    get WINE_APP_NAME() {
      return env.get().APP_NAME || appConfig.name;
    },
    get WINE_ENGINE_VERSION() {
      return appConfig.engineVersion || '';
    },
    get WINE_APP_PATH() {
      const BASE_PATH = env.get().APPLICATION_DIR_PATH || env.get().WINE_APPS_PATH;
      return `${BASE_PATH}/${WINE_ENV.WINE_APP_NAME}.app`;
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
    get WINE_APP_SCRIPTS_PATH() {
      return `${WINE_ENV.WINE_APP_RESOURCES_PATH}/bash`;
    },
    get WINE_APP_DATA_PATH() {
      return `${WINE_ENV.WINE_APP_RESOURCES_PATH}/data`;
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
    },
    get WINE_APP_PROGRAM_FILES() {
      return `${WINE_ENV.WINE_APP_DRIVE_C_PATH}/Program Files`;
    },
    get WINE_APP_PROGRAM_FILES_X86() {
      return `${WINE_ENV.WINE_APP_DRIVE_C_PATH}/Program Files (x86)`;
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

  const updateAppLauncherConfig = (data: Partial<WineAppConfig['launcherConfig']>) => {
    appConfig = { ...appConfig, launcherConfig: { ...appConfig?.launcherConfig, ...data } };
    return writeAppConfig(appConfig);
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
      appArtWorkURL?: string;
      launcherImgURL?: string;
      appIconFile?: ArrayBuffer;
      appArtWorkFile?: ArrayBuffer;
      launcherImgFile?: ArrayBuffer;
    },
    args?: SpawnProcessArgs
  ) => {
    return spawnScript('scaffoldApp', '', {
      ...args,
      onExit: async (data) => {
        args?.onExit?.(data);
        await updateAppConfig({ name: appName });
        await saveAppIcon(params);
        await saveAppArtwork(params);
        await saveAppLauncherImg(params);
        spawnScript('refreshPlist', '', {
          ...args,
          ...spawnLog,
          onExit: async (data) => {
            console.log(data);
            args?.onExit?.(data);
          }
        });
      }
    });
  };

  const saveAppIcon = async (params: { appIconURL?: string; appIconFile?: ArrayBuffer }) => {
    try {
      let file = params.appIconFile;

      if (params?.appIconURL) {
        file = await downloadFile(params?.appIconURL);
      }

      if (file === undefined) throw new Error('No icon file provided');

      const ICON_PATH = `${WINE_ENV.WINE_APP_RESOURCES_PATH}/${FileName.CFBundleIconFile}`;
      writeBinaryFile(ICON_PATH, file);
      const result = await execScript('imageToIcns', `"${ICON_PATH}"`);
      console.log(result);
    } catch (error) {
      console.error(error);
    }
  };

  const saveAppArtwork = async (params: {
    appArtWorkURL?: string;
    appArtWorkFile?: ArrayBuffer;
  }) => {
    try {
      let file = params.appArtWorkFile;

      if (params?.appArtWorkURL) {
        file = await downloadFile(params?.appArtWorkURL);
      }

      if (file === undefined) return;
      writeBinaryFile(`${WINE_ENV.WINE_APP_RESOURCES_PATH}/header.jpeg`, file);
    } catch (error) {
      console.error(error);
    }
  };

  const saveAppLauncherImg = async (params: {
    launcherImgURL?: string;
    launcherImgFile?: ArrayBuffer;
  }) => {
    try {
      let file = params.launcherImgFile;

      if (params?.launcherImgURL) {
        file = await downloadFile(params?.launcherImgURL);
      }

      if (file === undefined) return;
      writeBinaryFile(`${WINE_ENV.WINE_APP_RESOURCES_PATH}/launcher.jpeg`, file);
    } catch (error) {
      console.error(error);
    }
  };

  const downloadWineEngine = async (urls: string[], version: string, args?: SpawnProcessArgs) => {
    try {
      const engineTmpFolder = `${WINE_ENV.WINE_TMP_PATH}/${version.trim() || 'NO_VERSION'}`;
      let fileNamePart = '';

      for (const url of urls) {
        const fileName = url.split('/').pop();

        if (!fileName) throw new Error('Invalid engine file name');
        fileNamePart = fileNamePart || fileName;

        if (!(await dirExists(engineTmpFolder))) {
          createDirectory(engineTmpFolder, { recursive: true });
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
   * Handles special winetricks verbs that may never terminate by themselves.
   */
  const winetrickKillVerbHandler = (args: {
    verb: string;
    data: string;
    processArgs?: SpawnProcessArgs;
    ref: { killWinetrick: boolean };
  }) => {
    const { verb, data, processArgs, ref } = args;

    switch (verb) {
      case 'dotnet462':
        if (data.includes('Using native override for following DLLs: mscorwks')) {
          ref.killWinetrick = true;
          killWinetricks({ processArgs });
        }
        break;
      case 'dotnet472':
        if (data.includes('Using native override for following DLLs: mscorwks')) {
          ref.killWinetrick = true;
          killWinetricks({ processArgs });
        }
        break;
      case 'dotnet48':
        if (data.includes('load_remove_mono internal')) {
          ref.killWinetrick = true;
        }
        break;
      default:
        break;
    }

    if (ref.killWinetrick) {
      killWinetricks({ processArgs });
    }
  };

  /**
   * Kill winetricks process
   */
  const killWinetricks = (options?: { force?: boolean; processArgs?: SpawnProcessArgs }) => {
    const force = options?.force ? '-f' : '';
    return spawnScript('killWinetricks', `${force}`, options?.processArgs);
  };

  /**
   * Winetrick
   */
  const winetrick = (
    args: { verb: string; version: string },
    processArgs?: SpawnProcessArgs,
    options?: WinetricksOptions
  ) => {
    const { verb, version } = args;
    const flags = winetricksOptionsToFlags(options);
    const ref = { killWinetrick: false };
    return spawnScript('winetrick', `${flags} ${verb} ${version}`, {
      onStdOut: (data) => {
        winetrickKillVerbHandler({ verb, data, processArgs, ref });
        processArgs?.onStdOut?.(data);
      },
      onStdErr: (data) => {
        winetrickKillVerbHandler({ verb, data, processArgs, ref });
        processArgs?.onStdErr?.(data);
      },
      onExit: (data) => {
        !ref.killWinetrick && processArgs?.onExit?.(data);
      }
    });
  };

  /**
   * Search provided executable.
   */
  const setSetupExe = async (exePath: string, processArgs?: SpawnProcessArgs) => {
    const fileName = exePath.split('/').pop();

    if (fileName === undefined) throw new Error('Invalid filename');

    if (isURL(exePath)) {
      const fileURL = exePath;
      exePath = `${WINE_DOWNLOADS_PATH}/${fileName}`;
      if ((await fileExists(exePath)) === false) {
        try {
          processArgs?.onStdOut?.('------');
          let percent: number | undefined = undefined;
          const file = await downloadFile(fileURL, (args) => {
            if (percent !== args.percent) {
              percent = args.percent;
              processArgs?.onStdOut?.(`${percent}%`);
            }
          });
          await writeBinaryFile(exePath, file);
          processArgs?.onStdOut?.('Download Finished.');
          processArgs?.onExit?.(0);
        } catch (error) {
          console.error(error);
        }
      } else {
        processArgs?.onStdOut?.('------');
        processArgs?.onStdOut?.(`${fileName} has already been downloaded. Download skipped.`);
        processArgs?.onExit?.(0);
      }
    }

    //TODO: logic to detect if fileURL is down
    updateAppConfig({ setupExecutablePath: exePath });
  };

  /**
   * Run executable with wine.
   */
  const runExe = (args: string, processArgs?: SpawnProcessArgs) => {
    return spawnScript('wine', `WINDOWS_EXE "${args.replace(/( |\\ )/g, ' ')}"`, processArgs);
  };

  const runMainExe = (processArgs?: SpawnProcessArgs) => {
    return spawnScript('runExecutable', '', processArgs);
  };

  /**
   * Copy windows application.
   */
  const copyWindowsApplication = (appFolderPath: string, processArgs?: SpawnProcessArgs) => {
    return spawnScript(
      'copyWindowsApplication',
      `"${appFolderPath.replace(/( |\\ )/g, '\\ ')}"`,
      processArgs
    );
  };

  /**
   * Run winecfg.
   */
  const winecfg = (processArgs?: SpawnProcessArgs) => {
    return spawnScript('winecfg', '', processArgs);
  };

  /**
   * Run update wine app.
   */
  const updateWineApp = (processArgs?: SpawnProcessArgs) => {
    return spawnScript('updateWineApp', '', processArgs);
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
   * Set executables with wine
   */
  const setExecutables = async (params: { executables: WineAppExecutable[] }) => {
    const { executables } = params;
    return updateAppConfig({
      executables
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
  const saveMainExecutablePath = async (args: { path: string; flags?: string }) => {
    const { path, flags } = args;
    const config = getAppConfig();
    let executables = config.executables || [];

    if (config.executables?.some((item) => item.main)) {
      executables = config.executables?.map((item) => {
        if (item.main) {
          return { ...item, path, flags };
        }
        return item;
      });
    } else {
      executables = [
        ...executables,
        {
          path,
          flags,
          main: true
        }
      ];
    }

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
  const s = (cmd: string) => {
    return `${ENV_EXPORTS} ${WINE_EXPORTS} ${wineEnvSource()} ${cmd}`;
  };

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
  const initialAppConfig = await readAppConfig();
  appConfig = { ...initialAppConfig, name: appName };

  return {
    execCommand,
    execScript,
    getWineEnv,
    scaffold,
    spawnProcess,
    spawnScript,
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
    runMainExe,
    copyWindowsApplication,
    setSetupExe,
    setExecutables,
    saveAppArtwork,
    saveAppIcon,
    listAppExecutables,
    getAppConfig,
    saveMainExecutablePath,
    updateMainExecutableFlags,
    updateAppLauncherConfig,
    writeAppConfig,
    updateWineApp
  };
};
