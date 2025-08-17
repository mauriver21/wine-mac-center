import { useDispatch } from 'react-redux';
import { Dispatch, createSelector } from '@reduxjs/toolkit';
import { store } from '@store';
import { useWineAppPipeline } from '@hocs/withWineAppPipelineProvider';
import { RootState } from '@interfaces/RootState';
import { WineAppConfig } from '@interfaces/WineAppConfig';
import { WineAppPipelineAction } from '@interfaces/WineAppPipelineAction';
import { WineAppPipelineStatus } from '@interfaces/WineAppPipelineStatus';
import { useAppModel } from '@models/useAppModel';
import { useWineAppConfigModel } from '@models/useWineAppConfigModel';
import { useWineEngineModel } from '@models/useWineEngineModel';
import { WineAppPipelineActionType as ActionType } from '@constants/actionTypes';
import { useWineInstalledAppModel } from '@models/useWineInstalledAppModel';
import { sleep } from 'reactjs-shared-ui';
import { useWineScriptModel } from '@models/useWineScriptModel';

export const useWineAppPipelineModel = () => {
  const appModel = useAppModel();
  const wineInstalledAppModel = useWineInstalledAppModel();
  const wineScriptModel = useWineScriptModel();
  const wineAppConfigModel = useWineAppConfigModel();
  const wineEngineModel = useWineEngineModel();
  const { createWineAppPipeline, ...context } = useWineAppPipeline();
  const dispatch = useDispatch<Dispatch<WineAppPipelineAction>>();

  const runWineAppPipelineByAppConfigId = async (appConfigId: string | undefined) => {
    try {
      const wineApp = wineAppModel.selectWineApp(store.getState(), appConfigId);
      const wineAppConfig = wineAppConfigModel.selectWineAppConfig(store.getState(), appConfigId);

      if (wineApp === undefined || wineAppConfig === undefined) {
        throw Error('Wine application config not found.');
      }

      await runWineAppPipelineByAppConfig({
        ...wineAppConfig,
        name: wineApp.name,
        iconURL: wineApp.iconURL
      });
    } catch (error) {
      appModel.dispatchError(error);
    }
  };

  const loadWineAppPipelineByAppName = async (appName: string) => {
    const installedWineApp = wineInstalledAppModel.selectWineInstalledAppByRealName(
      store.getState(),
      appName
    );
    const appConfig = installedWineApp?.pipeline?.appConfig;

    try {
      if (appConfig === undefined) throw Error('Wine application config not found.');
      return await loadWineAppPipelineByAppConfig({ ...appConfig, name: appName });
    } catch (error) {
      appModel.dispatchError(error);
      return;
    }
  };

  const loadWineAppPipelineByScriptKeyName = async (keyName: string) => {
    const script = wineScriptModel.selectWineScriptByKeyName(store.getState(), keyName);

    try {
      if (script === undefined) throw Error('Wine application config not found.');
      return await loadWineAppPipelineByAppConfig({
        ...script,
        name: script?.appName
      });
    } catch (error) {
      appModel.dispatchError(error);
      return;
    }
  };

  const loadWineAppPipelineByAppConfig = async (appConfig: WineAppConfig) => {
    let config = {
      ...appConfig,
      engineURLs: [...(appConfig.engineURLs || [])]
    };

    if (!config.engineURLs.length) {
      config = {
        ...appConfig,
        engineURLs: wineEngineModel.findEngineURLs(appConfig.engineVersion)
      };
    }

    const iconFile = config.iconFile;
    const { pipelineScripts, ...restConfig } = config;

    const pipeline = await createWineAppPipeline({
      appConfig: { ...restConfig, iconFile },
      debug: true,
      outputEveryMs: 1000,
      pipelineScripts
    });

    dispatchPatch(pipeline.getInitialStatus());

    pipeline.onUpdate((pipelineStatus) => {
      dispatchPatch({ ...pipelineStatus });
    });

    return pipeline;
  };

  const runWineAppPipelineByAppName = async (appName: string) => {
    try {
      const pipeline = await loadWineAppPipelineByAppName(appName);
      const promise = pipeline?.run();
      await sleep(200);
      wineInstalledAppModel.listAll();
      await promise;
    } catch (error) {
      appModel.dispatchError(error);
    }
  };

  const runWineAppPipelineByScriptKeyName = async (keyName: string) => {
    try {
      const pipeline = await loadWineAppPipelineByScriptKeyName(keyName);
      const promise = pipeline?.run();
      await sleep(200);
      wineInstalledAppModel.listAll();
      await promise;
    } catch (error) {
      appModel.dispatchError(error);
    }
  };

  const runWineAppPipelineByAppConfig = async (appConfig: WineAppConfig) => {
    try {
      const pipeline = await loadWineAppPipelineByAppConfig(appConfig);
      pipeline.run();
    } catch (error) {
      appModel.dispatchError(error);
    }
  };

  const killWineAppPipeline = (id: string | undefined) => context.killWineAppPipeline(id);

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
    loadWineAppPipelineByAppName,
    runWineAppPipelineByAppConfig,
    runWineAppPipelineByAppConfigId,
    runWineAppPipelineByAppName,
    runWineAppPipelineByScriptKeyName,
    killWineAppPipeline,
    clearWineAppPipeline,
    dispatchPatch,
    selectWineAppPipelineStatus
  };
};
