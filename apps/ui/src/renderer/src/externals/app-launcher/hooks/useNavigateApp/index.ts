import { useNavigate } from 'react-router-dom';

export const useNavigateApp = () => {
  const navigate = useNavigate();

  const navigateToMenu = () => {
    navigate('');
  };

  const navigateToAppConfig = () => {
    navigate('app-config');
  };

  return {
    navigateToMenu,
    navigateToAppConfig
  };
};
