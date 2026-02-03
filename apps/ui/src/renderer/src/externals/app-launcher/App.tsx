import { useRoutes } from 'react-router-dom';
import { routes } from '@app-launcher/routes';
import { useResolveAppName } from '@hooks/useResolveAppName';
import { WineAppProvider } from '@components/WineAppProvider';

export interface AppProps {
  autorun?: boolean;
}

export const App: React.FC<AppProps> = ({ autorun }) => {
  const appName = useResolveAppName();
  return (
    <WineAppProvider autorun={autorun} appName={appName}>
      {useRoutes(routes)}
    </WineAppProvider>
  );
};
