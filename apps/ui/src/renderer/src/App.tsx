import { useNavigateApp } from '@hooks/useNavigateApp';
import { routes } from '@routes';
import { isIntegration } from '@utils/isIntegration';
import { isProduction } from '@utils/isProduction';
import { useEffect } from 'react';
import { useRoutes } from 'react-router-dom';
import { useI18n } from 'reactjs-shared-ui/i18next';

export const App = () => {
  const { navigateToScripts } = useNavigateApp();
  useI18n();

  useEffect(() => {
    if (isIntegration() || isProduction()) {
      navigateToScripts();
    }
  }, []);

  //Fix: Outlet not working https://github.com/remix-run/react-router/issues/11480
  return useRoutes(routes);
};
