import { WineActionType as ActionType } from '@constants/actionTypes';
import { RootState } from '@interfaces/RootState';
import { WineAction } from '@interfaces/WineAction';
import { WineState } from '@interfaces/WineState';
import { useWineApiClient } from '@api-clients/useWineApiClient';
import { useAppModel } from '@models/useAppModel';
import { store } from '@store';
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

  const abortWineBuildDependenciesInstallation = async () => {
    try {
      dispatchLoader({ abortingDependenciesInstallation: true });
      await wineApiClient.abortWineBuildDependenciesInstallation();
    } catch (error) {
      appModel.dispatchError(error);
    } finally {
      dispatchLoader({ abortingDependenciesInstallation: false });
    }
  };

  const getWineTags = async () => {
    try {
      dispatchLoader({ listingTags: true });
      dispatch({ type: ActionType.SET_TAGS, wineTags: await wineApiClient.getWineTags() });
    } catch (error) {
      appModel.dispatchError(error);
    } finally {
      dispatchLoader({ listingTags: false });
    }
  };

  const getWineArchs = async () => {
    try {
      dispatchLoader({ listingArchs: true });
      const wineArchs = await wineApiClient.getWineArchs();
      dispatch({ type: ActionType.SET_ARCHS, wineArchs });

      const selectedWineArch = selectSelectedWineArch(store.getState());
      if (!wineArchs.includes(selectedWineArch)) {
        selectWineArch(wineArchs[0] || 'wine64');
      }
    } catch (error) {
      appModel.dispatchError(error);
    } finally {
      dispatchLoader({ listingArchs: false });
    }
  };

  const checkoutWineTag = async (tag: string) => {
    let output = `$ git checkout --detach refs/tags/${tag}\n`;
    const updateOutput = (data: string) => {
      output += data;
      dispatch({ type: ActionType.SET_CHECKOUT_OUTPUT, wineCheckoutOutput: output });
    };

    try {
      dispatchLoader({ checkingOutTag: true });
      dispatch({ type: ActionType.SET_CHECKOUT_OUTPUT, wineCheckoutOutput: output });
      await wineApiClient.checkoutWineTag(tag, updateOutput);
      dispatch({ type: ActionType.SET_SELECTED_TAG, selectedWineTag: tag });
    } catch (error) {
      appModel.dispatchError(error);
    } finally {
      dispatchLoader({ checkingOutTag: false });
    }
  };

  const selectWineArch = (selectedWineArch: string) => {
    dispatch({ type: ActionType.SET_SELECTED_ARCH, selectedWineArch });
  };

  const setVerifyBeforeBuild = (verifyBeforeBuild: boolean) => {
    dispatch({ type: ActionType.SET_VERIFY_BEFORE_BUILD, verifyBeforeBuild });
  };

  const buildWine = async (tag: string, arch: string, verifyBeforeBuild: boolean) => {
    let output = verifyBeforeBuild
      ? `$ verifyWineBuildDependencies.sh ${tag} ${arch}\n`
      : `$ buildWineEngine.sh ${tag} ${arch}\n`;
    let pendingOutput = '';
    let outputTimeout: ReturnType<typeof setTimeout> | undefined;

    const flushOutput = () => {
      if (!pendingOutput) return;
      output += pendingOutput;
      pendingOutput = '';
      outputTimeout = undefined;
      dispatch({ type: ActionType.SET_BUILD_OUTPUT, wineBuildOutput: output });
    };
    const handleOutput = (data: string) => {
      pendingOutput += data;
      if (outputTimeout === undefined) {
        outputTimeout = setTimeout(flushOutput, OUTPUT_DISPATCH_INTERVAL_MS);
      }
    };

    try {
      dispatchLoader({ buildingWine: true });
      dispatch({ type: ActionType.SET_BUILD_OUTPUT, wineBuildOutput: output });
      if (verifyBeforeBuild) {
        const dependenciesVerified = await wineApiClient.verifyWineBuildDependencies(
          tag,
          arch,
          handleOutput
        );
        if (!dependenciesVerified) return;

        handleOutput(`\nDependency verification passed.\n$ buildWineEngine.sh ${tag} ${arch}\n`);
      }
      await wineApiClient.buildWine(tag, arch, handleOutput);
    } catch (error) {
      appModel.dispatchError(error);
    } finally {
      if (outputTimeout !== undefined) clearTimeout(outputTimeout);
      flushOutput();
      dispatchLoader({ buildingWine: false });
    }
  };

  const abortWineBuild = async () => {
    try {
      dispatchLoader({ abortingWineBuild: true });
      await wineApiClient.abortWineBuild();
    } catch (error) {
      appModel.dispatchError(error);
    } finally {
      dispatchLoader({ abortingWineBuild: false });
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
  const selectWineTags = createSelector([selectWineState], (state) => state.wineTags);
  const selectSelectedWineTag = createSelector(
    [selectWineState],
    (state) => state.selectedWineTag
  );
  const selectWineCheckoutOutput = createSelector(
    [selectWineState],
    (state) => state.wineCheckoutOutput
  );
  const selectSelectedWineArch = createSelector(
    [selectWineState],
    (state) => state.selectedWineArch
  );
  const selectWineBuildOutput = createSelector(
    [selectWineState],
    (state) => state.wineBuildOutput
  );
  const selectVerifyBeforeBuild = createSelector(
    [selectWineState],
    (state) => state.verifyBeforeBuild
  );
  const selectWineArchs = createSelector([selectWineState], (state) => state.wineArchs);

  return {
    abortWineBuildDependenciesInstallation,
    abortWineBuild,
    buildWine,
    checkWineRepository,
    checkoutWineTag,
    downloadWineRepository,
    getWineTags,
    getWineArchs,
    installWineBuildDependencies,
    selectDependenciesInstallationOutput,
    selectRepositoryDownloaded,
    selectSelectedWineTag,
    selectSelectedWineArch,
    selectWineLoaders,
    selectWineState,
    selectWineTags,
    selectWineCheckoutOutput,
    selectWineBuildOutput,
    selectVerifyBeforeBuild,
    selectWineArchs,
    selectWineArch,
    setVerifyBeforeBuild
  };
};
