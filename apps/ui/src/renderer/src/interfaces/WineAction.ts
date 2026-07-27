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
  | { type: ActionType.LOADING; loaders: Partial<WineState['loaders']> };
