import { useState } from 'react';
import { WineInstalledAppActionType as ActionType } from '@constants/actionTypes';
import { Dispatch, createSelector } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import { store } from '@store';
import { useWineInstalledAppApiClient } from '@api-clients/useWineInstalledAppApiClient';
import { RootState } from '@interfaces/RootState';
import { SortDirection } from '@interfaces/SortDirection';
import { WineInstalledApp } from '@interfaces/WineInstalledApp';
import { WineInstalledAppAction } from '@interfaces/WineInstalledAppAction';
import { useAppModel } from '@models/useAppModel';
import { objectMatchCriteria } from '@utils/objectMatchCriteria';

export const useWineInstalledAppModel = () => {
  const [state, setState] = useState({
    loaders: { listingAll: false }
  });
  const appModel = useAppModel();
  const wineInstalledAppApiClient = useWineInstalledAppApiClient();
  const dispatch = useDispatch<Dispatch<WineInstalledAppAction>>();

  const listAll = async () => {
    try {
      const wineApps = selectWineInstalledApps(store.getState());
      !wineApps?.length && dispatchLoader({ listingAll: true });
      dispatchListAll(await wineInstalledAppApiClient.listAll());
    } catch (error) {
      appModel.dispatchError(error);
    } finally {
      dispatchLoader({ listingAll: false });
    }
  };

  const runApp = async (appId?: string) => {
    try {
      const wineInstalledApp = selectWineInstalledAppById(store.getState(), appId);

      if (wineInstalledApp === undefined) {
        throw new Error('No installed app found.');
      }

      const process = await wineInstalledAppApiClient.runApp(wineInstalledApp.appPath);

      dispatchPatch(wineInstalledApp.id, { pid: process.pid });
    } catch (error) {
      appModel.dispatchError(error);
    } finally {
      dispatchLoader({ listingAll: false });
    }
  };

  const killApp = async (appId?: string) => {
    try {
      const wineInstalledApp = selectWineInstalledAppById(store.getState(), appId);

      if (wineInstalledApp === undefined) {
        throw new Error('No installed app found.');
      }

      if (wineInstalledApp.pid === undefined) {
        throw new Error('No app running.');
      }

      await wineInstalledAppApiClient.killApp(wineInstalledApp.pid);

      dispatchPatch(wineInstalledApp.id, { pid: undefined });
    } catch (error) {
      appModel.dispatchError(error);
    } finally {
      dispatchLoader({ listingAll: false });
    }
  };

  const dispatchListAll = (wineInstalledApps: WineInstalledApp[]) => {
    dispatch({
      type: ActionType.LIST_ALL,
      wineInstalledApps
    });
  };
  const dispatchPatch = (appId: string, wineInstalledApp: Partial<WineInstalledApp>) => {
    dispatch({
      type: ActionType.PATCH,
      appId,
      wineInstalledApp
    });
  };
  const dispatchLoader = (loaders: Partial<(typeof state)['loaders']>) => {
    setState((prev) => ({ ...prev, loaders: { ...prev.loaders, ...loaders } }));
  };

  const selectWineInstalledAppState = (state: RootState) => state.wineInstalledAppState;
  const selectWineInstalledApps = createSelector(
    [
      selectWineInstalledAppState,
      (_: RootState, filters?: { criteria?: string; order?: SortDirection }) => filters
    ],
    (wineInstalledAppState, filters) => {
      let wineInstalledApps = wineInstalledAppState.wineInstalledApps;

      const { criteria, order } = filters || {};

      if (criteria) {
        wineInstalledApps = wineInstalledApps?.filter((item) =>
          objectMatchCriteria(item, criteria, ['name'])
        );
      }

      if (order === 'asc' || order === undefined) {
        wineInstalledApps = [...(wineInstalledApps || [])]?.sort((a, b) =>
          a.name.localeCompare(b.name)
        );
      }

      if (order === 'desc') {
        wineInstalledApps = [...(wineInstalledApps || [])]?.sort((a, b) =>
          b.name.localeCompare(a.name)
        );
      }

      return wineInstalledApps?.map((item) => ({
        ...item,
        realAppName: item.appPath.split('/').pop()?.replace(/\.app/, '')
      }));
    }
  );
  const selectWineInstalledAppById = createSelector(
    [(state: RootState) => selectWineInstalledApps(state), (_: RootState, id?: string) => id],
    (wineInstalledApps, id) => wineInstalledApps?.find((item) => item.id == id)
  );

  const selectWineInstalledAppByRealName = createSelector(
    [
      (state: RootState) => selectWineInstalledApps(state),
      (_: RootState, realAppName?: string | null) => realAppName
    ],
    (wineInstalledApps, realAppName) =>
      wineInstalledApps?.find(
        (item) => item.realAppName?.toLowerCase() == realAppName?.toLowerCase()
      )
  );

  return {
    loaders: state.loaders,
    listAll,
    dispatchListAll,
    runApp,
    killApp,
    selectWineInstalledAppState,
    selectWineInstalledApps,
    selectWineInstalledAppById,
    selectWineInstalledAppByRealName
  };
};
