import { WineScriptActionType as ActionType } from '@constants/actionTypes';
import { WineScriptAction } from '@interfaces/WineScriptAction';
import { WineScriptState } from '@interfaces/WineScriptState';
import { listAll, patch } from './handlers';

const initialState: WineScriptState = {
  wineScripts: []
};

export const wineScriptState = (state = initialState, action: WineScriptAction) => {
  switch (action.type) {
    case ActionType.LIST_ALL:
      return listAll(action.wineScripts, state);
    case ActionType.PATCH:
      return patch(action.keyName, action.wineScript, state);
    default:
      return state;
  }
};
