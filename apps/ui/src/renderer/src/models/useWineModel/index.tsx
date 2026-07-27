import { WineActionType as ActionType } from '@constants/actionTypes';
import { RootState } from '@interfaces/RootState';
import { WineAction } from '@interfaces/WineAction';
import { WineState } from '@interfaces/WineState';
import { useWineApiClient } from '@api-clients/useWineApiClient';
import { useAppModel } from '@models/useAppModel';
import { Dispatch, createSelector } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';

const OUTPUT_DISPATCH_INTERVAL_MS = 100;

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

  const dispatchDependenciesInstallationOutput = (
    dependenciesInstallationOutput: WineState['dependenciesInstallationOutput']
  ) => {
    dispatch({
      type: ActionType.SET_DEPENDENCIES_INSTALLATION_OUTPUT,
      dependenciesInstallationOutput
    });
  };

  const installWineBuildDependencies = async () => {
    let output = '';
    let pendingOutput = '';
    let outputTimeout: ReturnType<typeof setTimeout> | undefined;

    const flushOutput = () => {
      if (!pendingOutput) return;

      output += pendingOutput;
      pendingOutput = '';
      outputTimeout = undefined;
      dispatchDependenciesInstallationOutput(output);
    };

    const handleOutput = (data: string) => {
      pendingOutput += data;
      if (outputTimeout === undefined) {
        outputTimeout = setTimeout(flushOutput, OUTPUT_DISPATCH_INTERVAL_MS);
      }
    };

    try {
      dispatchLoader({ installingDependencies: true });
      dispatchDependenciesInstallationOutput('');
      await wineApiClient.installWineBuildDependencies(handleOutput);
    } catch (error) {
      appModel.dispatchError(error);
    } finally {
      if (outputTimeout !== undefined) clearTimeout(outputTimeout);
      flushOutput();
      dispatchLoader({ installingDependencies: false });
    }
  };

  const selectWineState = (state: RootState) => state.wineState;
  const selectRepositoryDownloaded = createSelector(
    [selectWineState],
    (state) => state.repositoryDownloaded
  );
  const selectWineLoaders = createSelector([selectWineState], (state) => state.loaders);
  const selectDependenciesInstallationOutput = createSelector(
    [selectWineState],
    (state) => state.dependenciesInstallationOutput
  );

  return {
    checkWineRepository,
    downloadWineRepository,
    installWineBuildDependencies,
    selectDependenciesInstallationOutput,
    selectRepositoryDownloaded,
    selectWineLoaders,
    selectWineState,
    wineRepositoryPath: wineApiClient.wineRepositoryPath
  };
};
