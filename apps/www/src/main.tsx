import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App.tsx';
import { ThemeProvider } from 'reactjs-shared-ui';
import { I18nProvider } from 'reactjs-shared-ui/i18next';
import * as resources from '@i18n/translations';
import { BrowserRouter } from 'react-router-dom';
import 'reactjs-shared-ui/styles.css';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <I18nProvider resources={resources}>
    <BrowserRouter>
      <ThemeProvider>
        <StrictMode>
          <App />
        </StrictMode>
      </ThemeProvider>
    </BrowserRouter>
  </I18nProvider>,
);
