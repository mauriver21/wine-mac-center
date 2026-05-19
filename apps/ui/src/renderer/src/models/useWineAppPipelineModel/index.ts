import { useDispatch } from 'react-redux';
import { Dispatch, createSelector } from '@reduxjs/toolkit';
import { store } from '@store';
import { useWineAppPipeline } from '@hocs/withWineAppPipelineProvider';
import { RootState } from '@interfaces/RootState';
import { WineAppPipelineAction } from '@interfaces/WineAppPipelineAction';
import { WineAppPipelineStatus } from '@interfaces/WineAppPipelineStatus';
import { useAppModel } from '@models/useAppModel';
import { WineAppPipelineActionType as ActionType } from '@constants/actionTypes';
import { useWineInstalledAppModel } from '@models/useWineInstalledAppModel';
import { sleep } from 'reactjs-shared-ui';
import { useWineAppConfigModel } from '@models/useWineAppConfigModel';
import { createWineApp } from '@utils/createWineApp';
import { appExists } from '@utils/appExists';
import { WineAppArgs } from '@interfaces/WineAppArgs';
import { ConfigOrigin } from '@constants/enums';
import { WineAppConfig } from '@interfaces/WineAppConfig';
import { buildUniqueAppName } from '@utils/buildUniqueAppName';
import { useLoadingDialog } from '@hooks/useLoadingDialog';
import { useWineEngineModel } from '@models/useWineEngineModel';
import { useSteamCli } from '@hooks/useSteamCli';
import { spawnLog } from '@utils/spawnLog';

export const useWineAppPipelineModel = () => {
  const steamCli = useSteamCli();
  const appModel = useAppModel();
  const loadingDialog = useLoadingDialog();
  const wineInstalledAppModel = useWineInstalledAppModel();
  const wineAppConfigModel = useWineAppConfigModel();
  const wineEngineModel = useWineEngineModel();
  const { createWineAppPipeline, ...context } = useWineAppPipeline();
  const dispatch = useDispatch<Dispatch<WineAppPipelineAction>>();

  const resolveWineAppConfig = async (args: WineAppArgs) => {
    switch (args.origin) {
      case ConfigOrigin.CLOUD: {
        return wineAppConfigModel.read(args);
      }
      case ConfigOrigin.SCRIPTS:
      default: {
        return wineAppConfigModel.selectWineAppConfig(store.getState(), args.appName, args.origin);
      }
    }
  };

  const updateAppConfig = async (args: { appName: string | undefined; config: WineAppConfig }) => {
    const { appName, config } = args;
    try {
      if (appName === undefined) throw new Error(`Invalid app name: ${appName}`);
      if ((await appExists(appName)) === false) throw new Error(`${appName} doesn't exists.`);
      const wineApp = await createWineApp(appName);
      await wineApp.writeAppConfig(config);
    } catch (error) {
      appModel.dispatchError(error);
    }
  };

  const resolveEngineURLs = (engineVersion: string | undefined) => {
    const wineEnginesDownloadables = wineEngineModel.selectWineEnginesDownloadables(
      store.getState()
    );
    const wineEngineDownloadables = wineEnginesDownloadables?.find(
      (item) => item.version == engineVersion
    );

    const engineURLs = wineEngineDownloadables?.urls;

    if (engineURLs === undefined) {
      throw new Error('No engine URLs found.');
    }

    return engineURLs;
  };

  const isSteamApplication = (config: WineAppConfig) => {
    return config.winetricks?.verbs.some((item) => item == 'steam');
  };

  const scaffoldWineApp = async (args: WineAppArgs, onScaffolded: (appName: string) => void) => {
    try {
      loadingDialog.open({ message: 'Preparing Wine App...' });

      let { appName, config } = args;

      if (args.origin === undefined) {
        throw new Error(`Origin is not defined`);
      }

      if (appName === undefined || appName === '') {
        throw new Error(`Invalid app name: ${appName}`);
      }

      const originalAppName = appName;
      appName = await buildUniqueAppName(appName);

      if (args.origin === ConfigOrigin.CLOUD) {
        const isDownloadedScript = wineAppConfigModel.selectIsDownloadedScript(
          store.getState(),
          originalAppName
        );

        if (!isDownloadedScript) {
          await wineAppConfigModel.downloadScript(originalAppName);
        }
      }

      if (args.origin !== ConfigOrigin.INSTALLED_APP) {
        config = await resolveWineAppConfig({ ...args, appName: originalAppName });
      }

      if (config === undefined) {
        throw new Error(`App config for ${appName} not found.`);
      }

      config = { ...config, name: appName };

      if (config?.engineURLs === undefined) {
        config = { ...config, engineURLs: resolveEngineURLs(config?.engineVersion) };
      }

      if (isSteamApplication(config) && !(await steamCli.isInstalled())) {
        loadingDialog.updateMessage('Installing Steam client...');
        await steamCli.install(spawnLog);
      }

      loadingDialog.updateMessage('Checking Steam credentials...');
      await steamCli.askSteamCredentials(spawnLog);

      loadingDialog.updateMessage('Creating Wine App...');
      const wineApp = await createWineApp(appName, config);
      await new Promise<WineAppConfig>((resolve) =>
        wineApp.scaffold(
          {
            appIconURL: config?.iconURL,
            appArtWorkURL: config?.artworkURL,
            launcherImgURL: config?.launcherImgURL,
            appIconFile: config?.iconFile,
            appArtWorkFile: config?.artworkFile,
            launcherImgFile: config?.launcherImgFile
          },
          {
            onExit: () => {
              resolve(config);
            }
          }
        )
      );

      loadingDialog.close();
      onScaffolded(appName);
    } catch (error) {
      appModel.dispatchError(error);
    } finally {
      loadingDialog.close();
    }
  };

  const loadWineAppPipeline = async (appName: string | undefined) => {
    try {
      if (appName === undefined) throw new Error(`Invalid app name: ${appName}`);

      const pipeline = await createWineAppPipeline({
        appName,
        debug: true,
        outputEveryMs: 1000
      });

      const { jobs, status } = await pipeline.readPipelineConfig();
      dispatchPatch({ jobs, status, pipelineId: pipeline.id });

      pipeline.onUpdate((pipelineStatus) => {
        dispatchPatch({ ...pipelineStatus });
      });

      return pipeline;
    } catch (error) {
      appModel.dispatchError(error);
      return;
    }
  };

  const runWineAppPipeline = async (args: WineAppArgs) => {
    try {
      const { appName, fromJobIndex, fromStepIndex } = args;
      // Required delay for config.json be ready when loading wine pipeline.
      await sleep(200);
      const pipeline = await loadWineAppPipeline(appName);
      const promise = pipeline?.run({ fromJobIndex, fromStepIndex });
      await sleep(200);
      wineInstalledAppModel.listAll();
      await promise;
    } catch (error) {
      appModel.dispatchError(error);
    }
  };

  const killWineAppPipeline = () => context.killWineAppPipeline();

  const stopWineAppPipeline = async (appName: string | undefined) => {
    try {
      loadingDialog.open({ message: 'Stopping wine app setup...' });
      await killWineAppPipeline();
      await sleep(200);
      await loadWineAppPipeline(appName);
    } catch (error) {
      appModel.dispatchError(error);
    } finally {
      loadingDialog.close();
    }
  };

  const clearWineAppPipeline = () => {
    dispatch({
      type: ActionType.REMOVE
    });
  };

  const dispatchPatch = (pipelineStatus: WineAppPipelineStatus) => {
    dispatch({
      type: ActionType.PATCH,
      pipelineStatus
    });
  };

  const selectWineAppPipelineState = (state: RootState) => state.wineAppPipelineState;
  const selectWineAppPipelineStatus = createSelector(
    [selectWineAppPipelineState],
    (wineAppPipelineState) => wineAppPipelineState.pipelineStatus
  );

  return {
    runWineAppPipeline,
    killWineAppPipeline,
    clearWineAppPipeline,
    dispatchPatch,
    updateAppConfig,
    scaffoldWineApp,
    stopWineAppPipeline,
    loadWineAppPipeline,
    selectWineAppPipelineStatus
  };
};
