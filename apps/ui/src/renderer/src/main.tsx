import ReactDOM from 'react-dom/client';
import { ThemeProvider } from 'reactjs-shared-ui';
import { I18nProvider } from 'reactjs-shared-ui/i18next';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from '@store';
import { App } from './App';
import { AppSetup } from '@components/AppSetup';
import { EnvProvider } from '@components/EnvProvider';
import { NotificationsProvider } from '@components/NotificationsProvider';
import { WineAppPipelineProvider } from '@components/WineAppPipelineProvider';
import { DirsWatcherProvider } from '@components/DirsWatcherProvider';
import 'reactjs-shared-ui/styles.css';
import './main.css';
import { SteamCliProvider } from '@components/SteamCliProvider';
import { LoadingDialogProvider } from '@components/LoadingDialogProvider';
import * as resources from '@i18n/translations';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <I18nProvider language="es" resources={resources}>
    <ThemeProvider>
      <Provider store={store}>
        <NotificationsProvider>
          <EnvProvider>
            <LoadingDialogProvider>
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
            </LoadingDialogProvider>
          </EnvProvider>
        </NotificationsProvider>
      </Provider>
    </ThemeProvider>
  </I18nProvider>
);
