import './index.css';
import 'reactjs-shared-ui/styles.css';
import { App } from './App.tsx';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import { I18nProvider } from 'reactjs-shared-ui/i18next';
import { ThemeProvider } from 'reactjs-shared-ui';
import * as resources from '@i18n/translations';

createRoot(document.getElementById('root')!).render(
  <I18nProvider resources={resources}>
    <HashRouter>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </HashRouter>
  </I18nProvider>,
);
