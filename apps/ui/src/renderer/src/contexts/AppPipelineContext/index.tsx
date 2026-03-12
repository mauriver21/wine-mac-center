import { PipelineAction } from '@constants/enums';
import { createContext } from 'react';

export type AppPipelineContextType = {
  runWineAppPipeline: (args?: {
    fromJobIndex?: number | undefined;
    fromStepIndex?: number | undefined;
  }) => Promise<void>;
  running: boolean;
  action: PipelineAction;
};

export const AppPipelineContext = createContext<AppPipelineContextType>({} as any);
