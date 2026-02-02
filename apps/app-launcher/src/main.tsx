import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { App } from './App.tsx';
import { ThemeProvider } from 'reactjs-shared-ui';
import { Provider } from 'react-redux';
import { store } from 'ui/public-api';
import 'reactjs-shared-ui/styles.css';
import './main.css';
import { EnvProvider } from 'ui/public-api';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <ThemeProvider>
    <Provider store={store}>
      <EnvProvider
        standaloneApp
        development={true}
        APPLICATION_PATH_OVERRIDE="/Users/mauriver/Wine/apps/Ricochet Infinity.app"
      >
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </EnvProvider>
    </Provider>
  </ThemeProvider>,
);

// Use contextBridge
window.ipcRenderer.on('main-process-message', (_event, message) => {
  console.log(message);
});
