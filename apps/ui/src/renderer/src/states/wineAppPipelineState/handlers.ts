import { WineAppPipelineState } from '@interfaces/WineAppPipelineState';

export const patch = (
  pipelineStatus: WineAppPipelineState['pipelineConfig'],
  state: WineAppPipelineState
): WineAppPipelineState => {
  return {
    ...state,
    pipelineConfig: {
      ...state.pipelineConfig,
      ...pipelineStatus
    } as WineAppPipelineState['pipelineConfig']
  };
};

export const remove = (state: WineAppPipelineState): WineAppPipelineState => ({
  ...state,
  pipelineConfig: undefined
});
