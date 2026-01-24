import { useNavigate } from 'react-router-dom';

export const useNavigateApp = () => {
  const navigate = useNavigate();

  const navigateToMenu = () => {
    navigate('');
  };

  const navigateToAppConfig = () => {
    navigate('../app-config');
  };

  const navigateToEnvPath = () => {
    navigate('../env-paths');
  };

  const navigateToLauncherConfig = () => {
    navigate('launcher-config');
  };

  return {
    navigateToMenu,
    navigateToAppConfig,
    navigateToEnvPath,
    navigateToLauncherConfig
  };
};
