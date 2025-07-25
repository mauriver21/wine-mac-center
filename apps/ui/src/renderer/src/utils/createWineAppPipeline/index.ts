import { ProcessStatus, ExitCode } from '@constants/enums';
import { FilePath } from '@interfaces/FilePath';
import { SpawnProcessArgs } from '@interfaces/SpawnProcessArgs';
import { WineAppConfig } from '@interfaces/WineAppConfig';
import { WineAppJob } from '@interfaces/WineAppJob';
import { WineAppPipeline } from '@interfaces/WineAppPipeline';
import { WineAppPipelineConfig } from '@interfaces/WineAppPipelineConfig';
import { WineAppStep } from '@interfaces/WineAppStep';
import { clone } from '@utils/clone';
import { createEnv } from '@utils/createEnv';
import { createWineApp } from '@utils/createWineApp';
import { fileExists } from '@utils/fileExists';
import { readDirectory } from '@utils/readDirectory';
import { readFileAsString } from '@utils/readFileAsString';
import { writeFile } from '@utils/writeFile';
import { v4 as uuid } from 'uuid';

export const createWineAppPipeline = async (options: {
  appConfig: WineAppConfig;
  debug?: boolean;
  outputEveryMs?: number;
  promptMainExeCallback?: (appExecutables: Array<FilePath>) => Promise<string>;
}) => {
  const id = uuid();
  const store = { outputEnabled: true, killAllProcesses: false };
  const env = createEnv();

  const {
    iconURL,
    iconFile,
    artworkFile,
    name,
    engineVersion,
    engineURLs,
    dxvkEnabled,
    winetricks,
    setupExecutableURL,
    setupExecutablePath
  } = options.appConfig;

  const WINE_ENV = {
    get WINE_APP_NAME() {
      return options.appConfig.name;
    },
    get WINE_APP_PATH() {
      return `${env.get().HOME}/Wine/apps/${WINE_ENV.WINE_APP_NAME}.app`;
    },
    get WINE_CONFIG_APP_PATH() {
      return `${WINE_ENV.WINE_APP_PATH}/Config.app`;
    },
    get WINE_APP_DATA_PATH() {
      return `${WINE_ENV.WINE_CONFIG_APP_PATH}/Contents/Resources/data`;
    },
    get WINE_APP_PIPELINE_CONFIG_JSON_PATH() {
      return `${WINE_ENV.WINE_APP_DATA_PATH}/pipeline.json`;
    }
  };

  let pipelineConfig: WineAppPipelineConfig = {
    appConfig: options.appConfig,
    jobs: []
  };

  const updatePipelineJob = (job: WineAppJob) => {
    pipelineConfig = {
      ...pipelineConfig,
      jobs: pipelineConfig.jobs.map((item) => {
        if (item.name === job.name) return { ...item, ...job };
        return item;
      })
    };
  };

  const updatePipelineConfigJobStep = (jobName: string, step: WineAppStep) => {
    const foundJob = pipelineConfig.jobs.find((item) => item.name == jobName);
    if (foundJob?.steps) {
      foundJob.steps = foundJob.steps.map((item) => {
        if (item.name == step.name) return { ...item, ...step };
        return item;
      });
    }
  };

  const readPipelineConfig = async (): Promise<WineAppPipelineConfig> => {
    const path = WINE_ENV.WINE_APP_PIPELINE_CONFIG_JSON_PATH;
    if (await fileExists(path)) {
      return JSON.parse(await readFileAsString(path)) as WineAppPipelineConfig;
    } else {
      return pipelineConfig;
    }
  };

  const writePipelineConfig = async () => {
    console.log(pipelineConfig);
    await writeFile(WINE_ENV.WINE_APP_PIPELINE_CONFIG_JSON_PATH, JSON.stringify(pipelineConfig));
  };

  const checkEngineExists = async () => {
    const ENGINES_PATH = `${env.get().WINE_ENGINES_PATH}`;
    const entries = (await readDirectory(ENGINES_PATH))
      .filter((item) => item !== '.DS_Store')
      .map((item) => item.replace(/.tar.7z$/, ''));
    return entries.includes(`${engineVersion}.tar.7z`);
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

  const concatDataToOutput = (data: string | number | null, output = '') =>
    `${output || ''}\n${data}`;

  const wineApp = await createWineApp(name);
  const pipeline: WineAppPipeline = {
    _: {
      async std(jobName, action, step, data, updateProcess) {
        options.debug && console.log(action, step.name);

        const { script, ...restStep } = step;

        if (store.killAllProcesses) {
          updateProcess?.('exit');
          step.status = ProcessStatus.Cancelled;
          updatePipelineConfigJobStep(jobName, restStep);
          return;
        }

        step.status = ProcessStatus.InProgress;
        step.output = concatDataToOutput(data, step.output);

        if (data === ExitCode.SuccessfulExecution) {
          step.status = ProcessStatus.Success;
        }

        if (data === ExitCode.Error) {
          step.status = ProcessStatus.Error;
        }

        updatePipelineConfigJobStep(jobName, restStep);
        await writePipelineConfig();

        handleOutput(() => {
          options.debug && console.log(action, data);
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
    kill: () => {
      store.killAllProcesses = true;
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
          {
            name: 'Running setup executable',
            script: (args) => {
              setupExecutablePath && wineApp.setSetupExe(setupExecutablePath);
              console.log({ setupExePath: wineApp.getAppConfig().setupExecutablePath });
              return wineApp.runExe(wineApp.getAppConfig().setupExecutablePath || '', args);
            },
            status: ProcessStatus.Pending,
            output: ''
          },
          {
            name: 'Bundling app',
            script: async (args) => {
              let executables = options.appConfig.executables || [];

              if (!options.appConfig.executables?.length) {
                let exePath = '';

                if (options.promptMainExeCallback) {
                  const appExecutables = await wineApp.listAppExecutables();
                  exePath = await options.promptMainExeCallback(appExecutables);
                } else {
                  exePath = (window as Window).prompt('Type the main executable path') || '';
                }

                executables = [{ path: exePath, main: true }];
              }

              return wineApp.bundleApp({ executables, configId: options.appConfig.id }, args);
            },
            status: ProcessStatus.Pending,
            output: ''
          }
        ]
      }
    ],
    async run() {
      for (const job of pipeline.jobs) {
        updatePipelineJob(job);

        for (const step of job.steps) {
          if (store.killAllProcesses) {
            step.status = ProcessStatus.Cancelled;
            this._.onUpdate?.({
              pipelineId: id,
              jobs: pipeline.jobs,
              status: ProcessStatus.Cancelled
            });
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

      if (!store.killAllProcesses) {
        this._.onUpdate?.({
          pipelineId: id,
          jobs: pipeline.jobs,
          status: ProcessStatus.Success
        });
      }
    }
  };

  return {
    pipeline,
    readPipelineConfig,
    writePipelineConfig
  };
};
