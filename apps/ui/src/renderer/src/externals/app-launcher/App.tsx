import { useRoutes } from 'react-router-dom';
import { routes } from '@app-launcher/routes';
import { useResolveAppName } from '@hooks/useResolveAppName';
import { WineAppProvider, WineAppProviderProps } from '@components/WineAppProvider';

export interface AppProps {
  onInitialized?: WineAppProviderProps['onInitialized'];
}

export const App: React.FC<AppProps> = ({ onInitialized }) => {
  const appName = useResolveAppName();
  return (
    <WineAppProvider onInitialized={onInitialized} appName={appName}>
      {useRoutes(routes)}
    </WineAppProvider>
  );
};
