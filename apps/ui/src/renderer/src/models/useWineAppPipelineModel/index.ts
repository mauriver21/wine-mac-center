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

export const useWineAppPipelineModel = () => {
  const appModel = useAppModel();
  const wineInstalledAppModel = useWineInstalledAppModel();
  const wineAppConfigModel = useWineAppConfigModel();
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

  const scaffoldWineApp = async (args: WineAppArgs) => {
    let { appName, config } = args;
    const originalAppName = appName;
    if (appName === undefined) throw new Error(`Invalid app name: ${appName}`);
    appName = await buildUniqueAppName(appName);

    if (args.origin !== ConfigOrigin.INSTALLED_APP) {
      config = await resolveWineAppConfig({ ...args, appName: originalAppName });
      if (config === undefined) throw new Error(`App config for ${appName} not found.`);
    }

    const wineApp = await createWineApp(appName, config);
    return new Promise<void>((resolve) =>
      wineApp.scaffold(
        { appIconURL: config?.iconURL, appArtWorkURL: config?.artworkURL },
        {
          onExit: () => {
            resolve(undefined);
          }
        }
      )
    );
  };

  const loadWineAppPipeline = async (appName: string) => {
    try {
      const pipeline = await createWineAppPipeline({
        appName,
        debug: true,
        outputEveryMs: 1000
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

  const buildUniqueAppName = async (appName: string) => {
    let count = 1;
    let newAppName = appName;

    while (true) {
      if ((await appExists(newAppName)) === false) {
        break;
      }
      newAppName = `${appName} ${count}`;
      count++;
    }

    return newAppName;
  };

  const runWineAppPipeline = async (args: WineAppArgs) => {
    try {
      await scaffoldWineApp(args);
      // Required delay for config.json be ready when loading wine pipeline.
      await sleep(200);
      const pipeline = await loadWineAppPipeline(args.appName);
      const promise = pipeline?.run();
      await sleep(200);
      wineInstalledAppModel.listAll();
      await promise;
    } catch (error) {
      appModel.dispatchError(error);
    }
  };

  const killWineAppPipeline = () => context.killWineAppPipeline();

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
    selectWineAppPipelineStatus
  };
};
