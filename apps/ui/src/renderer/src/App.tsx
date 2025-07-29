import { useNavigateApp } from '@hooks/useNavigateApp';
import { routes } from '@routes';
import { isIntegration } from '@utils/isIntegration';
import { useEffect } from 'react';
import { useRoutes } from 'react-router-dom';

export const App = () => {
  const { navigateToHome } = useNavigateApp();

  useEffect(() => {
    isIntegration() && navigateToHome();
  }, []);

  //Fix: Outlet not working https://github.com/remix-run/react-router/issues/11480
  return useRoutes(routes);
};
