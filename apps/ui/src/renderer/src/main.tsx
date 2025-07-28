import ReactDOM from 'react-dom/client';
import { ThemeProvider } from 'reactjs-ui-core';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from '@store';
import { App } from './App';
import { AppSetup } from '@components/AppSetup';
import { EnvProvider } from '@components/EnvProvider';
import { NotificationsProvider } from '@components/NotificationsProvider';
import { WineAppPipelineProvider } from '@components/WineAppPipelineProvider';
import './main.css';
import { DirsWatcherProvider } from '@components/DirsWatcherProvider';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <ThemeProvider>
    <Provider store={store}>
      <NotificationsProvider>
        <EnvProvider>
          <DirsWatcherProvider>
            <WineAppPipelineProvider>
              <BrowserRouter>
                <AppSetup>
                  <App />
                </AppSetup>
              </BrowserRouter>
            </WineAppPipelineProvider>
          </DirsWatcherProvider>
        </EnvProvider>
      </NotificationsProvider>
    </Provider>
  </ThemeProvider>
);
