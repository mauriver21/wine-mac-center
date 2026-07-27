import { WineActionType as ActionType } from '@constants/actionTypes';
import { RootState } from '@interfaces/RootState';
import { WineAction } from '@interfaces/WineAction';
import { WineState } from '@interfaces/WineState';
import { useWineApiClient } from '@api-clients/useWineApiClient';
import { useAppModel } from '@models/useAppModel';
import { Dispatch, createSelector } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';

export const useWineModel = () => {
  const appModel = useAppModel();
  const wineApiClient = useWineApiClient();
  const dispatch = useDispatch<Dispatch<WineAction>>();

  const dispatchLoader = (loaders: Partial<WineState['loaders']>) => {
    dispatch({ type: ActionType.LOADING, loaders });
  };

  const checkWineRepository = async () => {
    try {
      dispatchLoader({ checkingRepository: true });
      dispatch({
        type: ActionType.SET_REPOSITORY_DOWNLOADED,
        repositoryDownloaded: await wineApiClient.isWineRepositoryDownloaded()
      });
    } catch (error) {
      appModel.dispatchError(error);
    } finally {
      dispatchLoader({ checkingRepository: false });
    }
  };

  const downloadWineRepository = async () => {
    try {
      dispatchLoader({ downloadingRepository: true });
      await wineApiClient.downloadWineRepository();
      await checkWineRepository();
    } catch (error) {
      appModel.dispatchError(error);
    } finally {
      dispatchLoader({ downloadingRepository: false });
    }
  };

  const selectWineState = (state: RootState) => state.wineState;
  const selectRepositoryDownloaded = createSelector(
    [selectWineState],
    (state) => state.repositoryDownloaded
  );
  const selectWineLoaders = createSelector([selectWineState], (state) => state.loaders);

  return {
    checkWineRepository,
    downloadWineRepository,
    selectRepositoryDownloaded,
    selectWineLoaders,
    selectWineState,
    wineRepositoryPath: wineApiClient.wineRepositoryPath
  };
};
