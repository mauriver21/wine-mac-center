import ReactDOM from 'react-dom/client';
import { ThemeProvider } from 'reactjs-shared-ui';
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

ReactDOM.createRoot(document.getElementById('root')!).render(
  <ThemeProvider>
    <Provider store={store}>
      <NotificationsProvider>
        <EnvProvider>
          <SteamCliProvider>
            <DirsWatcherProvider>
              <WineAppPipelineProvider>
                <BrowserRouter>
                  <AppSetup>
                    <LoadingDialogProvider>
                      <App />
                    </LoadingDialogProvider>
                  </AppSetup>
                </BrowserRouter>
              </WineAppPipelineProvider>
            </DirsWatcherProvider>
          </SteamCliProvider>
        </EnvProvider>
      </NotificationsProvider>
    </Provider>
  </ThemeProvider>
);
