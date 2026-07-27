import { WineActionType } from '@constants/actionTypes';
import { WineAction } from '@interfaces/WineAction';
import { WineState } from '@interfaces/WineState';
import { Reducer } from '@reduxjs/toolkit';
import { persistReducer, PersistConfig } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import {
  loaders,
  setDependenciesInstallationOutput,
  setRepositoryDownloaded,
  setSelectedWineTag,
  setSelectedWineArch,
  setWineBuildOutput,
  setWineCheckoutOutput,
  setWineTags
} from './handlers';

const initialState: WineState = {
  repositoryDownloaded: false,
  dependenciesInstallationOutput: '',
  wineTags: [],
  selectedWineTag: '',
  wineCheckoutOutput: '',
  selectedWineArch: 'wow64',
  wineBuildOutput: '',
  loaders: {
    checkingRepository: false,
    downloadingRepository: false,
    installingDependencies: false,
    abortingDependenciesInstallation: false,
    listingTags: false,
    checkingOutTag: false,
    buildingWine: false
  }
};

export const wineState = (state: WineState = initialState, action: WineAction): WineState => {
  switch (action.type) {
    case WineActionType.SET_REPOSITORY_DOWNLOADED:
      return setRepositoryDownloaded(action.repositoryDownloaded, state);
    case WineActionType.SET_DEPENDENCIES_INSTALLATION_OUTPUT:
      return setDependenciesInstallationOutput(action.dependenciesInstallationOutput, state);
    case WineActionType.SET_TAGS:
      return setWineTags(action.wineTags, state);
    case WineActionType.SET_SELECTED_TAG:
      return setSelectedWineTag(action.selectedWineTag, state);
    case WineActionType.SET_CHECKOUT_OUTPUT:
      return setWineCheckoutOutput(action.wineCheckoutOutput, state);
    case WineActionType.SET_SELECTED_ARCH:
      return setSelectedWineArch(action.selectedWineArch, state);
    case WineActionType.SET_BUILD_OUTPUT:
      return setWineBuildOutput(action.wineBuildOutput, state);
    case WineActionType.LOADING:
      return loaders(action.loaders, state);
    default:
      return state;
  }
};

const persistConfig: PersistConfig<WineState> = {
  key: 'wineState',
  storage,
  whitelist: [
    'dependenciesInstallationOutput',
    'selectedWineTag',
    'wineCheckoutOutput',
    'selectedWineArch',
    'wineBuildOutput'
  ]
};

export const persistedWineState = persistReducer<WineState>(
  persistConfig,
  wineState as Reducer<WineState>
);
