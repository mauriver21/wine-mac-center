import { WineScriptActionType as ActionType } from '@constants/actionTypes';
import { WineScriptState } from '@interfaces/WineScriptState';
import { Flatten } from '@interfaces/Flatten';

export type WineScriptAction =
  | {
      type: ActionType.LIST_ALL;
      wineScripts: WineScriptState['wineScripts'];
    }
  | {
      type: ActionType.PATCH;
      keyName: string;
      wineScript: Partial<Flatten<WineScriptState['wineScripts']>>;
    };
