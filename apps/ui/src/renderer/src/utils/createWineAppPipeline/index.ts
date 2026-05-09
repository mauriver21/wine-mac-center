import { ProcessStatus, ExitCode, ScriptOperation } from '@constants/enums';
import { FilePath } from '@interfaces/FilePath';
import { PipelineScript } from '@interfaces/PipelineScript';
import { SpawnProcessArgs } from '@interfaces/SpawnProcessArgs';
import { WineAppJob } from '@interfaces/WineAppJob';
import { WineAppJobWithScript } from '@interfaces/WineAppJobWithScript';
import { WineAppPipeline } from '@interfaces/WineAppPipeline';
import { WineAppPipelineConfig } from '@interfaces/WineAppPipelineConfig';
import { WineAppPipelineStatus } from '@interfaces/WineAppPipelineStatus';
import { WineAppStep } from '@interfaces/WineAppStep';
import { clone } from '@utils/clone';
import { createEnv } from '@utils/createEnv';
import { createWineApp } from '@utils/createWineApp';
import { dirExists } from '@utils/dirExists';
import { downloadFile } from '@utils/downloadFile';
import { fileExists } from '@utils/fileExists';
import { readDirectory } from '@utils/readDirectory';
import { readFileAsString } from '@utils/readFileAsString';
import { writeBinaryFile } from '@utils/writeBinaryFile';
import { writeFile } from '@utils/writeFile';
import { findOutputPids } from '@utils/findOutputPids';
import { v4 as uuid } from 'uuid';
import { parsePath } from '@utils/parsePath';
import { getRelativeDriveCPath } from '@utils/getRelativeDriveCPath';
import { createSteamCli } from '@utils/createSteamCli';

export const createWineAppPipeline = async (options: {
  appName: string;
  debug?: boolean;
  outputEveryMs?: number;
  promptMainExeCallback?: (args: {
    appExecutables: Array<FilePath>;
    driveCPath: string;
  }) => Promise<string>;
  clients?: {
    steamCli?: ReturnType<typeof createSteamCli>;
  };
}) => {
  const id = uuid();
  const store = { outputEnabled: true, killAllProcesses: false, currentProcess: { pids: '0' } };
  const env = createEnv();
  const wineApp = await createWineApp(options.appName);
  const appConfig = wineApp.getAppConfig();
  const {
    engineVersion = '',
    engineURLs = [],
    dxvkEnabled,
    winetricks,
    setupExecutableURL,
    setupExecutablePath,
    appFolderPath,
    pipelineScripts = []
  } = appConfig;
  const { clients: { steamCli } = {} } = options;
  const appEnv = wineApp.getWineEnv();
  const PIPELINE_CONFIG_JSON_PATH = `${appEnv.WINE_APP_DATA_PATH}/pipeline.json`;
  const WINETRICKS_VERSION = winetricks?.version || '20260125';

  let pipelineConfig: WineAppPipelineConfig = {
    appConfig,
    jobs: [],
    status: ProcessStatus.Pending
  };

  const savePipelineStatus = (status: ProcessStatus) => {
    pipelineConfig = { ...pipelineConfig, status };
  };

  const savePipelineJob = (job: WineAppJob) => {
    if (pipelineConfig.jobs.some((item) => item.name == job.name)) {
      pipelineConfig = {
        ...pipelineConfig,
        jobs: pipelineConfig.jobs.map((item) => {
          if (item.name === job.name) return { ...item, ...job };
          return item;
        })
      };
    } else {
      pipelineConfig = { ...pipelineConfig, jobs: [...pipelineConfig.jobs, job] };
    }
  };

  const savePipelineConfigJobStep = (jobName: string, step: WineAppStep) => {
    const foundJob = pipelineConfig.jobs.find((item) => item.name == jobName);
    if (foundJob?.steps) {
      foundJob.steps = foundJob.steps.map((item) => {
        if (item.id == step.id) return { ...item, ...step };
        return item;
      });
    }
  };

  const readPipelineConfig = async (): Promise<WineAppPipelineConfig> => {
    if (await fileExists(PIPELINE_CONFIG_JSON_PATH)) {
      return JSON.parse(await readFileAsString(PIPELINE_CONFIG_JSON_PATH)) as WineAppPipelineConfig;
    } else {
      return pipelineConfig;
    }
  };

  const writePipelineConfig = async () => {
    if (await dirExists(appEnv.WINE_APP_DATA_PATH)) {
      await writeFile(PIPELINE_CONFIG_JSON_PATH, JSON.stringify(pipelineConfig));
    }
  };

  const initJobs = async (jobs: WineAppJobWithScript[]) => {
    const pipelineConfig = await readPipelineConfig();
    const foundJobs = pipelineConfig.jobs;
    const hasJobs = Boolean(foundJobs.length);

    if (hasJobs) {
      let i = 0;
      for (const job of jobs) {
        let j = 0;
        const foundJob = foundJobs[i];
        job.name = foundJob.name;

        for (const step of job.steps) {
          const foundStep = foundJob.steps[j];
          job.steps[j] = { ...step, ...foundStep };
          j++;
        }

        i++;
      }
    }

    return jobs;
  };

  const checkEngineExists = async () => {
    const ENGINES_PATH = `${env.get().WINE_ENGINES_PATH}`;
    const entries = (await readDirectory(ENGINES_PATH))
      .filter((item) => item !== '.DS_Store')
      .map((item) => item.replace(/.tar.7z$/, ''));
    return entries.includes(engineVersion);
  };

  const ENGINE_EXISTS = await checkEngineExists();

  const handleOutput = (callbackFn: Function) => {
    if (store.outputEnabled) {
      callbackFn();
      store.outputEnabled = false;
      setTimeout(() => {
        store.outputEnabled = true;
      }, options.outputEveryMs || 100);
    }
  };

  const buildWinetricksSteps = () => {
    const steps: Array<
      WineAppStep & {
        script: (args: SpawnProcessArgs) => Promise<any>;
      }
    > = [];
    const verbs = winetricks?.verbs || [];

    for (const verb of verbs) {
      steps.push({
        id: uuid(),
        name: `Running winetrick ${verb}`,
        script: (args: SpawnProcessArgs) =>
          wineApp.winetrick({ verb, version: WINETRICKS_VERSION }, args, winetricks?.options),
        status: ProcessStatus.Pending,
        output: ''
      });
    }

    return steps;
  };

  const resetJobStepsStatus = (
    steps: WineAppJobWithScript['steps'],
    onUpdate: ((status: WineAppPipelineStatus) => void) | undefined,
    fromStepIndex?: number
  ) => {
    let stepIndex = 0;
    for (const step of steps) {
      if (fromStepIndex && stepIndex < fromStepIndex) {
        stepIndex++;
        continue;
      }

      if (step.status == ProcessStatus.Success && fromStepIndex == undefined) {
        continue;
      }

      step.status = ProcessStatus.Pending;
      step.output = '';
    }

    onUpdate?.({
      pipelineId: id,
      jobs: pipeline.jobs,
      status: ProcessStatus.Pending
    });
  };

  const updateCurrentProcess = (output: string) => {
    const pids = findOutputPids(output);

    if (pids && pids !== store.currentProcess.pids) {
      store.currentProcess.pids = pids;
    }
  };

  const runPipelineScript = async (args: PipelineScript, spawnProcessArgs: SpawnProcessArgs) => {
    const { operation } = args;
    const WINE_DOWNLOADS_PATH = `${env.get().WINE_DOWNLOADS_PATH}`;

    switch (operation) {
      case ScriptOperation.DOWNLOAD: {
        spawnProcessArgs.onStdOut?.('-----');
        spawnProcessArgs.onStdOut?.('Download Started:');
        const fileName = args.downloadName || args.url.split('/').pop() || '';
        const target = `${WINE_DOWNLOADS_PATH}/${decodeURIComponent(fileName)}`;

        if (await fileExists(target)) {
          spawnProcessArgs.onStdOut?.('File already exists, skipping download.');
        } else {
          let percent: number | undefined = undefined;
          const file = await downloadFile(args.url, (args) => {
            if (percent !== args.percent) {
              percent = args.percent;
              spawnProcessArgs.onStdOut?.(`${percent}%`);
            }
          });
          await writeBinaryFile(target, file);
          spawnProcessArgs.onStdOut?.('Download Finished.');
        }

        spawnProcessArgs.onExit?.(0);
        break;
      }
      case ScriptOperation.DECOMPRESS: {
        const path = parsePath(args.path);
        const from = `${WINE_DOWNLOADS_PATH}/${path}`;
        const target = from.replace(/\.[^.]+$/, '');
        return wineApp.spawnScript('extract', `"${from}" "${target}"`, spawnProcessArgs);
      }
      case ScriptOperation.COPY: {
        const from = `${WINE_DOWNLOADS_PATH}/${parsePath(args.from)}`;
        const target = `${appEnv.WINE_APP_DRIVE_C_PATH}/${parsePath(args.target)}`;
        return wineApp.spawnScript('copy', `"${from}" "${target}"`, spawnProcessArgs);
      }
      case ScriptOperation.REMOVE: {
        const path = `${appEnv.WINE_APP_DRIVE_C_PATH}/${parsePath(args.removePath)}`;
        return wineApp.spawnScript('remove', `"${path}"`, spawnProcessArgs);
      }
      case ScriptOperation.RUN_WINDOWS_EXE: {
        const exePath = `/${parsePath(args.baseExePath)}/${parsePath(args.exePath)}`
          .replace('$HOME', env.get().HOME)
          .replace('$WINE_APP_PREFIX_PATH', appEnv.WINE_APP_PREFIX_PATH);
        return wineApp.runExe(`${exePath}`, spawnProcessArgs);
      }
      case ScriptOperation.SET_MAIN_EXE: {
        const mainExePath = getRelativeDriveCPath(
          `${appEnv.WINE_APP_DRIVE_C_PATH}/${parsePath(args.mainExePath)}`
        );
        await wineApp.saveMainExecutablePath({ path: mainExePath, flags: args.exeFlags });
        spawnProcessArgs.onExit?.(0);
        break;
      }
      case ScriptOperation.MOUNT_DISK_IMAGE: {
        const diskImagePath = `${WINE_DOWNLOADS_PATH}/${parsePath(args.diskImagePath)}`;
        return wineApp.spawnScript('mountDiskImage', `"${diskImagePath}"`, spawnProcessArgs);
      }
      case ScriptOperation.DOWNLOAD_STEAM_APP: {
        const gameInstallDir = `${appEnv.WINE_APP_DRIVE_C_PATH}/Program Files (x86)/Steam/steamapps/common/${args.installDirName}`;
        return steamCli?.downloadSteamApp(
          { appId: args.steamAppId, gameInstallDir },
          spawnProcessArgs
        );
      }
      default:
        return;
    }

    return;
  };

  const buildPipelineStepsFromScripts = () => {
    let steps: Array<
      WineAppStep & {
        script: (args: SpawnProcessArgs) => Promise<{
          pid: number;
        } | void>;
      }
    > = [];

    for (const script of pipelineScripts) {
      steps = [
        ...steps,
        {
          id: uuid(),
          name: script.name,
          output: '',
          status: ProcessStatus.Pending,
          script: async (args) => runPipelineScript(script, args)
        }
      ];
    }
    return steps;
  };

  const concatDataToOutput = (data: string | number | null, output = '') =>
    `${output || ''}\n${data}`;

  const pipeline: WineAppPipeline = {
    _: {
      async std(jobName, action, step, data, updateProcess) {
        if (store.killAllProcesses) {
          updateProcess?.('exit');
          step.status = ProcessStatus.Cancelled;
          savePipelineConfigJobStep(jobName, step);
          this.onUpdate?.({
            pipelineId: id,
            jobs: pipeline.jobs,
            status: ProcessStatus.Cancelled
          });
          return;
        }

        step.status = ProcessStatus.InProgress;
        step.output = concatDataToOutput(data, step.output);
        updateCurrentProcess(String(data));

        if (data === ExitCode.SuccessfulExecution) {
          step.status = ProcessStatus.Success;
          this.onUpdate?.({
            pipelineId: id,
            jobs: pipeline.jobs,
            status: ProcessStatus.InProgress
          });
        }

        if (data === ExitCode.Error || data === ExitCode.PermissionsError) {
          step.status = ProcessStatus.Error;
        }

        savePipelineConfigJobStep(jobName, step);

        handleOutput(() => {
          options.debug && console.log(action, data, step.name);
          this.onUpdate?.({
            pipelineId: id,
            jobs: pipeline.jobs,
            status: ProcessStatus.InProgress
          });
        });
      }
    },
    readPipelineConfig,
    onUpdate(fn) {
      this._.onUpdate = (pipelineStatus) => fn(clone(pipelineStatus));
    },
    id,
    getInitialStatus: () =>
      clone({
        pipelineId: id,
        jobs: pipeline.jobs,
        status: ProcessStatus.Cancelled
      }),
    kill: async () => {
      const pids = store.currentProcess.pids;
      pids && (await wineApp.execScript('killPids', `${pids}`));
      store.killAllProcesses = true;
      savePipelineStatus(ProcessStatus.Cancelled);
      await writePipelineConfig();
    },
    jobs: [
      {
        name: 'Create wine app',
        steps: [
          ...(ENGINE_EXISTS
            ? []
            : [
                {
                  id: uuid(),
                  name: 'Downloading wine engine',
                  script: (args: SpawnProcessArgs) =>
                    wineApp.downloadWineEngine(engineURLs, engineVersion, args),
                  status: ProcessStatus.Pending,
                  output: ''
                }
              ]),
          {
            id: uuid(),
            name: 'Extracting wine engine',
            script: (args) => wineApp.extractEngine(engineVersion, args),
            status: ProcessStatus.Pending,
            output: ''
          },
          {
            id: uuid(),
            name: 'Generating wine prefix',
            script: (args) => wineApp.wineboot('', args),
            status: ProcessStatus.Pending,
            output: ''
          },
          ...(dxvkEnabled
            ? [
                {
                  id: uuid(),
                  name: 'Enabling DXVK',
                  script: (args: SpawnProcessArgs) =>
                    wineApp.winetrick({ verb: 'dxvk1102', version: WINETRICKS_VERSION }, args),
                  status: ProcessStatus.Pending,
                  output: ''
                }
              ]
            : []),
          ...buildWinetricksSteps(),
          ...(setupExecutableURL
            ? [
                {
                  id: uuid(),
                  name: 'Downloading setup executable',
                  script: (args?: SpawnProcessArgs) =>
                    wineApp.setSetupExe(setupExecutableURL, args),
                  status: ProcessStatus.Pending,
                  output: ''
                }
              ]
            : []),
          ...(setupExecutablePath
            ? [
                {
                  id: uuid(),
                  name: 'Running setup executable',
                  script: (args?: SpawnProcessArgs) => {
                    const exePath = wineApp.getAppConfig().setupExecutablePath || '';
                    return wineApp.runExe(exePath, args);
                  },
                  status: ProcessStatus.Pending,
                  output: ''
                }
              ]
            : []),
          ...(appFolderPath
            ? [
                {
                  id: uuid(),
                  name: 'Copying windows application',
                  script: (args?: SpawnProcessArgs) => {
                    return wineApp.copyWindowsApplication(appFolderPath || '', args);
                  },
                  status: ProcessStatus.Pending,
                  output: ''
                }
              ]
            : []),
          ...buildPipelineStepsFromScripts(),
          {
            id: uuid(),
            name: 'Configuring app executable',
            script: async (args?: SpawnProcessArgs) => {
              const appConfig = wineApp.getAppConfig();
              let executables = appConfig.executables || [];
              const mainExecutablePath = executables.find((item) => item.main)?.path || '';

              if (!mainExecutablePath) {
                let exePath = '';

                if (options.promptMainExeCallback) {
                  const appExecutables = await wineApp.listAppExecutables();
                  exePath = await options.promptMainExeCallback({
                    appExecutables,
                    driveCPath: appEnv.WINE_APP_DRIVE_C_PATH
                  });
                } else {
                  exePath = (window as Window).prompt('Type the main executable path') || '';
                }

                executables = [{ path: exePath, main: true }];
              }

              await wineApp.setExecutables({ executables });
              args?.onExit?.(0);
            },
            status: ProcessStatus.Pending,
            output: ''
          }
        ]
      }
    ],
    async run(args?: { fromJobIndex?: number; fromStepIndex?: number }) {
      const { fromJobIndex, fromStepIndex } = args || {};
      savePipelineStatus(ProcessStatus.InProgress);
      await writePipelineConfig();
      let jobIndex = 0;

      for (const job of pipeline.jobs) {
        let stepIndex = 0;
        if (fromJobIndex && jobIndex < fromJobIndex) {
          jobIndex++;
          continue;
        }

        savePipelineJob(job);
        resetJobStepsStatus(job.steps, this._.onUpdate, fromStepIndex);

        for (const step of job.steps) {
          if (fromStepIndex && stepIndex < fromStepIndex) {
            stepIndex++;
            continue;
          }
          if (step.status == ProcessStatus.Success) {
            continue;
          }

          if (store.killAllProcesses) {
            step.status = ProcessStatus.Cancelled;
            this._.onUpdate?.({
              pipelineId: id,
              jobs: pipeline.jobs,
              status: ProcessStatus.Cancelled
            });

            savePipelineConfigJobStep(job.name, step);
            continue;
          }

          await step.script({
            onStdOut: (data, updateProcess) =>
              this._.std(job.name, 'stdOut', step, data, updateProcess),
            onStdErr: (data, updateProcess) =>
              this._.std(job.name, 'stdErr', step, data, updateProcess),
            onExit: (data) => this._.std(job.name, 'exit', step, data)
          });
        }
      }

      if (store.killAllProcesses === false) {
        this._.onUpdate?.({
          pipelineId: id,
          jobs: pipeline.jobs,
          status: ProcessStatus.Success
        });
        savePipelineStatus(ProcessStatus.Success);
      }

      await writePipelineConfig();
    }
  };

  await initJobs(pipeline.jobs);

  return pipeline;
};
