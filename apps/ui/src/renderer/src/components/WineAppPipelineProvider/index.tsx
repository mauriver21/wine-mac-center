import { withWineAppPipelineProvider } from '@hocs/withWineAppPipelineProvider';

export interface WineAppPipelineProviderProps {
  children?: React.ReactNode;
}

export const WineAppPipelineProvider: React.FC<WineAppPipelineProviderProps> =
  withWineAppPipelineProvider(({ children }) => {
    return <>{children}</>;
  });
