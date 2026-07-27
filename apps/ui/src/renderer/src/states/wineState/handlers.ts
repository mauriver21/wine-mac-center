import { WineState } from '@interfaces/WineState';

export const setRepositoryDownloaded = (
  repositoryDownloaded: WineState['repositoryDownloaded'],
  state: WineState
): WineState => ({ ...state, repositoryDownloaded });

export const loaders = (
  nextLoaders: Partial<WineState['loaders']>,
  state: WineState
): WineState => ({
  ...state,
  loaders: { ...state.loaders, ...nextLoaders }
});
