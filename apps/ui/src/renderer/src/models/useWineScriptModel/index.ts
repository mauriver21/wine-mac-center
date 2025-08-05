import { useState } from 'react';
import { WineScriptActionType as ActionType } from '@constants/actionTypes';
import { Dispatch, createSelector } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import { store } from '@store';
import { useWineScriptApiClient } from '@api-clients/useWineScriptApiClient';
import { RootState } from '@interfaces/RootState';
import { SortDirection } from '@interfaces/SortDirection';
import { WineScriptAction } from '@interfaces/WineScriptAction';
import { useAppModel } from '@models/useAppModel';
import { objectMatchCriteria } from '@utils/objectMatchCriteria';
import { WineScript } from '@interfaces/WineScript';

export const useWineScriptModel = () => {
  const [state, setState] = useState({
    loaders: { listingAll: false }
  });
  const appModel = useAppModel();
  const wineScriptApiClient = useWineScriptApiClient();
  const dispatch = useDispatch<Dispatch<WineScriptAction>>();

  const listAll = async () => {
    try {
      const wineScripts = selectWineScripts(store.getState());
      !wineScripts?.length && dispatchLoader({ listingAll: true });
      dispatchListAll(await wineScriptApiClient.listAll());
    } catch (error) {
      appModel.dispatchError(error);
    } finally {
      dispatchLoader({ listingAll: false });
    }
  };

  const dispatchListAll = (wineScripts: WineScript[]) => {
    dispatch({
      type: ActionType.LIST_ALL,
      wineScripts
    });
  };
  const dispatchPatch = (keyName: string, wineScript: Partial<WineScript>) => {
    dispatch({
      type: ActionType.PATCH,
      keyName,
      wineScript
    });
  };
  const dispatchLoader = (loaders: Partial<(typeof state)['loaders']>) => {
    setState((prev) => ({ ...prev, loaders: { ...prev.loaders, ...loaders } }));
  };

  const selectWineScriptState = (state: RootState) => state.wineScriptState;
  const selectWineScripts = createSelector(
    [
      selectWineScriptState,
      (_: RootState, filters?: { criteria?: string; order?: SortDirection }) => filters
    ],
    (wineScriptState, filters) => {
      let wineScripts = wineScriptState.wineScripts;

      const { criteria, order } = filters || {};

      if (criteria) {
        wineScripts = wineScripts?.filter((item) => objectMatchCriteria(item, criteria, ['name']));
      }

      if (order === 'asc' || order === undefined) {
        wineScripts = [...(wineScripts || [])]?.sort((a, b) => a.keyName.localeCompare(b.keyName));
      }

      if (order === 'desc') {
        wineScripts = [...(wineScripts || [])]?.sort((a, b) => b.keyName.localeCompare(a.keyName));
      }

      return wineScripts;
    }
  );
  const selectWineScriptByKeyName = createSelector(
    [(state: RootState) => selectWineScripts(state), (_: RootState, keyName?: string) => keyName],
    (wineScripts, keyName) => wineScripts?.find((item) => item.keyName == keyName)
  );

  return {
    loaders: state.loaders,
    listAll,
    dispatchListAll,
    dispatchPatch,
    selectWineScriptState,
    selectWineScripts,
    selectWineScriptByKeyName
  };
};
