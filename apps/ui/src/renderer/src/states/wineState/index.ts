import { WineActionType } from '@constants/actionTypes';
import { WineAction } from '@interfaces/WineAction';
import { WineState } from '@interfaces/WineState';
import { loaders, setRepositoryDownloaded } from './handlers';

const initialState: WineState = {
  repositoryDownloaded: false,
  loaders: { checkingRepository: false, downloadingRepository: false }
};

export const wineState = (state: WineState = initialState, action: WineAction): WineState => {
  switch (action.type) {
    case WineActionType.SET_REPOSITORY_DOWNLOADED:
      return setRepositoryDownloaded(action.repositoryDownloaded, state);
    case WineActionType.LOADING:
      return loaders(action.loaders, state);
    default:
      return state;
  }
};
