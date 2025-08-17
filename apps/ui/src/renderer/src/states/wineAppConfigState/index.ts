import { WineAppConfigActionType as ActionType } from '@constants/actionTypes';
import { WineAppConfigAction } from '@interfaces/WineAppConfigAction';
import { WineAppConfigState } from '@interfaces/WineAppConfigState';
import { listAll, patch } from './handlers';

const initialState: WineAppConfigState = {
  wineAppsConfigs: []
};

export const wineAppConfigState = (state = initialState, action: WineAppConfigAction) => {
  switch (action.type) {
    case ActionType.LIST_ALL:
      return listAll(action.wineAppsConfigs, state);
    case ActionType.PATCH:
      return patch(action.name, action.wineAppConfig, state);
    default:
      return state;
  }
};
