import { WineAppConfigActionType as ActionType } from '@constants/actionTypes';
import { Flatten } from '@interfaces/Flatten';
import { WineAppConfigState } from '@interfaces/WineAppConfigState';

export type WineAppConfigAction =
  | {
      type: ActionType.REMOVE;
      appName: string;
    }
  | {
      type: ActionType.LIST_ALL;
      wineAppsConfigs: WineAppConfigState['wineAppsConfigs'];
    }
  | {
      type: ActionType.SAVE;
      wineAppConfig: Flatten<WineAppConfigState['wineAppsConfigs']>;
    };
