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
import { ConfigOrigin } from '@constants/enums';
import { WineAppArgs } from '@interfaces/WineAppArgs';

export const useWineAppConfigModel = () => {
  const [state, setState] = useState({
    loaders: { listingAll: false }
  });
  const appModel = useAppModel();
  const wineAppConfigApiClient = useWineAppConfigApiClient();
  const dispatch = useDispatch<Dispatch<WineAppConfigAction>>();

  const read = async (args: WineAppArgs, options?: { throwError?: boolean }) => {
    try {
      const config = await wineAppConfigApiClient.read(args);
      if (config === undefined) throw new Error('App config not found.');
      dispatchSave(config);
      return config;
    } catch (error) {
      if (options?.throwError) {
        throw error;
      } else {
        appModel.dispatchError(error);
      }
      return;
    }
  };

  const listAll = async () => {
    try {
      const wineAppConfigs = selectWineAppsConfigs(store.getState());
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
  const dispatchSave = (wineAppConfig: WineAppConfig) => {
    dispatch({
      type: ActionType.SAVE,
      wineAppConfig
    });
  };
  const dispatchLoader = (loaders: Partial<(typeof state)['loaders']>) => {
    setState((prev) => ({ ...prev, loaders: { ...prev.loaders, ...loaders } }));
  };

  const selectWineAppConfigState = (state: RootState) => state.wineAppConfigState;
  const selectWineAppsConfigs = createSelector(
    [
      selectWineAppConfigState,
      (
        _: RootState,
        filters?: { criteria?: string; order?: SortDirection; origin?: ConfigOrigin }
      ) => filters
    ],
    (wineAppConfigState, filters) => {
      let wineAppsConfigs = wineAppConfigState.wineAppsConfigs;

      const { criteria, order, origin } = filters || {};

      if (origin) {
        wineAppsConfigs = wineAppsConfigs?.filter((item) => item.origin == origin);
      }

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
    [
      (state: RootState) => selectWineAppsConfigs(state),
      (_: RootState, name: string | undefined) => name,
      (_: RootState, _name: string | undefined, origin: ConfigOrigin | undefined) => origin
    ],
    (wineAppConfigs, name, origin) => {
      return wineAppConfigs?.find((item) => item.name == name && item.origin == origin);
    }
  );

  return {
    loaders: state.loaders,
    listAll,
    read,
    dispatchListAll,
    selectWineAppConfigState,
    selectWineAppsConfigs,
    selectWineAppConfig
  };
};
