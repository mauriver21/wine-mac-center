import { useState } from 'react';
import { Dispatch, createSelector } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import { useWineAppConfigApiClient } from '@api-clients/useWineAppConfigApiClient';
import { RootState } from '@interfaces/RootState';
import { WineAppConfig } from '@interfaces/WineAppConfig';
import { WineAppConfigActionType as ActionType } from '@constants/actionTypes';
import { WineAppConfigAction } from '@interfaces/WineAppConfigAction';
import { useAppModel } from '@models/useAppModel';
import { useWineEngineModel } from '@models/useWineEngineModel';

export const useWineAppConfigModel = () => {
  const [state, setState] = useState({
    loaders: { reading: false }
  });
  const appModel = useAppModel();
  const wineEngineModel = useWineEngineModel();
  const wineAppConfigApiClient = useWineAppConfigApiClient();
  const dispatch = useDispatch<Dispatch<WineAppConfigAction>>();

  const read = async (appName: string) => {
    try {
      appName;
      dispatchLoader({ reading: true });

      const wineAppConfig = await wineAppConfigApiClient.read(wineApp.scriptUrl);

      const engineURLs = wineEngineModel.findEngineURLs(wineAppConfig.engineVersion);

      dispatchPatch({ ...wineAppConfig, engineURLs });
    } catch (error) {
      appModel.dispatchError(error);
    } finally {
      dispatchLoader({ reading: false });
    }
  };

  const dispatchPatch = (wineAppConfig: WineAppConfig) => {
    dispatch({
      type: ActionType.PATCH,
      wineAppConfig
    });
  };
  const dispatchLoader = (loaders: Partial<(typeof state)['loaders']>) => {
    setState((prev) => ({ ...prev, loaders: { ...prev.loaders, ...loaders } }));
  };

  const selectWineAppConfigState = (state: RootState) => state.wineAppConfigState;
  const selectWineAppsConfigs = createSelector(
    [selectWineAppConfigState],
    (wineAppConfigState) => wineAppConfigState.wineAppsConfigs
  );
  const selectWineAppConfig = createSelector(
    [selectWineAppsConfigs, (_: RootState, appConfigId?: string) => appConfigId],
    (wineAppConfigs, appName) => wineAppConfigs?.find((item) => item.name == appName)
  );

  return {
    loaders: state.loaders,
    read,
    dispatchPatch,
    selectWineAppConfigState,
    selectWineAppsConfigs,
    selectWineAppConfig
  };
};
