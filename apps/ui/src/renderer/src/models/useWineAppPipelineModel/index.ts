import { useDispatch } from 'react-redux';
import { Dispatch, createSelector } from '@reduxjs/toolkit';
import { store } from '@store';
import { useWineAppPipeline } from '@hocs/withWineAppPipelineProvider';
import { RootState } from '@interfaces/RootState';
import { WineAppConfig } from '@interfaces/WineAppConfig';
import { WineAppPipelineAction } from '@interfaces/WineAppPipelineAction';
import { WineAppPipelineStatusItem } from '@interfaces/WineAppPipelineStatusItem';
import { useAppModel } from '@models/useAppModel';
import { useWineAppConfigModel } from '@models/useWineAppConfigModel';
import { useWineAppModel } from '@models/useWineAppModel';
import { useWineEngineModel } from '@models/useWineEngineModel';
import { WineAppPipelineActionType as ActionType } from '@constants/actionTypes';
import { useWineInstalledAppModel } from '@models/useWineInstalledAppModel';

export const useWineAppPipelineModel = () => {
  const appModel = useAppModel();
  const wineAppModel = useWineAppModel();
  const installedWineAppModel = useWineInstalledAppModel();
  const wineAppConfigModel = useWineAppConfigModel();
  const wineEngineModel = useWineEngineModel();
  const { createWineAppPipeline, ...context } = useWineAppPipeline();
  const dispatch = useDispatch<Dispatch<WineAppPipelineAction>>();

  const runWineAppPipelineByAppConfigId = async (appConfigId?: string) => {
    try {
      const wineApp = wineAppModel.selectWineApp(store.getState(), appConfigId);
      const wineAppConfig = wineAppConfigModel.selectWineAppConfig(store.getState(), appConfigId);

      if (wineApp === undefined || wineAppConfig === undefined) {
        throw Error('Wine application config not found.');
      }

      await runWineAppPipelineByAppConfig({
        ...wineAppConfig,
        id: wineAppConfig.id,
        name: wineApp.name,
        iconURL: wineApp.iconURL
      });
    } catch (error) {
      appModel.dispatchError(error);
    }
  };

  const loadWineAppPipelineByAppName = async (appName: string) => {
    const installedWineApp = installedWineAppModel.selectWineInstalledAppByRealName(
      store.getState(),
      appName
    );
    try {
      if (installedWineApp === undefined) throw Error('Wine application config not found.');
      return await loadWineAppPipelineByAppConfig(installedWineApp, { keepAppName: true });
    } catch (error) {
      appModel.dispatchError(error);
      return;
    }
  };

  const loadWineAppPipelineByAppConfig = async (
    appConfig: Omit<WineAppConfig, 'engineURLs'> & {
      engineURLs?: string[];
      name: string;
    },
    options?: { keepAppName?: boolean }
  ) => {
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

    const pipeline = await createWineAppPipeline({
      appConfig: { ...config, iconFile },
      debug: true,
      outputEveryMs: 1000,
      keepAppName: options?.keepAppName
    });

    dispatchPatch({
      ...pipeline.getInitialStatus(),
      appConfigId: appConfig.id
    });

    pipeline.onUpdate((pipelineStatus) => {
      dispatchPatch({ ...pipelineStatus, appConfigId: appConfig.id });
    });

    return pipeline;
  };

  const runWineAppPipelineByAppName = async (appName: string) => {
    try {
      const pipeline = await loadWineAppPipelineByAppName(appName);
      pipeline?.run();
    } catch (error) {
      appModel.dispatchError(error);
    }
  };

  const runWineAppPipelineByAppConfig = async (
    appConfig: Omit<WineAppConfig, 'engineURLs'> & {
      engineURLs?: string[];
      name: string;
    }
  ) => {
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

  const dispatchPatch = (pipelineStatus: WineAppPipelineStatusItem) => {
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
  const selectWineAppPipelineMeta = createSelector(
    [selectWineAppPipelineStatus],
    (wineAppPipeline) => {
      return {
        wineApp: wineAppModel.selectWineApp(store.getState(), wineAppPipeline?.appConfigId),
        wineAppConfig: wineAppConfigModel.selectWineAppConfig(
          store.getState(),
          wineAppPipeline?.appConfigId
        )
      };
    }
  );
  const selectWineAppPipelineWithMeta = createSelector(
    [selectWineAppPipelineStatus, selectWineAppPipelineMeta],
    (wineAppsPipeline, meta) => ({ ...wineAppsPipeline, meta })
  );

  return {
    loadWineAppPipelineByAppName,
    runWineAppPipelineByAppConfig,
    runWineAppPipelineByAppConfigId,
    runWineAppPipelineByAppName,
    killWineAppPipeline,
    clearWineAppPipeline,
    dispatchPatch,
    selectWineAppPipelineStatus,
    selectWineAppPipelineMeta,
    selectWineAppPipelineWithMeta
  };
};
