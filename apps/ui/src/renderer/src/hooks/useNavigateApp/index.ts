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

  const navigateToAppNotFound = (realAppName: string) => {
    navigate(`/app-not-found/${realAppName}`);
  };

  const navigateToScripts = () => {
    navigate(`/scripts`);
  };

  const navigateToCreateScript = () => {
    navigate(`/create-script`);
  };

  const navigateToAppPipeline = (
    appName: string | undefined,
    params: { origin: ConfigOrigin; action: PipelineAction }
  ) => {
    navigate(`/app-pipeline/${appName}?origin=${params.origin}&action=${params.action}`);
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
