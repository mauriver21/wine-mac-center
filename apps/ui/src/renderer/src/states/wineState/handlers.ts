import { WineState } from '@interfaces/WineState';

export const setRepositoryDownloaded = (
  repositoryDownloaded: WineState['repositoryDownloaded'],
  state: WineState
): WineState => ({ ...state, repositoryDownloaded });

export const setDependenciesInstallationOutput = (
  dependenciesInstallationOutput: WineState['dependenciesInstallationOutput'],
  state: WineState
): WineState => ({ ...state, dependenciesInstallationOutput });

export const setWineTags = (wineTags: WineState['wineTags'], state: WineState): WineState => ({
  ...state,
  wineTags
});

export const setSelectedWineTag = (
  selectedWineTag: WineState['selectedWineTag'],
  state: WineState
): WineState => ({ ...state, selectedWineTag });

export const setWineCheckoutOutput = (
  wineCheckoutOutput: WineState['wineCheckoutOutput'],
  state: WineState
): WineState => ({ ...state, wineCheckoutOutput });

export const setSelectedWineArch = (
  selectedWineArch: WineState['selectedWineArch'],
  state: WineState
): WineState => ({ ...state, selectedWineArch });

export const setVerifyBeforeBuild = (
  verifyBeforeBuild: WineState['verifyBeforeBuild'],
  state: WineState
): WineState => ({ ...state, verifyBeforeBuild });

export const setWineBuildOutput = (
  wineBuildOutput: WineState['wineBuildOutput'],
  state: WineState
): WineState => ({ ...state, wineBuildOutput });

export const setWineArchs = (wineArchs: WineState['wineArchs'], state: WineState): WineState => ({
  ...state,
  wineArchs
});

export const loaders = (
  nextLoaders: Partial<WineState['loaders']>,
  state: WineState
): WineState => ({
  ...state,
  loaders: { ...state.loaders, ...nextLoaders }
});
