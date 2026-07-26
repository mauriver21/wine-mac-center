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
import { useI18n } from 'reactjs-shared-ui/i18next';
import { useLoadingDialog } from '@hooks/useLoadingDialog';

export const useWineAppConfigModel = () => {
  const { t } = useI18n();
  const loadingDialog = useLoadingDialog();
  const [state, setState] = useState({
    loaders: { listingAll: false }
  });
  const appModel = useAppModel();
  const wineAppConfigApiClient = useWineAppConfigApiClient();
  const dispatch = useDispatch<Dispatch<WineAppConfigAction>>();

  const downloadScript = async (appName: string) => {
    loadingDialog.open({ message: t('downloadingScript') });

    try {
      await wineAppConfigApiClient.downloadScript(appName);
    } catch (error) {
      appModel.dispatchError(error);
    } finally {
      loadingDialog.close();
    }
  };

  const create = async (data: WineAppConfig) => {
    try {
      const config = await wineAppConfigApiClient.create(data);
      dispatchSave(config);
    } catch (error) {
      appModel.dispatchError(error);
    }
  };

  const update = async (data: WineAppConfig & { originalAppName: string }) => {
    try {
      const config = await wineAppConfigApiClient.update(data);
      if (config === undefined) throw new Error(t('appConfigNotFound'));
      dispatchSave(config);
    } catch (error) {
      appModel.dispatchError(error);
    }
  };

  const read = async (args: WineAppArgs, options?: { throwError?: boolean }) => {
    try {
      const config = await wineAppConfigApiClient.read(args);
      if (config === undefined) throw new Error(t('appConfigNotFound'));
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

  const remove = async (appName: string) => {
    try {
      await wineAppConfigApiClient.remove(appName);
      dispatchRemove(appName);
    } catch (error) {
      appModel.dispatchError(error);
    }
  };

  const dispatchListAll = (wineAppsConfigs: WineAppConfig[]) => {
    dispatch({
      type: ActionType.LIST_ALL,
      wineAppsConfigs
    });
  };
  const dispatchSave = (wineAppConfig: WineAppConfig) => {
    const {
      iconFile: _,
      artworkFile: __,
      launcherImgFile: ___,
      ...restWineAppConfig
    } = wineAppConfig;
    dispatch({
      type: ActionType.SAVE,
      wineAppConfig: restWineAppConfig
    });
  };
  const dispatchRemove = (appName: string) => {
    dispatch({
      type: ActionType.REMOVE,
      appName
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

      if (origin && origin !== ConfigOrigin.ALL_EXCEPT_INSTALLED_APP) {
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
  const selectIsDownloadedScript = createSelector(
    [
      (state: RootState) => selectWineAppsConfigs(state),
      (_: RootState, name: string | undefined) => name
    ],
    (wineAppConfigs, name) => {
      return wineAppConfigs?.find(
        (item) => item.name == name && item.origin == ConfigOrigin.SCRIPTS
      );
    }
  );
  const selectWineAppConfig = createSelector(
    [
      (state: RootState) => selectWineAppsConfigs(state),
      (_: RootState, name: string | undefined) => name,
      (_: RootState, _name: string | undefined, origin: ConfigOrigin | undefined) => origin
    ],
    (wineAppConfigs, name, origin) => {
      if (origin === ConfigOrigin.ALL) {
        return wineAppConfigs?.find((item) => item.name == name);
      }
      return wineAppConfigs?.find((item) => item.name == name && item.origin == origin);
    }
  );

  return {
    loaders: state.loaders,
    create,
    update,
    listAll,
    read,
    remove,
    downloadScript,
    dispatchListAll,
    selectWineAppConfigState,
    selectWineAppsConfigs,
    selectWineAppConfig,
    selectIsDownloadedScript
  };
};
