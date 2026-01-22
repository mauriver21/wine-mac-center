import { useRoutes } from 'react-router-dom';
import { routes } from '@app-launcher/routes';
import { useResolveAppName } from '@hooks/useResolveAppName';
import { WineAppProvider } from '@components/WineAppProvider';

export const App: React.FC = () => {
  const appName = useResolveAppName();
  return <WineAppProvider appName={appName}>{useRoutes(routes)}</WineAppProvider>;
};
