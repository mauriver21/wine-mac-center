import { WineAppPipelineActionType as ActionType } from '@constants/actionTypes';
import { Flatten } from '@interfaces/Flatten';
import { WineAppPipelineState } from '@interfaces/WineAppPipelineState';

export type WineAppPipelineAction =
  | {
      type: ActionType.PATCH;
      pipelineConfig: Flatten<WineAppPipelineState['pipelineConfig']>;
    }
  | {
      type: ActionType.REMOVE;
    };
