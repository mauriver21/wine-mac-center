import './main.css';
import 'reactjs-shared-ui/styles.css';
import { App } from './App';
import { AppSetup } from '@components/AppSetup';
import { BrowserRouter } from 'react-router-dom';
import { DirsWatcherProvider } from '@components/DirsWatcherProvider';
import { EnvProvider } from '@components/EnvProvider';
import { I18nProvider } from 'reactjs-shared-ui/i18next';
import { LoadingDialogProvider } from '@components/LoadingDialogProvider';
import { NotificationsProvider } from '@components/NotificationsProvider';
import { Provider } from 'react-redux';
import { SteamCliProvider } from '@components/SteamCliProvider';
import { store } from '@store';
import { ThemeProvider } from 'reactjs-shared-ui';
import { WineAppPipelineProvider } from '@components/WineAppPipelineProvider';
import * as resources from '@i18n/translations';
import ReactDOM from 'react-dom/client';
import { VersionDialogProvider } from '@components/VersionDialogProvider';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <I18nProvider language="es" resources={resources}>
    <ThemeProvider>
      <Provider store={store}>
        <NotificationsProvider>
          <EnvProvider>
            <LoadingDialogProvider>
              <VersionDialogProvider>
                <SteamCliProvider>
                  <DirsWatcherProvider>
                    <WineAppPipelineProvider>
                      <BrowserRouter>
                        <AppSetup>
                          <App />
                        </AppSetup>
                      </BrowserRouter>
                    </WineAppPipelineProvider>
                  </DirsWatcherProvider>
                </SteamCliProvider>
              </VersionDialogProvider>
            </LoadingDialogProvider>
          </EnvProvider>
        </NotificationsProvider>
      </Provider>
    </ThemeProvider>
  </I18nProvider>
);
