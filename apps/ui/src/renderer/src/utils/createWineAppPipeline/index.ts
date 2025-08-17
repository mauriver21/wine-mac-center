import { ProcessStatus, ExitCode, ScriptOperation } from '@constants/enums';
import { FilePath } from '@interfaces/FilePath';
import { PipelineScript } from '@interfaces/PipelineScript';
import { SpawnProcessArgs } from '@interfaces/SpawnProcessArgs';
import { WineAppConfig } from '@interfaces/WineAppConfig';
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
import { v4 as uuid } from 'uuid';

export const createWineAppPipeline = async (options: {
  appConfig: WineAppConfig;
  pipelineScripts?: Array<PipelineScript>;
  debug?: boolean;
  outputEveryMs?: number;
  promptMainExeCallback?: (args: {
    appExecutables: Array<FilePath>;
    driveCPath: string;
  }) => Promise<string>;
}) => {
  const id = uuid();
  const store = { outputEnabled: true, killAllProcesses: false, currentProcess: { pid: 0 } };
  const env = createEnv();
  const {
    iconURL,
    iconFile,
    artworkFile,
    name,
    engineVersion,
    engineURLs = [],
    dxvkEnabled,
    winetricks,
    setupExecutableURL,
    setupExecutablePath,
    appFolderPath
  } = options.appConfig;
  const { pipelineScripts = [] } = options;
  const wineApp = await createWineApp(name);
  const appEnv = wineApp.getWineEnv();
  const PIPELINE_CONFIG_JSON_PATH = `${appEnv.WINE_APP_DATA_PATH}/pipeline.json`;

  let pipelineConfig: WineAppPipelineConfig = {
    appConfig: options.appConfig,
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
      pipelineConfig.jobs.push(job);
    }
  };

  const savePipelineConfigJobStep = (jobName: string, step: WineAppStep) => {
    const foundJob = pipelineConfig.jobs.find((item) => item.name == jobName);
    if (foundJob?.steps) {
      foundJob.steps = foundJob.steps.map((item) => {
        if (item.name == step.name) return { ...item, ...step };
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
        name: `Running winetrick ${verb}`,
        script: (args: SpawnProcessArgs) => wineApp.winetrick(verb, args, winetricks?.options),
        status: ProcessStatus.Pending,
        output: ''
      });
    }

    return steps;
  };

  const resetJobStepsStatus = (
    steps: WineAppJobWithScript['steps'],
    onUpdate: ((status: WineAppPipelineStatus) => void) | undefined
  ) => {
    for (const step of steps) {
      if (step.status == ProcessStatus.Success) {
        continue;
      }

      step.status = ProcessStatus.Pending;
    }

    onUpdate?.({
      pipelineId: id,
      jobs: pipeline.jobs,
      status: ProcessStatus.Pending
    });
  };

  const runPipelineScript = async (args: PipelineScript, spawnProcessArgs: SpawnProcessArgs) => {
    const { operation } = args;
    const WINE_DOWNLOADS_PATH = `${env.get().WINE_DOWNLOADS_PATH}`;

    switch (operation) {
      case ScriptOperation.DOWNLOAD: {
        spawnProcessArgs.onStdOut?.('-----');
        spawnProcessArgs.onStdOut?.('Download Started:');
        let percent: number | undefined = undefined;
        const file = await downloadFile(args.url, (args) => {
          if (percent !== args.percent) {
            percent = args.percent;
            spawnProcessArgs.onStdOut?.(`${percent}%`);
          }
        });
        const fileName = args.downloadName || args.url.split('/').pop();
        await writeBinaryFile(`${WINE_DOWNLOADS_PATH}/${fileName}`, file);
        spawnProcessArgs.onStdOut?.('Download Finished.');
        spawnProcessArgs.onExit?.(0);
        break;
      }
      case ScriptOperation.COPY: {
        const from = `${WINE_DOWNLOADS_PATH}/${args.from.replace(/^\//, '')}`;
        return wineApp.spawnScript('copy', `"${from}" "${args.target}"`, spawnProcessArgs);
      }
      case ScriptOperation.REMOVE: {
        return wineApp.spawnScript('remove', `"${args.target}"`, spawnProcessArgs);
      }
      case ScriptOperation.RUN_WINDOWS_EXE: {
        return wineApp.runExe(`"${WINE_DOWNLOADS_PATH}/${args.exePath}"`, spawnProcessArgs);
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

        if (data === ExitCode.SuccessfulExecution) {
          step.status = ProcessStatus.Success;
          this.onUpdate?.({
            pipelineId: id,
            jobs: pipeline.jobs,
            status: ProcessStatus.Success
          });
        }

        if (data === ExitCode.Error) {
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
      const pid = store.currentProcess.pid;
      pid && (await wineApp.execScript('killPid', `${pid}`));
      store.killAllProcesses = true;
      savePipelineStatus(ProcessStatus.Cancelled);
    },
    jobs: [
      {
        name: 'Create wine app',
        steps: [
          {
            name: 'Creating wine app',
            script: (args) =>
              wineApp.scaffold(
                {
                  appIconURL: iconURL,
                  appIconFile: iconFile,
                  appArtWorkFile: artworkFile
                },
                args
              ),
            status: ProcessStatus.Pending,
            output: ''
          },
          ...(ENGINE_EXISTS
            ? []
            : [
                {
                  name: 'Downloading wine engine',
                  script: (args: SpawnProcessArgs) =>
                    wineApp.downloadWineEngine(engineURLs, engineVersion, args),
                  status: ProcessStatus.Pending,
                  output: ''
                }
              ]),
          {
            name: 'Extracting wine engine',
            script: (args) => wineApp.extractEngine(engineVersion, args),
            status: ProcessStatus.Pending,
            output: ''
          },
          {
            name: 'Generating wine prefix',
            script: (args) => wineApp.wineboot('', args),
            status: ProcessStatus.Pending,
            output: ''
          },
          ...(dxvkEnabled
            ? [
                {
                  name: 'Enabling DXVK',
                  script: (args: SpawnProcessArgs) => wineApp.winetrick('dxvk1102', args),
                  status: ProcessStatus.Pending,
                  output: ''
                }
              ]
            : []),
          ...buildWinetricksSteps(),
          ...(setupExecutableURL
            ? [
                {
                  name: 'Downloading setup executable',
                  script: () => wineApp.setSetupExe(setupExecutableURL),
                  status: ProcessStatus.Pending,
                  output: ''
                }
              ]
            : []),
          ...(setupExecutablePath
            ? [
                {
                  name: 'Running setup executable',
                  script: (args?: SpawnProcessArgs) => {
                    setupExecutablePath && wineApp.setSetupExe(setupExecutablePath);
                    return wineApp.runExe(wineApp.getAppConfig().setupExecutablePath || '', args);
                  },
                  status: ProcessStatus.Pending,
                  output: ''
                }
              ]
            : []),
          ...(appFolderPath
            ? [
                {
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
            name: 'Configuring app executable',
            script: async (args) => {
              let executables = options.appConfig.executables || [];
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

              return wineApp.bundleApp({ executables }, args);
            },
            status: ProcessStatus.Pending,
            output: ''
          }
        ]
      }
    ],
    async run() {
      savePipelineStatus(ProcessStatus.InProgress);
      await writePipelineConfig();

      for (const job of pipeline.jobs) {
        savePipelineJob(job);
        resetJobStepsStatus(job.steps, this._.onUpdate);

        for (const step of job.steps) {
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

          store.currentProcess = await step.script({
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
