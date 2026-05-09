import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from 'reactjs-shared-ui';
import { Provider } from 'react-redux';
import { store } from 'ui/public-api';
import { EnvProvider } from 'ui/public-api';
import { PidsProvider } from '@components/PidsProvider';
import { App } from './App.tsx';
import 'reactjs-shared-ui/styles.css';
import './main.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <ThemeProvider>
    <PidsProvider>
      <Provider store={store}>
        <EnvProvider
          standaloneApp
          development={true}
          APPLICATION_PATH_OVERRIDE={
            import.meta.env.DEV
              ? '/Users/mauriver/Wine/apps/Ricochet Infinity.app'
              : ''
          }
        >
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </EnvProvider>
      </Provider>
    </PidsProvider>
  </ThemeProvider>,
);

// Use contextBridge
window.ipcRenderer.on('main-process-message', (_event, message) => {
  console.log(message);
});
