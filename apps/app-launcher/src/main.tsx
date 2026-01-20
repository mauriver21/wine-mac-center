import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { App } from './App.tsx';
import { ThemeProvider } from 'reactjs-shared-ui';
import { Provider } from 'react-redux';
import { store } from 'ui/redux-store';
import 'reactjs-shared-ui/styles.css';
import './main.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <ThemeProvider>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </ThemeProvider>,
);

// Use contextBridge
window.ipcRenderer.on('main-process-message', (_event, message) => {
  console.log(message);
});
