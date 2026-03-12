import { createContext } from 'react';

export type AppPipelineContextType = {
  runWineAppPipeline: (args?: {
    fromJobIndex?: number | undefined;
    fromStepIndex?: number | undefined;
  }) => Promise<void>;
};

export const AppPipelineContext = createContext<AppPipelineContextType>({} as any);
