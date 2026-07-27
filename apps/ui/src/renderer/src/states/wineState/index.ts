import { WineActionType } from '@constants/actionTypes';
import { WineAction } from '@interfaces/WineAction';
import { WineState } from '@interfaces/WineState';
import { loaders, setDependenciesInstallationOutput, setRepositoryDownloaded } from './handlers';

const initialState: WineState = {
  repositoryDownloaded: false,
  dependenciesInstallationOutput: '',
  loaders: {
    checkingRepository: false,
    downloadingRepository: false,
    installingDependencies: false
  }
};

export const wineState = (state: WineState = initialState, action: WineAction): WineState => {
  switch (action.type) {
    case WineActionType.SET_REPOSITORY_DOWNLOADED:
      return setRepositoryDownloaded(action.repositoryDownloaded, state);
    case WineActionType.SET_DEPENDENCIES_INSTALLATION_OUTPUT:
      return setDependenciesInstallationOutput(action.dependenciesInstallationOutput, state);
    case WineActionType.LOADING:
      return loaders(action.loaders, state);
    default:
      return state;
  }
};
