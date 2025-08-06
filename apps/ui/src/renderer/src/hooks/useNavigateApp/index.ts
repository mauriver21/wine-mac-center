import { useNavigate } from 'react-router-dom';

export const useNavigateApp = () => {
  const navigate = useNavigate();

  const navigateToAppPipelineByAppConfigId = (appConfigId: string | undefined) => {
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

  const navigateToScripts = () => {
    navigate(`/scripts`);
  };

  const navigateToCreateScript = () => {
    navigate(`/create-script`);
  };

  const navigateToAppPipelineByScriptKeyName = (scriptKeyName: string | undefined) => {
    navigate(`/app-pipeline?scriptKeyName=${scriptKeyName}`);
  };

  return {
    navigateToAppPipelineByAppConfigId,
    navigateToAppPipelineByScriptKeyName,
    navigateToApps,
    navigateToAppNotFound,
    navigateToHome,
    navigateToScripts,
    navigateToCreateScript
  };
};
