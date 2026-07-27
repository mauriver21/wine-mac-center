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

export const loaders = (
  nextLoaders: Partial<WineState['loaders']>,
  state: WineState
): WineState => ({
  ...state,
  loaders: { ...state.loaders, ...nextLoaders }
});
