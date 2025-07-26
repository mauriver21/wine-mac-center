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
import { WineAppMode } from '@constants/enums';

export const useWineAppPipelineModel = () => {
  const appModel = useAppModel();
  const wineAppModel = useWineAppModel();
  const wineInstalledAppModel = useWineInstalledAppModel();
  const wineAppConfigModel = useWineAppConfigModel();
  const wineEngineModel = useWineEngineModel();
  const { createWineAppPipeline, ...context } = useWineAppPipeline();
  const dispatch = useDispatch<Dispatch<WineAppPipelineAction>>();

  const runWineAppPipelineByAppConfigId = async (
    appConfigId: string | undefined,
    options: { mode: WineAppMode }
  ) => {
    try {
      const wineApp = wineAppModel.selectWineApp(store.getState(), appConfigId);
      const wineAppConfig = wineAppConfigModel.selectWineAppConfig(store.getState(), appConfigId);

      if (wineApp === undefined || wineAppConfig === undefined) {
        throw Error('Wine application config not found.');
      }

      await runWineAppPipelineByAppConfig(
        {
          ...wineAppConfig,
          id: wineAppConfig.id,
          name: wineApp.name,
          iconURL: wineApp.iconURL
        },
        { mode: options.mode }
      );
    } catch (error) {
      appModel.dispatchError(error);
    }
  };

  const loadWineAppPipelineByAppName = async (appName: string, options: { mode: WineAppMode }) => {
    const installedWineApp = wineInstalledAppModel.selectWineInstalledAppByRealName(
      store.getState(),
      appName
    );
    const appConfig = installedWineApp?.pipeline?.appConfig;

    try {
      if (appConfig === undefined) throw Error('Wine application config not found.');
      return await loadWineAppPipelineByAppConfig(
        { ...appConfig, name: appName },
        {
          mode: options.mode
        }
      );
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
    options: { mode: WineAppMode }
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
      mode: options.mode
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

  const runWineAppPipelineByAppName = async (appName: string, options: { mode: WineAppMode }) => {
    try {
      const pipeline = await loadWineAppPipelineByAppName(appName, { mode: options.mode });
      pipeline?.run();
    } catch (error) {
      appModel.dispatchError(error);
    }
  };

  const runWineAppPipelineByAppConfig = async (
    appConfig: Omit<WineAppConfig, 'engineURLs'> & {
      engineURLs?: string[];
      name: string;
    },
    options: { mode: WineAppMode }
  ) => {
    try {
      const pipeline = await loadWineAppPipelineByAppConfig(appConfig, { mode: options.mode });
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
