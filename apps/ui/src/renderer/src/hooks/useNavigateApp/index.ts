import { ConfigOrigin, PipelineAction } from '@constants/enums';
import { useNavigate } from 'react-router-dom';

export const useNavigateApp = () => {
  const navigate = useNavigate();

  const navigateToHome = () => {
    navigate('/home');
  };

  const navigateToApps = () => {
    navigate('/apps');
  };

  const navigateToAppNotFound = (appName: string) => {
    navigate(`/app-not-found/${appName}`);
  };

  const navigateToScripts = () => {
    navigate(`/scripts`);
  };

  const navigateToScript = (appName?: string) => {
    if (appName) {
      navigate(`/script/${appName}`);
    } else {
      navigate(`/script`);
    }
  };

  const navigateToAppLauncher = (appName: string | undefined) => {
    navigate(`/app-launcher/${appName}`);
  };

  const navigateToAppPipeline = (
    appName: string | undefined,
    params: { origin: ConfigOrigin; action: PipelineAction }
  ) => {
    navigate(`/app-pipeline/${appName}?origin=${params.origin}&action=${params.action}`);
  };

  const navigateToAppConfig = (appName: string | undefined) => {
    navigate(`/app-config/${appName}`);
  };

  return {
    navigateToAppPipeline,
    navigateToApps,
    navigateToAppNotFound,
    navigateToHome,
    navigateToScripts,
    navigateToScript,
    navigateToAppConfig,
    navigateToAppLauncher
  };
};
