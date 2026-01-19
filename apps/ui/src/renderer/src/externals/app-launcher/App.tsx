import { useRoutes } from 'react-router-dom';
import { routes } from '@app-launcher/routes';

export const App: React.FC = () => {
  return useRoutes(routes);
};
