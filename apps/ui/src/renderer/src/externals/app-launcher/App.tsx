import { useRoutes } from 'react-router-dom';
import { routes } from '@app-launcher/routes';
import { useResolveAppName } from '@hooks/useResolveAppName';
import { WineAppProvider, WineAppProviderProps } from '@components/WineAppProvider';
import { I18nProvider } from 'reactjs-shared-ui/i18next';
import * as resources from '@i18n/translations';

export interface AppProps {
  onInitialized?: WineAppProviderProps['onInitialized'];
  onUpdateAppLauncherConfig?: WineAppProviderProps['onUpdateAppLauncherConfig'];
}

export const App: React.FC<AppProps> = ({ onInitialized, onUpdateAppLauncherConfig }) => {
  const appName = useResolveAppName();
  return (
    <I18nProvider language="es" resources={resources}>
      <WineAppProvider
        onInitialized={onInitialized}
        onUpdateAppLauncherConfig={onUpdateAppLauncherConfig}
        appName={appName}
      >
        {useRoutes(routes)}
      </WineAppProvider>
    </I18nProvider>
  );
};
