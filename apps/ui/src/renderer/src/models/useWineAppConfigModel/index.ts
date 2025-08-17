import { useState } from 'react';
import { WineAppConfigActionType as ActionType } from '@constants/actionTypes';
import { Dispatch, createSelector } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import { store } from '@store';
import { useWineAppConfigApiClient } from '@api-clients/useWineAppConfigApiClient';
import { RootState } from '@interfaces/RootState';
import { SortDirection } from '@interfaces/SortDirection';
import { WineAppConfigAction } from '@interfaces/WineAppConfigAction';
import { useAppModel } from '@models/useAppModel';
import { objectMatchCriteria } from '@utils/objectMatchCriteria';
import { WineAppConfig } from '@interfaces/WineAppConfig';

export const useWineAppConfigModel = () => {
  const [state, setState] = useState({
    loaders: { listingAll: false }
  });
  const appModel = useAppModel();
  const wineAppConfigApiClient = useWineAppConfigApiClient();
  const dispatch = useDispatch<Dispatch<WineAppConfigAction>>();

  const listAll = async () => {
    try {
      const wineAppConfigs = selectWineAppConfigs(store.getState());
      !wineAppConfigs?.length && dispatchLoader({ listingAll: true });
      dispatchListAll(await wineAppConfigApiClient.listAll());
    } catch (error) {
      appModel.dispatchError(error);
    } finally {
      dispatchLoader({ listingAll: false });
    }
  };

  const dispatchListAll = (wineAppsConfigs: WineAppConfig[]) => {
    dispatch({
      type: ActionType.LIST_ALL,
      wineAppsConfigs
    });
  };
  const dispatchPatch = (name: string, wineAppConfig: Partial<WineAppConfig>) => {
    dispatch({
      type: ActionType.PATCH,
      name,
      wineAppConfig
    });
  };
  const dispatchLoader = (loaders: Partial<(typeof state)['loaders']>) => {
    setState((prev) => ({ ...prev, loaders: { ...prev.loaders, ...loaders } }));
  };

  const selectWineAppConfigState = (state: RootState) => state.wineAppConfigState;
  const selectWineAppConfigs = createSelector(
    [
      selectWineAppConfigState,
      (_: RootState, filters?: { criteria?: string; order?: SortDirection }) => filters
    ],
    (wineAppConfigState, filters) => {
      let wineAppsConfigs = wineAppConfigState.wineAppsConfigs;

      const { criteria, order } = filters || {};

      if (criteria) {
        wineAppsConfigs = wineAppsConfigs?.filter((item) =>
          objectMatchCriteria(item, criteria, ['name'])
        );
      }

      if (order === 'asc' || order === undefined) {
        wineAppsConfigs = [...(wineAppsConfigs || [])]?.sort((a, b) =>
          a.name.localeCompare(b.name)
        );
      }

      if (order === 'desc') {
        wineAppsConfigs = [...(wineAppsConfigs || [])]?.sort((a, b) =>
          b.name.localeCompare(a.name)
        );
      }

      return wineAppsConfigs;
    }
  );
  const selectWineAppConfig = createSelector(
    [(state: RootState) => selectWineAppConfigs(state), (_: RootState, name?: string) => name],
    (wineAppConfigs, name) => wineAppConfigs?.find((item) => item.name == name)
  );

  return {
    loaders: state.loaders,
    listAll,
    dispatchListAll,
    dispatchPatch,
    selectWineAppConfigState,
    selectWineAppConfigs,
    selectWineAppConfig
  };
};
