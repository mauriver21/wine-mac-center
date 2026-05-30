import { routes } from '@routes';
import { useEffect } from 'react';
import { useNavigate, useRoutes } from 'react-router-dom';

export const App = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (import.meta.env.PROD) {
      navigate('/#');
    }
  }, []);

  return useRoutes(routes);
};
