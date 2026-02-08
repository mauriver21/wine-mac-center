import { useRoutes } from 'react-router-dom';
import { routes } from '@app-launcher/routes';
import { useResolveAppName } from '@hooks/useResolveAppName';
import { WineAppProvider, WineAppProviderProps } from '@components/WineAppProvider';

export interface AppProps {
  onInitialized?: WineAppProviderProps['onInitialized'];
  onUpdateAppLauncherConfig?: WineAppProviderProps['onUpdateAppLauncherConfig'];
}

export const App: React.FC<AppProps> = ({ onInitialized, onUpdateAppLauncherConfig }) => {
  const appName = useResolveAppName();
  return (
    <WineAppProvider
      onInitialized={onInitialized}
      onUpdateAppLauncherConfig={onUpdateAppLauncherConfig}
      appName={appName}
    >
      {useRoutes(routes)}
    </WineAppProvider>
  );
};
