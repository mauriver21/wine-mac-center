import { useNavigate } from 'react-router-dom';

export const useNavigateApp = () => {
  const navigate = useNavigate();

  const navigateToHome = () => {
    navigate('/home');
  };

  const navigateToApps = () => {
    navigate('/apps');
  };

  const navigateToAppNotFound = (realAppName: string) => {
    navigate(`/app-not-found/${realAppName}`);
  };

  const navigateToScripts = () => {
    navigate(`/scripts`);
  };

  const navigateToCreateScript = () => {
    navigate(`/create-script`);
  };

  const navigateToAppPipeline = (appName: string) => {
    navigate(`/app-pipeline/${appName}`);
  };

  return {
    navigateToAppPipeline,
    navigateToApps,
    navigateToAppNotFound,
    navigateToHome,
    navigateToScripts,
    navigateToCreateScript
  };
};
