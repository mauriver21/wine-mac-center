import { useNavigate } from 'react-router-dom';

export const useNavigateApp = () => {
  const navigate = useNavigate();

  const navigateToAppPipeline = (appConfigId: string | undefined) => {
    navigate(`/app-pipeline?appConfigId=${appConfigId}`);
  };

  const navigateToHome = () => {
    navigate('/home');
  };

  const navigateToApps = () => {
    navigate('/apps');
  };

  const navigateToAppNotFound = (realAppName: string) => {
    navigate(`/app-not-found/${realAppName}`);
  };

  const navigateToCreateScript = () => {
    navigate(`/create-script`);
  };

  return {
    navigateToAppPipeline,
    navigateToApps,
    navigateToAppNotFound,
    navigateToHome,
    navigateToCreateScript
  };
};
