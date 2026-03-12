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
import { ProcessStatus } from '@constants/enums';

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

  const runApp = async (appName?: string) => {
    try {
      const wineInstalledApp = selectWineInstalledApp(store.getState(), appName);

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

  const killApp = async (appName: string) => {
    try {
      const wineInstalledApp = selectWineInstalledApp(store.getState(), appName);

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

      return wineInstalledApps;
    }
  );

  const selectWineInstalledApp = createSelector(
    [
      (state: RootState) => selectWineInstalledApps(state),
      (_: RootState, appName?: string | null) => appName
    ],
    (wineInstalledApps, appName) =>
      wineInstalledApps?.find((item) => item.name?.toLowerCase() == appName?.toLowerCase())
  );

  const selectPipelineIsResumable = createSelector([selectWineInstalledApp], (wineInstalledApp) => {
    const jobs = wineInstalledApp?.pipeline?.jobs || [];
    let isResumable = false;
    for (const job of jobs) {
      if (
        job.steps.some(
          (item) =>
            item.status === ProcessStatus.Pending ||
            item.status === ProcessStatus.Error ||
            item.status === ProcessStatus.Cancelled
        )
      ) {
        isResumable = true;
        break;
      }
    }
    return isResumable;
  });

  return {
    loaders: state.loaders,
    listAll,
    dispatchListAll,
    runApp,
    killApp,
    dispatchPatch,
    selectWineInstalledAppState,
    selectWineInstalledApps,
    selectWineInstalledApp,
    selectPipelineIsResumable
  };
};
