import { useDispatch } from 'react-redux';
import { Dispatch, createSelector } from '@reduxjs/toolkit';
import { store } from '@store';
import { useWineAppPipeline } from '@hocs/withWineAppPipelineProvider';
import { RootState } from '@interfaces/RootState';
import { WineAppPipelineAction } from '@interfaces/WineAppPipelineAction';
import { useAppModel } from '@models/useAppModel';
import { WineAppPipelineActionType as ActionType } from '@constants/actionTypes';
import { useWineInstalledAppModel } from '@models/useWineInstalledAppModel';
import { sleep } from 'reactjs-shared-ui';
import { useWineAppConfigModel } from '@models/useWineAppConfigModel';
import { createWineApp } from '@utils/createWineApp';
import { appExists } from '@utils/appExists';
import { ConfigOrigin, ProcessStatus } from '@constants/enums';
import { WineAppConfig } from '@interfaces/WineAppConfig';
import { buildUniqueAppName } from '@utils/buildUniqueAppName';
import { useLoadingDialog } from '@hooks/useLoadingDialog';
import { useWineEngineModel } from '@models/useWineEngineModel';
import { useSteamCli } from '@hooks/useSteamCli';
import { spawnLog } from '@utils/spawnLog';
import { useI18n } from 'reactjs-shared-ui/i18next';
import { useRef } from 'react';
import { waitValue } from '@utils/waitValue';
import { WineAppPipelineConfig } from '@interfaces/WineAppPipelineConfig';

export const useWineAppPipelineModel = () => {
  const { t } = useI18n();
  const ref = useRef<{ pipelineFinished: boolean | undefined }>({ pipelineFinished: undefined });
  const steamCli = useSteamCli();
  const appModel = useAppModel();
  const loadingDialog = useLoadingDialog();
  const wineInstalledAppModel = useWineInstalledAppModel();
  const wineAppConfigModel = useWineAppConfigModel();
  const wineEngineModel = useWineEngineModel();
  const { createWineAppPipeline, ...context } = useWineAppPipeline();
  const dispatch = useDispatch<Dispatch<WineAppPipelineAction>>();

  const setPipelineFinished = (flag: boolean | undefined) => {
    ref.current.pipelineFinished = flag;
  };

  const resolveWineAppConfig = async (args: {
    origin: ConfigOrigin | undefined;
    appName: string;
  }) => {
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
      if (appName === undefined) throw new Error(t('invalidAppName', { appName }));
      if ((await appExists(appName)) === false) throw new Error(t('appNameNotExists', { appName }));
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
      throw new Error(t('noEngineUrlsFound'));
    }

    return engineURLs;
  };

  const isSteamApplication = (config: WineAppConfig) => {
    return config.winetricks?.verbs.some((item) => item == 'steam');
  };

  const scaffoldWineApp = async (
    args: { origin: ConfigOrigin | undefined; appName: string | undefined; config?: WineAppConfig },
    onScaffolded: (appName: string) => void
  ) => {
    try {
      loadingDialog.open({ message: t('preparingWineApp') });

      let { appName, config } = args;

      if (args.origin === undefined) {
        throw new Error(t('originIsNotDefined'));
      }

      if (appName === undefined || appName === '') {
        throw new Error(t('invalidAppName', { appName }));
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
        throw new Error(t('appConfigForAppNotFound', { appName }));
      }

      config = { ...config, name: appName };

      if (config?.engineURLs === undefined) {
        config = { ...config, engineURLs: resolveEngineURLs(config?.engineVersion) };
      }

      if (isSteamApplication(config) && !(await steamCli.isInstalled())) {
        loadingDialog.updateMessage(t('installingSteamClient'));
        await steamCli.install(spawnLog);
      }

      if (isSteamApplication(config)) {
        loadingDialog.updateMessage(t('checkingSteamCredentials'));
        await steamCli.askSteamCredentials(spawnLog);
      }

      loadingDialog.updateMessage(t('creatingWineApp'));

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

      const pipelineConfig = await pipeline.readPipelineConfig();
      dispatchPatch({ ...pipelineConfig, pipelineId: pipeline.id });

      pipeline.onUpdate((pipelineStatus) => {
        pipelineStatus.status === ProcessStatus.Cancelled && console.log('XXXX', pipelineStatus);
        dispatchPatch({ ...pipelineStatus, appConfig: pipelineConfig.appConfig });
      });

      return pipeline;
    } catch (error) {
      appModel.dispatchError(error);
      return;
    }
  };

  const resumeWineAppPipeline = async (args: {
    appName: string | undefined;
    fromJobIndex?: number;
    fromStepIndex?: number;
  }) => {
    try {
      loadingDialog.open({ message: t('resumingAppPipeline') });
      const { appName, fromJobIndex, fromStepIndex } = args;
      const pipeline = await loadWineAppPipeline(appName);
      loadingDialog.close();
      const promise = pipeline?.run({ fromJobIndex, fromStepIndex });
      await sleep(200);
      wineInstalledAppModel.listAll();
      await promise;
    } catch (error) {
      appModel.dispatchError(error);
    } finally {
      setPipelineFinished(true);
    }
  };

  const runWineAppPipeline = async (appName: string | undefined) => {
    try {
      // Required delay for config.json be ready when loading wine pipeline.
      await sleep(200);
      const pipeline = await loadWineAppPipeline(appName);
      const promise = pipeline?.run();
      await sleep(200);
      wineInstalledAppModel.listAll();
      await promise;
    } catch (error) {
      appModel.dispatchError(error);
    } finally {
      setPipelineFinished(true);
    }
  };

  const killWineAppPipeline = () => context.killWineAppPipeline();

  const stopWineAppPipeline = async (appName: string | undefined) => {
    try {
      loadingDialog.open({ message: t('stoppingWineAppSetup') });
      await killWineAppPipeline();
      await sleep(200);
      await loadWineAppPipeline(appName);
    } catch (error) {
      appModel.dispatchError(error);
    } finally {
      await waitValue(ref.current, 'pipelineFinished');
      setPipelineFinished(undefined);
      loadingDialog.close();
    }
  };

  const clearWineAppPipeline = () => {
    dispatch({
      type: ActionType.REMOVE
    });
  };

  const dispatchPatch = (pipelineConfig: WineAppPipelineConfig) => {
    dispatch({
      type: ActionType.PATCH,
      pipelineConfig
    });
  };

  const selectWineAppPipelineState = (state: RootState) => state.wineAppPipelineState;
  const selectWineAppPipelineConfig = createSelector(
    [selectWineAppPipelineState],
    (wineAppPipelineState) => wineAppPipelineState.pipelineConfig
  );

  return {
    resumeWineAppPipeline,
    runWineAppPipeline,
    killWineAppPipeline,
    clearWineAppPipeline,
    dispatchPatch,
    updateAppConfig,
    scaffoldWineApp,
    stopWineAppPipeline,
    loadWineAppPipeline,
    selectWineAppPipelineConfig
  };
};
