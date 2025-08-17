import { useDispatch } from 'react-redux';
import { Dispatch, createSelector } from '@reduxjs/toolkit';
import { store } from '@store';
import { useWineAppPipeline } from '@hocs/withWineAppPipelineProvider';
import { RootState } from '@interfaces/RootState';
import { WineAppPipelineAction } from '@interfaces/WineAppPipelineAction';
import { WineAppPipelineStatus } from '@interfaces/WineAppPipelineStatus';
import { useAppModel } from '@models/useAppModel';
import { useWineEngineModel } from '@models/useWineEngineModel';
import { WineAppPipelineActionType as ActionType } from '@constants/actionTypes';
import { useWineInstalledAppModel } from '@models/useWineInstalledAppModel';
import { sleep } from 'reactjs-shared-ui';
import { useWineAppConfigModel } from '@models/useWineAppConfigModel';

export const useWineAppPipelineModel = () => {
  const appModel = useAppModel();
  const wineInstalledAppModel = useWineInstalledAppModel();
  const wineAppConfigModel = useWineAppConfigModel();
  const wineEngineModel = useWineEngineModel();
  const { createWineAppPipeline, ...context } = useWineAppPipeline();
  const dispatch = useDispatch<Dispatch<WineAppPipelineAction>>();

  const loadWineAppPipeline = async (appName: string) => {
    const appConfig = wineAppConfigModel.selectWineAppConfig(store.getState(), appName);

    try {
      if (appConfig === undefined) throw Error('Wine application config not found.');
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
    } catch (error) {
      appModel.dispatchError(error);
      return;
    }
  };

  const runWineAppPipeline = async (appName: string) => {
    try {
      const pipeline = await loadWineAppPipeline(appName);
      const promise = pipeline?.run();
      await sleep(200);
      wineInstalledAppModel.listAll();
      await promise;
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
    runWineAppPipeline,
    killWineAppPipeline,
    clearWineAppPipeline,
    dispatchPatch,
    selectWineAppPipelineStatus
  };
};
