import { WineAppConfigActionType as ActionType } from '@constants/actionTypes';
import { WineAppConfigAction } from '@interfaces/WineAppConfigAction';
import { WineAppConfigState } from '@interfaces/WineAppConfigState';
import { listAll, remove, save } from './handlers';

const initialState: WineAppConfigState = {
  wineAppsConfigs: []
};

export const wineAppConfigState = (state = initialState, action: WineAppConfigAction) => {
  switch (action.type) {
    case ActionType.LIST_ALL:
      return listAll(action.wineAppsConfigs, state);
    case ActionType.SAVE:
      return save(action.wineAppConfig, state);
    case ActionType.REMOVE:
      return remove(action.appName, state);
    default:
      return state;
  }
};
