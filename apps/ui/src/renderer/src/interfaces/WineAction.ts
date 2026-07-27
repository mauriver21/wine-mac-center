import { WineActionType as ActionType } from '@constants/actionTypes';
import { WineState } from '@interfaces/WineState';

export type WineAction =
  | {
      type: ActionType.SET_REPOSITORY_DOWNLOADED;
      repositoryDownloaded: WineState['repositoryDownloaded'];
    }
  | {
      type: ActionType.SET_DEPENDENCIES_INSTALLATION_OUTPUT;
      dependenciesInstallationOutput: WineState['dependenciesInstallationOutput'];
    }
  | { type: ActionType.SET_TAGS; wineTags: WineState['wineTags'] }
  | { type: ActionType.SET_SELECTED_TAG; selectedWineTag: WineState['selectedWineTag'] }
  | { type: ActionType.SET_CHECKOUT_OUTPUT; wineCheckoutOutput: WineState['wineCheckoutOutput'] }
  | { type: ActionType.LOADING; loaders: Partial<WineState['loaders']> };
