import { useNavigateApp } from '@hooks/useNavigateApp';
import { useWineInstalledAppModel } from '@models/useWineInstalledAppModel';
import { routes } from '@routes';
import { isIntegration } from '@utils/isIntegration';
import { isProduction } from '@utils/isProduction';
import { isTest } from '@utils/isTest';
import { useLayoutEffect } from 'react';
import { useSelector } from 'react-redux';
import { useRoutes } from 'react-router-dom';
import { useI18n } from 'reactjs-shared-ui/i18next';

export const App = () => {
  const wineInstalledAppModel = useWineInstalledAppModel();
  const wineInstalledApps = useSelector(wineInstalledAppModel.selectWineInstalledApps);
  const { navigateToScripts, navigateToApps, navigateToTest } = useNavigateApp();

  console.log(import.meta.env.VITE_APP_VERSION);

  useI18n();

  useLayoutEffect(() => {
    if (isTest()) {
      navigateToTest();
    } else if (isIntegration() || isProduction()) {
      wineInstalledApps?.length ? navigateToApps() : navigateToScripts();
    }
  }, []);

  //Fix: Outlet not working https://github.com/remix-run/react-router/issues/11480
  return useRoutes(routes);
};
